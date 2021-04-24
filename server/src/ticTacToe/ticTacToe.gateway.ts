import { UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { SocketResponse } from '../app/interface/socketResponse';
import { Server, SocketExtend } from 'socket.io';
import { UserSocketGuard } from '../auth/authSocket.guard';
import { TicTacToeService } from './ticTacToe.service';
import { TicTacToeStatus } from './entity/ticTacToeStatus';
import { TicTacToe } from './entity/ticTacToe.entity';
import { JoinRoomDto, vJoinRoomDto } from './dto/joinRoomDto';
import { SocketJoiValidatorPipe } from '../utils/validator/SocketValidator.pipe';
import { TTTAction } from './ticTacToe.action';
import { SocketResponseAction } from '../app/interface/socket.action';
@WebSocketGateway({ namespace: 'tic-tac-toe' })
export class TicTacToeGateway {
      constructor(private readonly ticTacToeService: TicTacToeService) {}

      // ------------ Event

      @WebSocketServer()
      server: Server;

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTAction.TTT_CREATE_ROOM)
      async handleCreateMatch(@ConnectedSocket() client: SocketExtend): Promise<WsResponse<SocketResponse<null>>> {
            const isPlaying = await this.ticTacToeService.isPlaying(client.user.id);
            if (isPlaying)
                  return {
                        event: SocketResponseAction.BAD_REQUEST,
                        data: {
                              isSuccess: false,
                              data: null,
                              details: { message: { type: 'user.not-allow-action' } },
                        },
                  };

            const tic = new TicTacToe();
            tic.users = [client.user];
            const insertNewTTT = await this.ticTacToeService.saveTicTacToe(tic);
            await client.join(`tic-tac-toe-${insertNewTTT.id}`);

            return { event: TTTAction.TTT_CREATE_ROOM, data: { isSuccess: true } };
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTAction.TTT_JOIN_ROOM)
      async handleJoinMatch(
            @ConnectedSocket() client: SocketExtend,
            @MessageBody(new SocketJoiValidatorPipe(vJoinRoomDto)) body: JoinRoomDto,
      ): Promise<WsResponse<SocketResponse<null>>> {
            const isPlaying = await this.ticTacToeService.isPlaying(client.user.id);
            if (isPlaying)
                  return {
                        event: SocketResponseAction.BAD_REQUEST,
                        data: {
                              isSuccess: false,
                              data: null,
                              details: { message: { type: 'user.not-allow-action' } },
                        },
                  };

            const getRoom = await this.ticTacToeService.isFull(body.roomId);
            console.log(getRoom);
      }
}
