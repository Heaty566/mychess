import { UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, SocketExtend } from 'socket.io';

//---- Pipe
import { SocketJoiValidatorPipe } from '../utils/validator/socketValidator.pipe';

//---- Service
import { UserSocketGuard } from '../auth/authSocket.guard';
import { TicTacToeService } from './ticTacToe.service';
import { TicTacToeCommonService } from './ticTacToeCommon.service';
import { TicTacToeBotService } from './ticTacToeBot.service';

//---- Entity
import { TicTacToeBoard } from './entity/ticTacToeBoard.entity';

//---- Dto
import { RoomIdDTO, vRoomIdDto } from './dto/roomIdDto';
import { AddMoveDto, vAddMoveDto } from './dto/addMoveDto';

//---- Common
import { ioResponse } from '../app/interface/socketResponse';
import { TTTGatewayAction } from './ticTacToe.action';

@WebSocketGateway({ namespace: 'tic-tac-toe' })
export class TicTacToeGateway {
      constructor(
            private readonly ticTacToeCommonService: TicTacToeCommonService,
            private readonly ticTacToeService: TicTacToeService,
            private readonly ticTacToeBotService: TicTacToeBotService,
      ) {}

      @WebSocketServer()
      server: Server;

      socketServer = () => ioResponse.getSocketServer(this.server);

      async sendToRoom(getCacheGame: TicTacToeBoard) {
            const board = await this.ticTacToeCommonService.getBoard(getCacheGame.id);
            return this.socketServer().socketEmitToRoom(TTTGatewayAction.TTT_GET, getCacheGame.id, { data: board }, 'ttt');
      }

      private async isPlaying(userId: string) {
            const isPlaying = await this.ticTacToeCommonService.isPlaying(userId);
            if (isPlaying) throw ioResponse.sendError({ details: { message: { type: 'game.already-join-other' } } }, 'BadRequestException');
      }

      private async getGameFromCache(roomId: string) {
            const game = await this.ticTacToeCommonService.getBoard(roomId);
            if (!game) throw ioResponse.sendError({ details: { roomId: { type: 'user.not-found' } } }, 'NotFoundException');

            return game;
      }

