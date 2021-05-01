import { UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, SocketExtend } from 'socket.io';

//---- Pipe
import { SocketJoiValidatorPipe } from '../utils/validator/socketValidator.pipe';

//---- Service
import { UserSocketGuard } from '../auth/authSocket.guard';
import { TicTacToeService } from './ticTacToe.service';
import { TicTacToeCommonService } from './ticTacToeCommon.service';

//---- Entity
import { TicTacToeBoard } from './entity/ticTacToeBoard.entity';
import { TicTacToeStatus } from './entity/ticTacToe.interface';

//---- Dto
import { RoomIdDTO, vRoomIdDto } from './dto/roomIdDto';
import { AddMoveDto, vAddMoveDto } from './dto/addMoveDto';

//---- Common
import { ioResponse } from '../app/interface/socketResponse';
import { TTTAction } from './ticTacToe.action';

@WebSocketGateway({ namespace: 'tic-tac-toe' })
export class TicTacToeGateway {
      constructor(private readonly ticTacToeCommonService: TicTacToeCommonService, private readonly ticTacToeService: TicTacToeService) {}

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
      @SubscribeMessage(TTTAction.TTT_CONNECT)
      async handleConnectUser(@ConnectedSocket() client: SocketExtend) {
            await client.join(`user-${client.user.id}`);

            return this.socketServer().socketEmitToRoom(TTTAction.TTT_CONNECT, client.user.id, { data: {} }, 'user');
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTAction.TTT_CREATE)
      async handleCreateMatch(@ConnectedSocket() client: SocketExtend) {
            const isPlay = await this.isPlaying(client.user.id);
            if (!isPlay) return false;

            const newGameId = await this.ticTacToeCommonService.createNewGame(client.user);
            await this.ticTacToeService.loadGameToCache(newGameId);
            await client.join(`tic-tac-toe-${newGameId}`);

            await this.ticTacToeService.joinGame(newGameId, client.user);

            return this.socketServer().socketEmitToRoom<RoomIdDTO>(TTTAction.TTT_CREATE, newGameId, { data: { roomId: newGameId } }, 'tic-tac-toe');
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTAction.TTT_JOIN)
      async handleJoinMatch(@ConnectedSocket() client: SocketExtend, @MessageBody(new SocketJoiValidatorPipe(vRoomIdDto)) body: RoomIdDTO) {
            const isPlay = await this.isPlaying(client.user.id);
            if (!isPlay) return false;

            const getCacheGame = await this.getGameFromCache(body.roomId, client.user.id);
            if (!getCacheGame) return;

            if (getCacheGame.info.users.length >= 2)
                  return this.socketServer().socketEmitToRoomError(
                        'BadRequestException',
                        client.user.id,
                        {
                              details: { message: { type: 'game.full-player' } },
                        },
                        'user',
                  );

            if (getCacheGame.info.status !== TicTacToeStatus['NOT-YET'])
                  return this.socketServer().socketEmitToRoomError(
                        'BadRequestException',
                        client.user.id,
                        {
                              details: { message: { type: 'game.already-playing' } },
                        },
                        'user',
                  );

            const getRoom = await this.ticTacToeCommonService.getOneMatchByFiled('tic.id = :roomId', { roomId: body.roomId });
            if (!getRoom)
                  return this.socketServer().socketEmitToRoomError(
                        'NotFoundException',
                        client.user.id,
                        {
                              details: { roomId: { type: 'user.not-found' } },
                        },
                        'user',
                  );

            getRoom.users.push(client.user);
            const updateTTT = await this.ticTacToeCommonService.saveTicTacToe(getRoom);

            const isJoin = await this.ticTacToeService.joinGame(updateTTT.id, client.user);
            if (!isJoin)
                  return this.socketServer().socketEmitToRoomError(
                        'BadRequestException',
                        client.user.id,
                        {
                              details: { message: { type: 'game.already-join' } },
                        },
                        'user',
                  );

            return this.socketServer().socketEmitToRoom<RoomIdDTO>(TTTAction.TTT_JOIN, getCacheGame.info.id, {}, 'tic-tac-toe');
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTAction.TTT_GET)
      async handleGetGame(@ConnectedSocket() client: SocketExtend, @MessageBody(new SocketJoiValidatorPipe(vRoomIdDto)) body: RoomIdDTO) {
            const getCacheGame = await this.getGameFromCache(body.roomId, client.user.id);
            if (!getCacheGame) return;

            return this.socketServer().socketEmitToRoom(TTTAction.TTT_GET, getCacheGame.info.id, { data: getCacheGame }, 'tic-tac-toe');
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTAction.TTT_READY)
      async handleReadyGame(@ConnectedSocket() client: SocketExtend, @MessageBody(new SocketJoiValidatorPipe(vRoomIdDto)) body: RoomIdDTO) {
            const getCacheGame = await this.getGameFromCache(body.roomId, client.user.id);
            if (!getCacheGame) return;

            const isOwner = this.isOwner(getCacheGame, client.user.id);
            if (!isOwner) return;

            const isReady = await this.ticTacToeService.toggleReadyStatePlayer(body.roomId, client.user);
            if (!isReady)
                  return this.socketServer().socketEmitToRoomError(
                        'BadRequestException',
                        client.user.id,
                        {
                              details: { message: { type: 'game.wait-more-player' } },
                        },
                        'user',
                  );

            return this.socketServer().socketEmitToRoom(TTTAction.TTT_READY, getCacheGame.info.id, {}, 'tic-tac-toe');
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTAction.TTT_START)
      async handleStartGame(@ConnectedSocket() client: SocketExtend, @MessageBody(new SocketJoiValidatorPipe(vRoomIdDto)) body: RoomIdDTO) {
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
            const getCacheGame = await this.getGameFromCache(body.roomId, client.user.id);
            if (!getCacheGame) return;

            const isOwner = this.isOwner(getCacheGame, client.user.id);
            if (!isOwner) return;

            await this.ticTacToeService.leaveGame(body.roomId, client.user);
            return this.socketServer().socketEmitToRoom(TTTAction.TTT_LEAVE, getCacheGame.info.id, {}, 'tic-tac-toe');
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTAction.TTT_ADD_MOVE)
      async handleOnAddMove(@ConnectedSocket() client: SocketExtend, @MessageBody(new SocketJoiValidatorPipe(vAddMoveDto)) body: AddMoveDto) {
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

            const isWin = await this.ticTacToeService.isWin(body.roomId);

            if (isWin) {
                  this.socketServer().socketEmitToRoom(TTTAction.TTT_WIN, getCacheGame.info.id, {}, 'tic-tac-toe');
                  await this.ticTacToeService.updateToDatabase(body.roomId);
            }
            return this.socketServer().socketEmitToRoom(TTTAction.TTT_ADD_MOVE, getCacheGame.info.id, {}, 'tic-tac-toe');
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTAction.TTT_SURRENDER)
      async handleOnSurrender(@ConnectedSocket() client: SocketExtend, @MessageBody(new SocketJoiValidatorPipe(vRoomIdDto)) body: RoomIdDTO) {
            const getCacheGame = await this.getGameFromCache(body.roomId, client.user.id);
            if (!getCacheGame) return;

            const isOwner = this.isOwner(getCacheGame, client.user.id);
            if (!isOwner) return;

            await this.ticTacToeService.surrender(body.roomId, client.user);
            return this.socketServer().socketEmitToRoom(TTTAction.TTT_SURRENDER, getCacheGame.info.id, {}, 'tic-tac-toe');
      }
}
