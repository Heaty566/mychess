import { Body, Controller, Post, Req, UseGuards, UsePipes } from '@nestjs/common';
import { Request } from 'express';
import { apiResponse } from '../app/interface/apiResponse';
import { UserGuard } from '../auth/auth.guard';
import { ChatsService } from './chats.service';
import { Chat } from './entities/chat.entity';
import { RoomIdChatDTO, vRoomIdChatDTO } from './dto/roomIdChatDto';
import { JoiValidatorPipe } from 'src/utils/validator/validator.pipe';
import { SendMessageDTO, vSendMessageDTO } from './dto/sendMessageDTO';
@Controller('chats')
export class ChessController {
      constructor(private readonly chatService: ChatsService) {}

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

      @Post('/join')
      @UseGuards(UserGuard)
      @UsePipes(new JoiValidatorPipe(vRoomIdChatDTO))
      async handleOnJoinChat(@Req() req: Request, @Body() body: RoomIdChatDTO) {
            const chat = await this.getChatFromCache(body.chatId);
            const isJoinBefore = this.isBelongToRoom(chat, req.user.id);
            if (!isJoinBefore) await this.chatService.joinGame(chat.id, req.user);

            return apiResponse.send<RoomIdChatDTO>({ data: { chatId: chat.id } });
      }

      @Post('/send-message')
      @UseGuards(UserGuard)
      @UsePipes(new JoiValidatorPipe(vSendMessageDTO))
      async handleOnSendMessage(@Req() req: Request, @Body() body: SendMessageDTO) {
            const chat = await this.getChatFromCache(body.chatId);

            const isBelongToChat = this.isBelongToRoom(chat, req.user.id);
            if (!isBelongToChat) throw apiResponse.sendError({ details: { messageError: { type: 'error.not-allow-action' } } }, 'ForbiddenException');
            await this.chatService.addMessage(chat.id, req.user, body.content);

            return apiResponse.send<RoomIdChatDTO>({});
      }
      @Post('/leave')
      @UseGuards(UserGuard)
      @UsePipes(new JoiValidatorPipe(vRoomIdChatDTO))
      async handleOnLeave(@Req() req: Request, @Body() body: RoomIdChatDTO) {
            const chat = await this.getChatFromCache(body.chatId);

            const isBelongToChat = this.isBelongToRoom(chat, req.user.id);
            if (!isBelongToChat) throw apiResponse.sendError({ details: { messageError: { type: 'error.not-allow-action' } } }, 'ForbiddenException');
            await this.chatService.loadToDatabase(chat.id);

            return apiResponse.send<RoomIdChatDTO>({});
      }
}
