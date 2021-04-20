import { UseGuards } from '@nestjs/common';
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, WsResponse } from '@nestjs/websockets';
import { SocketExtend, Server } from 'socket.io';
import { UserSocketGuard } from 'src/auth/authSocket.guard';
import { ChatsService } from './chats.service';

@WebSocketGateway({ namespace: 'chats' })
export class ChatsGateway {
      constructor(private readonly chatsService: ChatsService) {}
      @WebSocketServer()
      server: Server;

      @UseGuards(UserSocketGuard)
      @SubscribeMessage('connection-chat')
      handleInitChat(@ConnectedSocket() client: SocketExtend, @MessageBody() data): WsResponse<null> {
            return { event: 'connection-chat-success', data: null };
      }
}
