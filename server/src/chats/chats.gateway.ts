import { UseGuards } from '@nestjs/common';
import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
import { SocketExtend } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { UserSocketGuard } from '../auth/authSocket.guard';
import { RedisService } from '../providers/redis/redis.service';
import { ChatsService } from './chats.service';

@WebSocketGateway({ namespace: 'chat' })
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
      async handleConnection(client: SocketExtend) {
            //
      }

      handleDisconnect() {
            //
      }
      @UseGuards(UserSocketGuard)
      @SubscribeMessage('events')
      dsa(client: SocketExtend) {
            console.log(client);
      }
}
