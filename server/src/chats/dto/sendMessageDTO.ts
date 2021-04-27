import { Message } from '../entities/message.entity';

export class SendMessageDTO {
      message: Message;
      chatId: string;
}
