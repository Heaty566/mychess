import { UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, SocketExtend } from 'socket.io';
import { UserSocketGuard } from '../auth/authSocket.guard';
import { TicTacToeService } from './ticTacToe.service';
import { ioResponse } from '../app/interface/socketResponse';
import { TicTacToe } from './entity/ticTacToe.entity';
import { JoinRoomDto, vJoinRoomDto } from './dto/joinRoomDto';
import { SocketJoiValidatorPipe } from '../utils/validator/SocketValidator.pipe';
import { TTTAction } from './ticTacToe.action';
import { TicTacToeCommonService } from './ticTacToeCommon.service';
import { TicTacToeStatus } from './entity/ticTacToeStatus';

@WebSocketGateway({ namespace: 'tic-tac-toe' })
export class TicTacToeGateway {
      constructor(private readonly ticTacToeCommonService: TicTacToeCommonService, private readonly ticTacToeService: TicTacToeService) {}

      @WebSocketServer()
      server: Server;

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTAction.TTT_CREATE_ROOM)
      async handleCreateMatch(@ConnectedSocket() client: SocketExtend) {
            const isPlaying = await this.ticTacToeCommonService.isPlaying(client.user.id);
            if (isPlaying) throw ioResponse.sendError({ details: { message: { type: 'user.not-allow-action' } } }, 'BadRequestException');

            const tic = new TicTacToe();
            tic.users = [client.user];
            const insertNewTTT = await this.ticTacToeCommonService.saveTicTacToe(tic);
            await client.join(`tic-tac-toe-${insertNewTTT.id}`);

            await this.ticTacToeService.loadGameToCache(insertNewTTT.id);
            return ioResponse.send(TTTAction.TTT_CREATE_ROOM, {});
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTAction.TTT_JOIN_ROOM)
      async handleJoinMatch(@ConnectedSocket() client: SocketExtend, @MessageBody(new SocketJoiValidatorPipe(vJoinRoomDto)) body: JoinRoomDto) {
            const isPlaying = await this.ticTacToeCommonService.isPlaying(client.user.id);
            if (isPlaying) throw ioResponse.sendError({ details: { message: { type: 'user.not-allow-action' } } }, 'BadRequestException');

            const getCacheRoom = await this.ticTacToeService.getBoard(body.roomId);
            if (!getCacheRoom) throw ioResponse.sendError({ details: { message: { type: 'user.not-allow-action' } } }, 'NotFoundException');
            if (getCacheRoom.info.users.length >= 2)
                  throw ioResponse.sendError({ details: { message: { type: 'user.not-allow-action' } } }, 'BadRequestException');
            if (getCacheRoom.info.status === TicTacToeStatus.END || getCacheRoom.info.status === TicTacToeStatus.PLAYING)
                  throw ioResponse.sendError({ details: { message: { type: 'user.not-allow-action' } } }, 'BadRequestException');

            const getRoom = await this.ticTacToeCommonService.getOneMatchByFiled('tic.id = :roomId', { roomId: body.roomId });
            if (!getRoom) throw ioResponse.sendError({ details: { message: { type: 'user.not-allow-action' } } }, 'NotFoundException');

            getRoom.users.push(client.user);
            const updateTTT = await this.ticTacToeCommonService.saveTicTacToe(getRoom);

            await client.join(`tic-tac-toe-${getRoom.id}`);
            await this.ticTacToeService.loadGameToCache(updateTTT.id);

            return ioResponse.send(TTTAction.TTT_JOIN_ROOM, {});
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTAction.TTT_READY_ROOM)
      async handleReadyMatch(@ConnectedSocket() client: SocketExtend, @MessageBody(new SocketJoiValidatorPipe(vJoinRoomDto)) body: JoinRoomDto) {
            //
      }
}
