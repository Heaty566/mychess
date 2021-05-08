import { UseGuards } from '@nestjs/common';
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { SocketExtend, Server } from 'socket.io';

//---- Pipe
import { UserSocketGuard } from '../auth/authSocket.guard';
import { SocketJoiValidatorPipe } from '../utils/validator/socketValidator.pipe';

//---- Service
import { ChatService } from './chat.service';

//---- DTO
import { RoomIdChatDTO, vRoomIdChatDTO } from './dto/roomIdChatDto';

//---- Entity
import { Chat } from './entities/chat.entity';

//---- Common
import { ioResponse } from '../app/interface/socketResponse';
import { ChatGatewayAction } from './chatGateway.action';

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway {
      constructor(private readonly chatService: ChatService) {}
      @WebSocketServer()
      server: Server;

      socketServer = () => ioResponse.getSocketServer(this.server);

      async sendToRoom(chatId: string) {
            const chat = await this.chatService.getChat(chatId);
            return this.socketServer().socketEmitToRoom(ChatGatewayAction.CHAT_GET, chatId, { data: chat }, 'chat');
      }

      private isBelongToChat(chat: Chat, userId: string) {
            const user = chat.users.find((item) => item.id === userId);
            if (!user) throw ioResponse.sendError({ details: { errorMessage: { type: 'error.not-allow-action' } } }, 'ForbiddenException');
            return user;
      }

      private async getChatFromCache(chatId: string) {
            const chat = await this.chatService.getChat(chatId);
            if (!chat) throw ioResponse.sendError({ details: { chatId: { type: 'field.not-found' } } }, 'NotFoundException');

            return chat;
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(ChatGatewayAction.CHAT_JOIN)
      async handleJoinChat(@ConnectedSocket() client: SocketExtend, @MessageBody(new SocketJoiValidatorPipe(vRoomIdChatDTO)) data: RoomIdChatDTO) {
            const chat = await this.getChatFromCache(data.chatId);
            await this.isBelongToChat(chat, client.user.id);

            await client.join(`chat-${chat.id}`);
            return this.socketServer().socketEmitToRoom(ChatGatewayAction.CHAT_JOIN, chat.id, {}, 'chat');
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(ChatGatewayAction.CHAT_GET)
      async handleGetChat(@ConnectedSocket() client: SocketExtend, @MessageBody(new SocketJoiValidatorPipe(vRoomIdChatDTO)) data: RoomIdChatDTO) {
            const chat = await this.getChatFromCache(data.chatId);
            await this.isBelongToChat(chat, client.user.id);

            return this.socketServer().socketEmitToRoom(ChatGatewayAction.CHAT_GET, chat.id, { data: chat }, 'chat');
      }
}