      private isExistUser(board: TicTacToeBoard, userId: string) {
            const getUser = this.ticTacToeCommonService.isExistUser(board, userId);
            if (!getUser) throw ioResponse.sendError({ details: { roomId: { type: 'user.not-allow-action' } } }, 'UnauthorizedException');
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTGatewayAction.TTT_JOIN)
      async handleJoinMatch(@ConnectedSocket() client: SocketExtend, @MessageBody(new SocketJoiValidatorPipe(vRoomIdDto)) body: RoomIdDTO) {
            const board = await this.getGameFromCache(body.roomId);
            if (!board) throw ioResponse.sendError({ details: { roomId: { type: 'user.not-found' } } }, 'NotFoundException');

            const isExistUser = this.ticTacToeCommonService.isExistUser(board, client.user.id);
            if (!isExistUser) throw ioResponse.sendError({ details: { message: { type: 'user.not-allow-action' } } }, 'ForbiddenException');
            await client.join(`ttt-${board.id}`);
            return this.socketServer().socketEmitToRoom<RoomIdDTO>(TTTGatewayAction.TTT_JOIN, board.id, {}, 'ttt');
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTGatewayAction.TTT_READY)
      async handleReadyGame(@ConnectedSocket() client: SocketExtend, @MessageBody(new SocketJoiValidatorPipe(vRoomIdDto)) body: RoomIdDTO) {
            const getCacheGame = await this.getGameFromCache(body.roomId);
            this.isExistUser(getCacheGame, client.user.id);

            const isReady = await this.ticTacToeService.toggleReadyStatePlayer(getCacheGame, client.user);
            if (!isReady) throw ioResponse.sendError({ details: { message: { type: 'game.wait-more-player' } } }, 'BadRequestException');

            return this.socketServer().socketEmitToRoom(TTTGatewayAction.TTT_READY, getCacheGame.id, {}, 'ttt');
      }
      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTGatewayAction.TTT_CREATE)
      async createGame(@ConnectedSocket() client: SocketExtend, @MessageBody(new SocketJoiValidatorPipe(vRoomIdDto)) body: RoomIdDTO) {
            const getCacheGame = await this.getGameFromCache(body.roomId);
            this.isExistUser(getCacheGame, client.user.id);

            await this.isPlaying(client.user.id);
            const board = await this.ticTacToeCommonService.createNewGame(client.user, false);

            return this.socketServer().socketEmitToRoom<RoomIdDTO>(TTTGatewayAction.TTT_CREATE, body.roomId, { data: { roomId: board.id } }, 'ttt');
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTGatewayAction.TTT_GET)
      async handleGetGame(@ConnectedSocket() client: SocketExtend, @MessageBody(new SocketJoiValidatorPipe(vRoomIdDto)) body: RoomIdDTO) {
            const getCacheGame = await this.getGameFromCache(body.roomId);
            this.isExistUser(getCacheGame, client.user.id);

            return this.socketServer().socketEmitToRoom(TTTGatewayAction.TTT_GET, getCacheGame.id, { data: getCacheGame }, 'ttt');
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTGatewayAction.TTT_START)
      async handleStartGame(@ConnectedSocket() client: SocketExtend, @MessageBody(new SocketJoiValidatorPipe(vRoomIdDto)) body: RoomIdDTO) {
            const getCacheGame = await this.getGameFromCache(body.roomId);
            this.isExistUser(getCacheGame, client.user.id);

            const isStart = await this.ticTacToeService.startGame(getCacheGame);
            if (!isStart) throw ioResponse.sendError({ details: { message: { type: 'game.wait-ready-player' } } }, 'BadRequestException');

            return this.socketServer().socketEmitToRoom(TTTGatewayAction.TTT_START, getCacheGame.id, {}, 'ttt');
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTGatewayAction.TTT_LEAVE)
      async handleLeaveGame(
            @ConnectedSocket()
            client: SocketExtend,
            @MessageBody(new SocketJoiValidatorPipe(vRoomIdDto))
            body: RoomIdDTO,
      ) {
            const getCacheGame = await this.getGameFromCache(body.roomId);
            this.isExistUser(getCacheGame, client.user.id);
            await this.ticTacToeService.leaveGame(getCacheGame, client.user);

            client.leave(`ttt-${getCacheGame.id}`);
            return this.socketServer().socketEmitToRoom(TTTGatewayAction.TTT_LEAVE, getCacheGame.id, {}, 'ttt');
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTGatewayAction.TTT_SURRENDER)
      async handleOnSurrender(@ConnectedSocket() client: SocketExtend, @MessageBody(new SocketJoiValidatorPipe(vRoomIdDto)) body: RoomIdDTO) {
            const getCacheGame = await this.getGameFromCache(body.roomId);
            this.isExistUser(getCacheGame, client.user.id);

            await this.ticTacToeService.surrender(getCacheGame, client.user);
            return this.socketServer().socketEmitToRoom(TTTGatewayAction.TTT_SURRENDER, getCacheGame.id, {}, 'ttt');
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTGatewayAction.TTT_ADD_MOVE)
      async handleOnAddMove(@ConnectedSocket() client: SocketExtend, @MessageBody(new SocketJoiValidatorPipe(vAddMoveDto)) body: AddMoveDto) {
            const getCacheGame = await this.getGameFromCache(body.roomId);
            this.isExistUser(getCacheGame, client.user.id);

            if (getCacheGame.board[body.x][body.y] !== -1)
                  throw ioResponse.sendError({ details: { message: { type: 'game.already-chose' } } }, 'BadRequestException');

            const isAddMove = await this.ticTacToeService.addMoveToBoard(getCacheGame, client.user, body.x, body.y);
            if (!isAddMove) throw ioResponse.sendError({ details: { message: { type: 'game.wrong-turn' } } }, 'BadRequestException');

            const isWin = await this.ticTacToeService.isWin(getCacheGame);

            if (isWin) {
                  this.socketServer().socketEmitToRoom(TTTGatewayAction.TTT_WIN, getCacheGame.id, {}, 'ttt');
                  await this.ticTacToeService.updateToDatabase(getCacheGame);
            }
            return this.socketServer().socketEmitToRoom(TTTGatewayAction.TTT_ADD_MOVE, getCacheGame.id, {}, 'ttt');
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTGatewayAction.TTT_BOT_BEST_MOVE)
      async handleBotMoveMatch(
            @MessageBody(new SocketJoiValidatorPipe(vAddMoveDto)) body: AddMoveDto,
            @ConnectedSocket()
            client: SocketExtend,
      ) {
            const getCacheGame = await this.getGameFromCache(body.roomId);
            this.isExistUser(getCacheGame, client.user.id);

            if (getCacheGame.board[body.x][body.y] !== -1)
                  throw ioResponse.sendError({ details: { message: { type: 'game.already-chose' } } }, 'BadRequestException');

            const isAddMove = await this.ticTacToeService.addMoveToBoard(getCacheGame, client.user, body.x, body.y);
            if (!isAddMove) throw ioResponse.sendError({ details: { message: { type: 'game.wrong-turn' } } }, 'BadRequestException');

            const getUpdateCacheGame = await this.getGameFromCache(body.roomId);
            const userMove = await this.ticTacToeBotService.findBestMove(getUpdateCacheGame.board, 1);
            const botMove = await this.ticTacToeBotService.findBestMove(getUpdateCacheGame.board, 0);

            const isWin = await this.ticTacToeService.isWin(getCacheGame);
            if (isWin) this.socketServer().socketEmitToRoom(TTTGatewayAction.TTT_WIN, getCacheGame.id, {}, 'ttt');
            else {
                  if (userMove.point >= botMove.point) await this.ticTacToeBotService.addMoveToBoardBot(body.roomId, userMove.x, userMove.y);
                  else await this.ticTacToeBotService.addMoveToBoardBot(body.roomId, botMove.x, botMove.y);
            }

            const getUpdateCacheGame1 = await this.getGameFromCache(body.roomId);
            const checkWin = await this.ticTacToeService.isWin(getUpdateCacheGame1);
            if (checkWin) this.socketServer().socketEmitToRoom(TTTGatewayAction.TTT_WIN, getCacheGame.id, {}, 'ttt');

            return this.socketServer().socketEmitToRoom(TTTGatewayAction.TTT_BOT_BEST_MOVE, getCacheGame.id, {}, 'ttt');
      }
}
