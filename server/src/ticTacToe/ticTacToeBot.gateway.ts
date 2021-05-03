import { UseGuards, UsePipes } from '@nestjs/common';
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
import { TicTacToeStatus } from './entity/ticTacToe.interface';

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
            if (isPlaying) throw ioResponse.sendError({ details: { message: { type: 'game.already-join-other' } } }, 'BadRequestException');
      }

      private async getGameFromCache(roomId: string) {
            const game = await this.ticTacToeCommonService.getBoard(roomId);
            if (!game) throw ioResponse.sendError({ details: { roomId: { type: 'user.not-found' } } }, 'NotFoundException');

            return game;
      }

      private isOwner(game: TicTacToeBoard, userId: string) {
            const isOwner = game.users.find((item) => item.id === userId);
            if (!isOwner) throw ioResponse.sendError({ details: { roomId: { type: 'user.auth-failed' } } }, 'UnauthorizedException');
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTBotAction.TTT_BOT_CREATE)
      async handleCreateMatch(@ConnectedSocket() client: SocketExtend) {
            await this.isPlaying(client.user.id);

            const ttt = new TicTacToe();
            ttt.id = uuidv4();
            const bot = this.ticTacToeBotService.getBotInfo();
            const board = new TicTacToeBoard(ttt);
            board.currentTurn = true;
            board.info.status = TicTacToeStatus['NOT-YET'];
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
            this.isOwner(getCacheGame, client.user.id);

            const isStart = await this.ticTacToeService.startGame(body.roomId, client.user);
            if (!isStart) throw ioResponse.sendError({ details: { message: { type: 'game.wait-ready-player' } } }, 'BadRequestException');

            return this.socketServer().socketEmitToRoom(TTTBotAction.TTT_BOT_START, getCacheGame.info.id, {}, 'tic-tac-toe-bot');
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTBotAction.TTT_BOT_MOVE)
      async handleBotMoveMatch(
            @MessageBody(new SocketJoiValidatorPipe(vAddMoveDto)) body: AddMoveDto,
            @ConnectedSocket()
            client: SocketExtend,
      ) {
            const getCacheGame = await this.getGameFromCache(body.roomId);
            this.isOwner(getCacheGame, client.user.id);

            if (getCacheGame.board[body.x][body.y] !== -1)
                  throw ioResponse.sendError({ details: { message: { type: 'game.already-chose' } } }, 'BadRequestException');

            const isAddMove = await this.ticTacToeService.addMoveToBoard(body.roomId, client.user, body.x, body.y);
            if (!isAddMove) throw ioResponse.sendError({ details: { message: { type: 'game.wrong-turn' } } }, 'BadRequestException');

            const getUpdateCacheGame = await this.getGameFromCache(body.roomId);
            const userMove = await this.ticTacToeBotService.findBestMove(getUpdateCacheGame.board, 0);
            const botMove = await this.ticTacToeBotService.findBestMove(getUpdateCacheGame.board, 1);

            const isWin = await this.ticTacToeService.isWin(body.roomId);
            if (isWin) this.socketServer().socketEmitToRoom(TTTBotAction.TTT_BOT_WIN, getCacheGame.info.id, {}, 'tic-tac-toe-bot');
            else {
                  if (userMove.point >= botMove.point) await this.ticTacToeBotService.addMoveToBoardBot(body.roomId, userMove.x, userMove.y);
                  else await this.ticTacToeBotService.addMoveToBoardBot(body.roomId, botMove.x, botMove.y);
            }
            const checkWin = await this.ticTacToeService.isWin(body.roomId);
            if (checkWin) this.socketServer().socketEmitToRoom(TTTBotAction.TTT_BOT_WIN, getCacheGame.info.id, {}, 'tic-tac-toe-bot');

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
            this.isOwner(getCacheGame, client.user.id);
            await this.ticTacToeCommonService.deleteBoard(body.roomId);
            client.leave(`tic-tac-toe-bot-${getCacheGame.info.id}`);
            return this.socketServer().socketEmitToRoom(TTTBotAction.TTT_BOT_LEAVE, getCacheGame.info.id, { data: {} }, 'tic-tac-toe-bot');
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTBotAction.TTT_BOT_GET)
      async handleGetGame(@ConnectedSocket() client: SocketExtend, @MessageBody(new SocketJoiValidatorPipe(vRoomIdDto)) body: RoomIdDTO) {
            const getCacheGame = await this.getGameFromCache(body.roomId);
            this.isOwner(getCacheGame, client.user.id);

            return this.socketServer().socketEmitToRoom(TTTBotAction.TTT_BOT_GET, getCacheGame.info.id, { data: getCacheGame }, 'tic-tac-toe-bot');
      }
}
