import { UseGuards } from '@nestjs/common';
import {
      WebSocketGateway,
      OnGatewayConnection,
      OnGatewayDisconnect,
      SubscribeMessage,
      WebSocketServer,
      MessageBody,
      ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { UserSocketGuard } from '../auth/authSocket.guard';

@WebSocketGateway({ namespace: 'chat' })
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
      @WebSocketServer() server: Server;

      async handleConnection(client: Socket) {
            // console.log(`Client connect: ${client.id}`);
      }

      handleDisconnect() {
            //
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage('events')
      onEvents(@MessageBody() data, @ConnectedSocket() client: Socket) {
            //console.log(client['user']);

            //client.join('room1');
            client.emit('events', 'hello client, i am server');
      }
}
