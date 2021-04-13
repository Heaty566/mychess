import { UseGuards } from '@nestjs/common';
import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { UserSocketGuard } from '../auth/authSocket.guard';
import { RedisService } from '../providers/redis/redis.service';
import { ChatsService } from './chats.service';

@WebSocketGateway()
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
      @WebSocketServer() server: Server;

      async handleConnection(client: Socket) {
            //
      }

      handleDisconnect() {
            //
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage('events')
      onEvents(client: Socket) {
            //console.log(client.user);
            this.server.emit('events', 'hello client, i am server');
      }
}
