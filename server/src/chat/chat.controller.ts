import { Body, Controller, Post, Put, Req, UseGuards, UsePipes } from '@nestjs/common';
import { Request } from 'express';

//---- Service
import { ChatService } from './chat.service';
import { UserGuard } from '../auth/auth.guard';
import { JoiValidatorPipe } from '../utils/validator/validator.pipe';

//---- Entity
import { Chat } from './entities/chat.entity';

//---- Gateway
import { ChatGateway } from './chat.gateway';

//---- Dto
import { RoomIdChatDTO, vRoomIdChatDTO } from './dto/roomIdChatDto';
import { SendMessageDTO, vSendMessageDTO } from './dto/sendMessageDto';

//---- Common
import { apiResponse } from '../app/interface/apiResponse';

@Controller('chat')
export class ChatController {
      constructor(private readonly chatService: ChatService, private readonly chatGateway: ChatGateway) {}

      private isBelongToRoom(chat: Chat, userId: string) {
            return chat.users.find((item) => item.id === userId);
      }

      private async getChatFromCache(chatId: string) {
            const chat = await this.chatService.getChat(chatId);
            if (!chat) throw apiResponse.sendError({ details: { chatId: { type: 'field.not-found' } } }, 'NotFoundException');
            return chat;
      }
      @Post('/new')
      @UseGuards(UserGuard)
      async handleOnCreateChat(@Req() req: Request) {
            const chat = await this.chatService.createChat(req.user);

            return apiResponse.send<RoomIdChatDTO>({ data: { chatId: chat.id } });
      }

      @Put('/join')
      @UseGuards(UserGuard)
      @UsePipes(new JoiValidatorPipe(vRoomIdChatDTO))
      async handleOnJoinChat(@Req() req: Request, @Body() body: RoomIdChatDTO) {
            const chat = await this.getChatFromCache(body.chatId);
            const isJoinBefore = this.isBelongToRoom(chat, req.user.id);
            if (!isJoinBefore) await this.chatService.joinChat(chat.id, req.user);

            return apiResponse.send<RoomIdChatDTO>({ data: { chatId: chat.id } });
      }

      @Put('/send-message')
      @UseGuards(UserGuard)
      @UsePipes(new JoiValidatorPipe(vSendMessageDTO))
      async handleOnSendMessage(@Req() req: Request, @Body() body: SendMessageDTO) {
            const chat = await this.getChatFromCache(body.chatId);

            const isBelongToChat = this.isBelongToRoom(chat, req.user.id);
            if (!isBelongToChat) throw apiResponse.sendError({ details: { errorMessage: { type: 'error.not-allow-action' } } }, 'ForbiddenException');
            await this.chatService.addMessage(chat.id, req.user, body.content);
            await this.chatGateway.sendToRoom(chat.id);
            return apiResponse.send<RoomIdChatDTO>({});
      }
      @Put('/save')
      @UseGuards(UserGuard)
      @UsePipes(new JoiValidatorPipe(vRoomIdChatDTO))
      async handleOnLeave(@Req() req: Request, @Body() body: RoomIdChatDTO) {
            const chat = await this.getChatFromCache(body.chatId);

            const isBelongToChat = this.isBelongToRoom(chat, req.user.id);
            if (!isBelongToChat) throw apiResponse.sendError({ details: { errorMessage: { type: 'error.not-allow-action' } } }, 'ForbiddenException');
            await this.chatService.saveChat(chat.id);

            return apiResponse.send<RoomIdChatDTO>({});
      }
}
