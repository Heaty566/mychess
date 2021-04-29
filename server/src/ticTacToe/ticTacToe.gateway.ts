import { UseGuards, UsePipes } from '@nestjs/common';
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

@WebSocketGateway({ namespace: 'tic-tac-toe' })
export class TicTacToeGateway {
      constructor(private readonly ticTacToeCommonService: TicTacToeCommonService, private readonly ticTacToeService: TicTacToeService) {}

      private async isPlaying(userId: string) {
            const isPlaying = await this.ticTacToeCommonService.isPlaying(userId);
            if (isPlaying) throw ioResponse.sendError({ details: { message: { type: 'game.already-join-other' } } }, 'BadRequestException');
      }

      private async getGameFromCache(roomId: string) {
            const game = await this.ticTacToeService.getBoard(roomId);
            if (!game) throw ioResponse.sendError({ details: { roomId: { type: 'user.not-found' } } }, 'NotFoundException');
            return game;
      }

      private async isOwner(game: TicTacToeBoard, client: SocketExtend) {
            const isOwner = game.info.users.find((item) => item.id === client.user.id);
            if (!isOwner) throw ioResponse.sendError({ details: { roomId: { type: 'user.auth-failed' } } }, 'UnauthorizedException');
      }

      @WebSocketServer()
      server: Server;

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTAction.TTT_CREATE)
      async handleCreateMatch(@ConnectedSocket() client: SocketExtend) {
            await this.isPlaying(client.user.id);

            const newGameId = await this.ticTacToeCommonService.createNewGame(client.user);
            await client.join(`tic-tac-toe-${newGameId}`);

            await this.ticTacToeService.loadGameToCache(newGameId);
            await this.ticTacToeService.joinGame(newGameId, client.user);

            return ioResponse.send<RoomIdDTO>(TTTAction.TTT_CREATE, { data: { roomId: newGameId } });
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTAction.TTT_JOIN)
      async handleJoinMatch(@ConnectedSocket() client: SocketExtend, @MessageBody(new SocketJoiValidatorPipe(vRoomIdDto)) body: RoomIdDTO) {
            await this.isPlaying(client.user.id);
            const getCacheGame = await this.getGameFromCache(body.roomId);

            if (getCacheGame.info.users.length >= 2)
                  throw ioResponse.sendError({ details: { message: { type: 'game.full-player' } } }, 'BadRequestException');

            if (getCacheGame.info.status !== TicTacToeStatus['NOT-YET'])
                  throw ioResponse.sendError({ details: { message: { type: 'game.already-playing' } } }, 'BadRequestException');

            const getRoom = await this.ticTacToeCommonService.getOneMatchByFiled('tic.id = :roomId', { roomId: body.roomId });
            if (!getRoom) throw ioResponse.sendError({ details: { roomId: { type: 'user.not-found' } } }, 'NotFoundException');

            getRoom.users.push(client.user);
            const updateTTT = await this.ticTacToeCommonService.saveTicTacToe(getRoom);

            const isJoin = await this.ticTacToeService.joinGame(updateTTT.id, client.user);
            if (!isJoin) throw ioResponse.sendError({ details: { message: { type: 'game.already-join' } } }, 'NotFoundException');

            return ioResponse.send<RoomIdDTO>(TTTAction.TTT_JOIN, { data: { roomId: updateTTT.id } });
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTAction.TTT_GET)
      async handleGetGame(@ConnectedSocket() client: SocketExtend, @MessageBody(new SocketJoiValidatorPipe(vRoomIdDto)) body: RoomIdDTO) {
            const getCacheGame = await this.getGameFromCache(body.roomId);
            await this.isOwner(getCacheGame, client);

            return ioResponse.send(TTTAction.TTT_GET, { data: getCacheGame });
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTAction.TTT_READY)
      async handleReadyGame(@ConnectedSocket() client: SocketExtend, @MessageBody(new SocketJoiValidatorPipe(vRoomIdDto)) body: RoomIdDTO) {
            const getCacheGame = await this.getGameFromCache(body.roomId);
            await this.isOwner(getCacheGame, client);

            const isReady = await this.ticTacToeService.toggleReadyStatePlayer(body.roomId, client.user);
            if (!isReady) throw ioResponse.sendError({ details: { message: { type: 'game.wait-more-player' } } }, 'BadRequestException');

            return ioResponse.send(TTTAction.TTT_READY, {});
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTAction.TTT_START)
      async handleStartGame(@ConnectedSocket() client: SocketExtend, @MessageBody(new SocketJoiValidatorPipe(vRoomIdDto)) body: RoomIdDTO) {
            const getCacheGame = await this.getGameFromCache(body.roomId);
            await this.isOwner(getCacheGame, client);

            await this.ticTacToeService.startGame(body.roomId, client.user);
            return ioResponse.send(TTTAction.TTT_START, {});
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
            await this.isOwner(getCacheGame, client);

            await this.ticTacToeService.startGame(body.roomId, client.user);
            return ioResponse.send(TTTAction.TTT_LEAVE, {});
      }

      //       @UseGuards(UserSocketGuard)
      //       @SubscribeMessage(TTTAction.TTT_SURRENDER)
      //       async handleOnSurrender(@ConnectedSocket() client: SocketExtend, @MessageBody(new SocketJoiValidatorPipe(vRoomIdDto)) body: RoomIdDTO) {
      //             const getCacheGame = await this.ticTacToeService.getBoard(body.roomId);
      //             if (!getCacheGame) throw ioResponse.sendError({ details: { roomId: { type: 'user.not-found' } } }, 'NotFoundException');

      //             const isOwner = getCacheGame.info.users.find((item) => item.id === client.user.id);
      //             if (!isOwner) throw ioResponse.sendError({ details: { roomId: { type: 'user.auth-failed' } } }, 'UnauthorizedException');

      //             await this.ticTacToeService.startGame(body.roomId, client.user);
      //             return ioResponse.send(TTTAction.TTT_START, {});
      //       }
}
