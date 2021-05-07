import { UseGuards } from '@nestjs/common';
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, WsResponse } from '@nestjs/websockets';
import { SocketExtend, Server } from 'socket.io';
import { ioResponse } from '../app/interface/socketResponse';

//---- Pipe
import { UserSocketGuard } from '../auth/authSocket.guard';
import { SocketJoiValidatorPipe } from '../utils/validator/socketValidator.pipe';

//---- Service
import { RedisService } from '../providers/redis/redis.service';
import { ChatsService } from './chats.service';

//---- DTO
import { RoomIdChatDTO, vRoomIdChatDTO } from './dto/roomIdChatDto';
import { SendMessageDTO } from './dto/sendMessageDto';

//---- Entity
import { Message } from './entities/message.entity';

//---- Enum
import { ChatGatewayAction } from './chats.action';
import { Chat } from './entities/chat.entity';

@WebSocketGateway({ namespace: 'chats' })
export class ChatsGateway {
      constructor(private readonly chatsService: ChatsService, private readonly redisService: RedisService) {}
      @WebSocketServer()
      server: Server;

      socketServer = () => ioResponse.getSocketServer(this.server);

      async sendToRoom(chatId: string) {
            const chat = await this.chatsService.getChat(chatId);
            return this.socketServer().socketEmitToRoom(ChatGatewayAction.CHAT_GET, chatId, { data: chat }, 'chat');
      }

      private isBelongToChat(chat: Chat, userId: string) {
            const user = chat.users.find((item) => item.id === userId);
            if (!user) throw ioResponse.sendError({ details: { messageError: { type: 'error.not-allow-action' } } }, 'ForbiddenException');
            return user;
      }

      private async getChatFromCache(chatId: string) {
            const game = await this.chatsService.getChat(chatId);
            if (!game) throw ioResponse.sendError({ details: { chatId: { type: 'field.not-found' } } }, 'NotFoundException');

            return game;
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(ChatGatewayAction.CHAT_JOIN)
      async handleJoinChat(@ConnectedSocket() client: SocketExtend, @MessageBody(new SocketJoiValidatorPipe(vRoomIdChatDTO)) data: RoomIdChatDTO) {
            const chat = await this.getChatFromCache(data.chatId);
            await this.isBelongToChat(chat, client.user.id);

            await client.join('chat-' + chat.id);

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
