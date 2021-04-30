import { UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, SocketExtend } from 'socket.io';
import { UserSocketGuard } from '../auth/authSocket.guard';
import { TicTacToeService } from './ticTacToe.service';
import { ioResponse } from '../app/interface/socketResponse';
import { RoomIdDTO, vRoomIdDto } from './dto/roomIdDto';
import { SocketJoiValidatorPipe } from '../utils/validator/SocketValidator.pipe';
import { TTTAction } from './ticTacToe.action';
import { TicTacToeCommonService } from './ticTacToeCommon.service';
import { TicTacToeStatus } from './entity/ticTacToe.interface';
import { TicTacToeBoard } from './entity/ticTacToeBoard.entity';
import { AddMoveDto, vAddMoveDto } from './dto/addMoveDto';
import { ErrorType, ResponseBody } from '../app/interface/api.interface';

@WebSocketGateway({ namespace: 'tic-tac-toe' })
export class TicTacToeGateway {
      constructor(private readonly ticTacToeCommonService: TicTacToeCommonService, private readonly ticTacToeService: TicTacToeService) {}

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
      @SubscribeMessage(TTTAction.TTT_CREATE)
      async handleCreateMatch(@ConnectedSocket() client: SocketExtend) {
            await this.isPlaying(client.user.id);

            const newGameId = await this.ticTacToeCommonService.createNewGame(client.user);
            await client.join(`tic-tac-toe-${newGameId}`);

            await this.ticTacToeService.loadGameToCache(newGameId);
            await this.ticTacToeService.joinGame(newGameId, client.user);

            return this.socketServer().socketEmitToRoom<RoomIdDTO>(TTTAction.TTT_CREATE, newGameId, { data: { roomId: newGameId } }, 'tic-tac-toe');
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTAction.TTT_JOIN)
      async handleJoinMatch(@ConnectedSocket() client: SocketExtend, @MessageBody(new SocketJoiValidatorPipe(vRoomIdDto)) body: RoomIdDTO) {
            await this.isPlaying(client.user.id);
            const getCacheGame = await this.getGameFromCache(body.roomId);

            if (getCacheGame.info.users.length >= 2)
                  return this.socketServer().socketEmitToRoomError('BadRequestException', client.user.id, {
                        details: { message: { type: 'game.full-player' } },
                  });

            if (getCacheGame.info.status !== TicTacToeStatus['NOT-YET'])
                  return this.socketServer().socketEmitToRoomError('BadRequestException', client.user.id, {
                        details: { message: { type: 'game.already-playing' } },
                  });

            const getRoom = await this.ticTacToeCommonService.getOneMatchByFiled('tic.id = :roomId', { roomId: body.roomId });
            if (!getRoom)
                  return this.socketServer().socketEmitToRoomError('NotFoundException', client.user.id, {
                        details: { roomId: { type: 'user.not-found' } },
                  });

            getRoom.users.push(client.user);
            const updateTTT = await this.ticTacToeCommonService.saveTicTacToe(getRoom);

            const isJoin = await this.ticTacToeService.joinGame(updateTTT.id, client.user);
            if (!isJoin)
                  return this.socketServer().socketEmitToRoomError('BadRequestException', client.user.id, {
                        details: { message: { type: 'game.already-join' } },
                  });

            return this.socketServer().socketEmitToRoom<RoomIdDTO>(TTTAction.TTT_JOIN, getCacheGame.info.id, {}, 'tic-tac-toe');
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTAction.TTT_GET)
      async handleGetGame(@ConnectedSocket() client: SocketExtend, @MessageBody(new SocketJoiValidatorPipe(vRoomIdDto)) body: RoomIdDTO) {
            const getCacheGame = await this.getGameFromCache(body.roomId);

            return this.socketServer().socketEmitToRoom(TTTAction.TTT_GET, getCacheGame.info.id, { data: getCacheGame }, 'tic-tac-toe');
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTAction.TTT_READY)
      async handleReadyGame(@ConnectedSocket() client: SocketExtend, @MessageBody(new SocketJoiValidatorPipe(vRoomIdDto)) body: RoomIdDTO) {
            const getCacheGame = await this.getGameFromCache(body.roomId);
            this.isOwner(getCacheGame, client);

            const isReady = await this.ticTacToeService.toggleReadyStatePlayer(body.roomId, client.user);
            if (!isReady)
                  return this.socketServer().socketEmitToRoomError('BadRequestException', client.user.id, {
                        details: { message: { type: 'game.wait-more-player' } },
                  });

            return this.socketServer().socketEmitToRoom(TTTAction.TTT_READY, getCacheGame.info.id, {}, 'tic-tac-toe');
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTAction.TTT_START)
      async handleStartGame(@ConnectedSocket() client: SocketExtend, @MessageBody(new SocketJoiValidatorPipe(vRoomIdDto)) body: RoomIdDTO) {
            const getCacheGame = await this.getGameFromCache(body.roomId);
            this.isOwner(getCacheGame, client);

            const isStart = await this.ticTacToeService.startGame(body.roomId, client.user);
            if (!isStart)
                  return this.socketServer().socketEmitToRoomError('BadRequestException', client.user.id, {
                        details: { message: { type: 'game.wait-ready-player' } },
                  });

            return this.socketServer().socketEmitToRoom(TTTAction.TTT_START, getCacheGame.info.id, {}, 'tic-tac-toe');
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTAction.TTT_LEAVE)
      async handleLeaveGame(
            @ConnectedSocket()
            client: SocketExtend,
            @MessageBody(new SocketJoiValidatorPipe(vRoomIdDto))
            body: RoomIdDTO,
      ) {
            const getCacheGame = await this.getGameFromCache(body.roomId);
            this.isOwner(getCacheGame, client);

            await this.ticTacToeService.leaveGame(body.roomId, client.user);
            return this.socketServer().socketEmitToRoom(TTTAction.TTT_LEAVE, getCacheGame.info.id, {}, 'tic-tac-toe');
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTAction.TTT_ADD_MOVE)
      async handleOnAddMove(@ConnectedSocket() client: SocketExtend, @MessageBody(new SocketJoiValidatorPipe(vAddMoveDto)) body: AddMoveDto) {
            const getCacheGame = await this.getGameFromCache(body.roomId);
            this.isOwner(getCacheGame, client);

            if (getCacheGame.board[body.x][body.y] === -1)
                  return this.socketServer().socketEmitToRoomError('BadRequestException', client.user.id, {
                        details: { message: { type: 'game.already-chose' } },
                  });

            const isWin = await this.ticTacToeService.isWin(body.roomId);
            if (isWin) {
                  this.socketServer().socketEmitToRoom(TTTAction.TTT_WIN, getCacheGame.info.id, {}, 'tic-tac-toe');
                  await this.ticTacToeService.updateToDatabase(body.roomId);
            }

            await this.ticTacToeService.addMoveToBoard(body.roomId, client.user, body.x, body.y);
            return this.socketServer().socketEmitToRoom(TTTAction.TTT_ADD_MOVE, getCacheGame.info.id, {}, 'tic-tac-toe');
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTAction.TTT_SURRENDER)
      async handleOnSurrender(@ConnectedSocket() client: SocketExtend, @MessageBody(new SocketJoiValidatorPipe(vRoomIdDto)) body: RoomIdDTO) {
            const getCacheGame = await this.getGameFromCache(body.roomId);
            this.isOwner(getCacheGame, client);

            await this.ticTacToeService.surrender(body.roomId, client.user);
            return this.socketServer().socketEmitToRoom(TTTAction.TTT_SURRENDER, getCacheGame.info.id, {}, 'tic-tac-toe');
      }
}
