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
@WebSocketGateway({ namespace: 'tic-tac-toe' })
export class TicTacToeGateway {
      constructor(private readonly ticTacToeService: TicTacToeService) {}

      @WebSocketServer()
      server: Server;

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTAction.TTT_CREATE_ROOM)
      async handleCreateMatch(@ConnectedSocket() client: SocketExtend) {
            const isPlaying = await this.ticTacToeService.isPlaying(client.user.id);
            if (isPlaying) throw ioResponse.sendError({ details: { message: { type: 'user.not-allow-action' } } }, 'BadRequestException');

            const tic = new TicTacToe();
            tic.users = [client.user];
            const insertNewTTT = await this.ticTacToeService.saveTicTacToe(tic);
            await client.join(`tic-tac-toe-${insertNewTTT.id}`);

            return ioResponse.send(TTTAction.TTT_CREATE_ROOM, {});
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTAction.TTT_JOIN_ROOM)
      async handleJoinMatch(@ConnectedSocket() client: SocketExtend, @MessageBody(new SocketJoiValidatorPipe(vJoinRoomDto)) body: JoinRoomDto) {
            const isPlaying = await this.ticTacToeService.isPlaying(client.user.id);
            if (isPlaying) throw ioResponse.sendError({ details: { message: { type: 'user.not-allow-action' } } }, 'BadRequestException');

            const getRoom = await this.ticTacToeService.getOneMatchByFiled('tic.id = :roomId', { roomId: body.roomId });
            if (!getRoom) throw ioResponse.sendError({ details: { message: { type: 'user.not-allow-action' } } }, 'NotFoundException');

            const isFull = await this.ticTacToeService.isFull(getRoom, 2);
            if (isFull) throw ioResponse.sendError({ details: { message: { type: 'user.not-allow-action' } } }, 'BadRequestException');

            getRoom.users.push(client.user);
            await this.ticTacToeService.saveTicTacToe(getRoom);

            await client.join(`tic-tac-toe-${getRoom.id}`);

            return ioResponse.send(TTTAction.TTT_JOIN_ROOM, {});
      }
}
