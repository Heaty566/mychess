import { UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, SocketExtend } from 'socket.io';
import { UserSocketGuard } from '../auth/authSocket.guard';
import { TicTacToeService } from './ticTacToe.service';
import { ioResponse } from '../app/interface/socketResponse';
import { RoomIdDTO, vRoomIdDto } from './dto/roomIdDto';
import { SocketJoiValidatorPipe } from '../utils/validator/SocketValidator.pipe';
import { TTTBotAction } from './ticTacToeBot.action';
import { TicTacToeCommonService } from './ticTacToeCommon.service';
import { TicTacToeBoard } from './entity/ticTacToeBoard.entity';
import { AddMoveDto, vAddMoveDto } from './dto/addMoveDto';
import { TicTacToe } from './entity/ticTacToe.entity';
import { v4 as uuidv4 } from 'uuid';
import { TicTacToeBotService } from './ticTacToeBot.service';

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
            if (isPlaying)
                  return this.socketServer().socketEmitToRoomError('BadRequestException', userId, {
                        details: { message: { type: 'game.already-join-other' } },
                  });
      }

      private async getGameFromCache(roomId: string) {
            const game = await this.ticTacToeCommonService.getBoard(roomId);
            if (!game) throw ioResponse.sendError({ details: { roomId: { type: 'user.not-found' } } }, 'NotFoundException');
            return game;
      }

      private isOwner(game: TicTacToeBoard, client: SocketExtend) {
            const isOwner = game.users.find((item) => item.id === client.user.id);
            if (!isOwner)
                  return this.socketServer().socketEmitToRoomError('UnauthorizedException', client.user.id, {
                        details: { roomId: { type: 'user.auth-failed' } },
                  });
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

            const getCacheGame = await this.getGameFromCache(body.roomId);
            this.isOwner(getCacheGame, client);

            const isStart = await this.ticTacToeService.startGame(body.roomId, client.user);
            if (!isStart)
                  return this.socketServer().socketEmitToRoomError('BadRequestException', client.user.id, {
                        details: { message: { type: 'game.wait-ready-player' } },
                  });

            return this.socketServer().socketEmitToRoom(TTTBotAction.TTT_BOT_START, getCacheGame.info.id, {}, 'tic-tac-toe-bot');
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTBotAction.TTT_BOT_MOVE)
      async handleBotMoveMatch(
            @ConnectedSocket()
            client: SocketExtend,
            @MessageBody(new SocketJoiValidatorPipe(vAddMoveDto)) body: AddMoveDto,
      ) {
            const getCacheGame = await this.getGameFromCache(body.roomId);
            this.isOwner(getCacheGame, client);

            if (getCacheGame.board[body.x][body.y] !== -1)
                  return this.socketServer().socketEmitToRoomError('BadRequestException', client.user.id, {
                        details: { message: { type: 'game.already-chose' } },
                  });

            const isAddMove = await this.ticTacToeService.addMoveToBoard(body.roomId, client.user, body.x, body.y);
            if (!isAddMove)
                  return this.socketServer().socketEmitToRoomError('BadRequestException', client.user.id, {
                        details: { message: { type: 'game.wrong-turn' } },
                  });

            const getUpdateCacheGame = await this.getGameFromCache(body.roomId);
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
            const getCacheGame = await this.getGameFromCache(body.roomId);
            this.isOwner(getCacheGame, client);

            await this.ticTacToeCommonService.deleteBoard(body.roomId);

            return this.socketServer().socketEmitToRoom(TTTBotAction.TTT_BOT_LEAVE, getCacheGame.info.id, { data: {} }, 'tic-tac-toe-bot');
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTBotAction.TTT_BOT_GET)
      async handleGetGame(@ConnectedSocket() client: SocketExtend, @MessageBody(new SocketJoiValidatorPipe(vRoomIdDto)) body: RoomIdDTO) {
            const getCacheGame = await this.getGameFromCache(body.roomId);
            this.isOwner(getCacheGame, client);

            return this.socketServer().socketEmitToRoom(TTTBotAction.TTT_BOT_GET, getCacheGame.info.id, { data: getCacheGame }, 'tic-tac-toe-bot');
      }
}
