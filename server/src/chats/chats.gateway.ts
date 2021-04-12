import { UseGuards } from '@nestjs/common';
import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { UserSocketGuard } from '../auth/authSocket.guard';
import { RedisService } from '../providers/redis/redis.service';
import { ChatsService } from './chats.service';

@WebSocketGateway({ namespace: 'chat' })
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
      async handleConnection(client: Socket) {
            //
      }

      handleDisconnect() {
            //
      }
      @UseGuards(UserSocketGuard)
      @SubscribeMessage('events')
      dsa(client: Socket) {
            console.log(client.user);
      }
}
