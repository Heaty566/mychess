import { UseGuards } from '@nestjs/common';
import { ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, SocketExtend } from 'socket.io';
import { UserSocketGuard } from '../auth/authSocket.guard';
import { UserAction } from './user.action';

import { ioResponse } from '../app/interface/socketResponse';

@WebSocketGateway()
export class UserGateway {
      @WebSocketServer()
      server: Server;

      socketServer = () => ioResponse.getSocketServer(this.server);

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(UserAction.USER_CONNECT)
      async handleCreateMatch(@ConnectedSocket() client: SocketExtend) {
            await client.join(`user-${client.user.id}`);

            return this.socketServer().socketEmitToRoom(UserAction.USER_CONNECT, client.user.id, {}, 'user');
      }
}
