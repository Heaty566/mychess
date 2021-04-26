import { UseGuards } from '@nestjs/common';
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, WsResponse } from '@nestjs/websockets';
import { SocketExtend, Server } from 'socket.io';
import { UserSocketGuard } from '../auth/authSocket.guard';
import { ChatsService } from './chats.service';
import { JoinOrLeaveChatDTO } from './dto/joinChatDTO.dto';
import { Message } from './entities/message.entity';

@WebSocketGateway({ namespace: 'chats' })
export class ChatsGateway {
      constructor(private readonly chatsService: ChatsService) {}
      @WebSocketServer()
      server: Server;

      /**
       * This function listens on "connection-chat" event from client.
       * After that, checking the user is belong to a chat or not.
       * If yes, then load all the history and send them to client
       * @param data chatId
       */
      @UseGuards(UserSocketGuard)
      @SubscribeMessage('connection-chat')
      async handleInitChat(@ConnectedSocket() client: SocketExtend, @MessageBody() data: JoinOrLeaveChatDTO): Promise<WsResponse<null>> {
            if (client.user) {
                  const isBelongTo = await this.chatsService.checkUserBelongToChat(client.user.id, data.chatId);
                  if (isBelongTo) {
                        client.join(data.chatId);
                        const messages = await this.chatsService.loadMessage(data.chatId);
                        this.server.to(data.chatId).emit('load-message-history', messages);
                  }
            }
            return { event: 'connection-chat-success', data: null };
      }

      /**
       * This function listens on "send-message" from client.
       * And save this message into database, then send it back to client to display
       * @param data A message from client
       * @returns
       */
      @UseGuards(UserSocketGuard)
      @SubscribeMessage('send-message')
      async sendMessage(@MessageBody() data: Message): Promise<WsResponse<Message>> {
            const message = await this.chatsService.saveMessage(data);
            return { event: 'send-message-success', data: message };
      }
}
