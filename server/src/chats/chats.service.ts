import { Injectable } from '@nestjs/common';
import { BelongChat } from './entities/belongChat.entity';
import { BelongChatRepository } from './entities/belongChat.repository';
import { MessageRepository } from './entities/message.repository';

@Injectable()
export class ChatsService {
      constructor(private readonly belongChatRepository: BelongChatRepository, private readonly messageRepository: MessageRepository) {}
      async checkBelongChat(userId: string, chatId: string): Promise<BelongChat> {
            return await this.belongChatRepository
                  .createQueryBuilder()
                  .select('*')
                  .where('userId = :userId', { userId: userId })
                  .andWhere('chatId = :chatId', { chatId: chatId })
                  .execute();
      }

      async loadMessage(chatId: string) {
            return await this.messageRepository.createQueryBuilder().select('*').where('chatId = :chatId', { chatId: chatId }).execute();
      }
}
