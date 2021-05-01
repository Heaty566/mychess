import { UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { v4 as uuidv4 } from 'uuid';
import { Server, SocketExtend } from 'socket.io';

//---- pipe
import { SocketJoiValidatorPipe } from '../utils/validator/socketValidator.pipe';
import { UserSocketGuard } from '../auth/authSocket.guard';

//---- Service
import { TicTacToeBotService } from './ticTacToeBot.service';
import { TicTacToeCommonService } from './ticTacToeCommon.service';
import { TicTacToeService } from './ticTacToe.service';

//---- DTO
import { AddMoveDto, vAddMoveDto } from './dto/addMoveDto';
import { RoomIdDTO, vRoomIdDto } from './dto/roomIdDto';

//---- Entity
import { TicTacToeBoard } from './entity/ticTacToeBoard.entity';
import { TicTacToe } from './entity/ticTacToe.entity';

//---- Common
import { ioResponse } from '../app/interface/socketResponse';
import { TTTBotAction } from './ticTacToeBot.action';

@WebSocketGateway({ namespace: 'tic-tac-toe-bot' })
export class TicTacToeBotGateway {
      constructor(
            private readonly ticTacToeCommonService: TicTacToeCommonService,
            private readonly ticTacToeService: TicTacToeService,
            private readonly ticTacToeBotService: TicTacToeBotService,
      ) {}

      @WebSocketServer()
      server: Server;

      socketServer = () => ioResponse.getSocketServer(this.server);

      private async isPlaying(userId: string) {
            const isPlaying = await this.ticTacToeCommonService.isPlaying(userId);
            if (isPlaying) {
                  this.socketServer().socketEmitToRoomError(
                        'BadRequestException',
                        userId,
                        {
                              details: { message: { type: 'game.already-join-other' } },
                        },
                        'user',
                  );
                  return false;
            }
            return true;
      }

      private async getGameFromCache(roomId: string, userId: string) {
            const game = await this.ticTacToeCommonService.getBoard(roomId);
            if (!game) {
                  this.socketServer().socketEmitToRoomError('NotFoundException', userId, { details: { roomId: { type: 'user.not-found' } } }, 'user');
                  return null;
            }

            return game;
      }

      private isOwner(game: TicTacToeBoard, userId: string) {
            const isOwner = game.users.find((item) => item.id === userId);
            if (!isOwner) {
                  this.socketServer().socketEmitToRoomError(
                        'UnauthorizedException',
                        userId,
                        {
                              details: { roomId: { type: 'user.auth-failed' } },
                        },
                        'user',
                  );
                  return false;
            }
            return true;
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTBotAction.TTT_BOT_CONNECT)
      async handleConnectUser(@ConnectedSocket() client: SocketExtend) {
            await client.join(`user-${client.user.id}`);

            return this.socketServer().socketEmitToRoom(TTTBotAction.TTT_BOT_CONNECT, client.user.id, { data: {} }, 'user');
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTBotAction.TTT_BOT_CREATE)
      async handleCreateMatch(@ConnectedSocket() client: SocketExtend) {
            await this.isPlaying(client.user.id);

            const ttt = new TicTacToe();
            ttt.id = uuidv4();
            const bot = this.ticTacToeBotService.getBotInfo();
            const board = new TicTacToeBoard(ttt);
            board.info.users = [client.user, bot];
            board.users[1].ready = true;
            board.users[1].id = uuidv4();

            await this.ticTacToeCommonService.setBoard(board.info.id, board);
            await client.join(`tic-tac-toe-bot-${ttt.id}`);

            await this.ticTacToeService.joinGame(ttt.id, client.user);
            await this.ticTacToeService.toggleReadyStatePlayer(ttt.id, client.user);

            return this.socketServer().socketEmitToRoom<RoomIdDTO>(
                  TTTBotAction.TTT_BOT_CREATE,
                  ttt.id,
                  { data: { roomId: ttt.id } },
                  'tic-tac-toe-bot',
            );
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTBotAction.TTT_BOT_START)
      async handleStartMatch(
            @ConnectedSocket()
            client: SocketExtend,
            @MessageBody(new SocketJoiValidatorPipe(vRoomIdDto))
            body: RoomIdDTO,
      ) {
            await this.isPlaying(client.user.id);

            const getCacheGame = await this.getGameFromCache(body.roomId, client.user.id);
            if (!getCacheGame) return;

            const isOwner = this.isOwner(getCacheGame, client.user.id);
            if (!isOwner) return;

            const isStart = await this.ticTacToeService.startGame(body.roomId, client.user);
            if (!isStart)
                  return this.socketServer().socketEmitToRoomError(
                        'BadRequestException',
                        client.user.id,
                        {
                              details: { message: { type: 'game.wait-ready-player' } },
                        },
                        'user',
                  );

            return this.socketServer().socketEmitToRoom(TTTBotAction.TTT_BOT_START, getCacheGame.info.id, {}, 'tic-tac-toe-bot');
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTBotAction.TTT_BOT_MOVE)
      async handleBotMoveMatch(
            @ConnectedSocket()
            client: SocketExtend,
            @MessageBody(new SocketJoiValidatorPipe(vAddMoveDto)) body: AddMoveDto,
      ) {
            const getCacheGame = await this.getGameFromCache(body.roomId, client.user.id);
            if (!getCacheGame) return;

            const isOwner = this.isOwner(getCacheGame, client.user.id);
            if (!isOwner) return;

            if (getCacheGame.board[body.x][body.y] !== -1)
                  return this.socketServer().socketEmitToRoomError(
                        'BadRequestException',
                        client.user.id,
                        {
                              details: { message: { type: 'game.already-chose' } },
                        },
                        'user',
                  );

            const isAddMove = await this.ticTacToeService.addMoveToBoard(body.roomId, client.user, body.x, body.y);
            if (!isAddMove)
                  return this.socketServer().socketEmitToRoomError(
                        'BadRequestException',
                        client.user.id,
                        {
                              details: { message: { type: 'game.wrong-turn' } },
                        },
                        'user',
                  );

            const getUpdateCacheGame = await this.getGameFromCache(body.roomId, client.user.id);
            if (!getUpdateCacheGame) return;

            const userMove = await this.ticTacToeBotService.findBestMove(getUpdateCacheGame.board, 0);
            const botMove = await this.ticTacToeBotService.findBestMove(getUpdateCacheGame.board, 1);

            if (userMove.point >= botMove.point) await this.ticTacToeBotService.addMoveToBoardBot(body.roomId, userMove.x, userMove.y);
            else await this.ticTacToeBotService.addMoveToBoardBot(body.roomId, botMove.x, botMove.y);

            const isWin = await this.ticTacToeService.isWin(body.roomId);
            if (isWin) this.socketServer().socketEmitToRoom(TTTBotAction.TTT_BOT_WIN, getCacheGame.info.id, {}, 'tic-tac-toe-bot');

            return this.socketServer().socketEmitToRoom(TTTBotAction.TTT_BOT_MOVE, getCacheGame.info.id, {}, 'tic-tac-toe-bot');
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTBotAction.TTT_BOT_LEAVE)
      async handleLeaveMatch(
            @ConnectedSocket()
            client: SocketExtend,
            @MessageBody(new SocketJoiValidatorPipe(vRoomIdDto))
            body: RoomIdDTO,
      ) {
            const getCacheGame = await this.getGameFromCache(body.roomId, client.user.id);
            if (!getCacheGame) return;

            const isOwner = this.isOwner(getCacheGame, client.user.id);
            if (!isOwner) return;

            await this.ticTacToeCommonService.deleteBoard(body.roomId);

            return this.socketServer().socketEmitToRoom(TTTBotAction.TTT_BOT_LEAVE, getCacheGame.info.id, { data: {} }, 'tic-tac-toe-bot');
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTBotAction.TTT_BOT_GET)
      async handleGetGame(@ConnectedSocket() client: SocketExtend, @MessageBody(new SocketJoiValidatorPipe(vRoomIdDto)) body: RoomIdDTO) {
            const getCacheGame = await this.getGameFromCache(body.roomId, client.user.id);
            if (!getCacheGame) return;

            const isOwner = this.isOwner(getCacheGame, client.user.id);
            if (!isOwner) return;

            return this.socketServer().socketEmitToRoom(TTTBotAction.TTT_BOT_GET, getCacheGame.info.id, { data: getCacheGame }, 'tic-tac-toe-bot');
      }
}
