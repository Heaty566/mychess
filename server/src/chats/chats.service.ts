import { Injectable } from '@nestjs/common';
import { BelongChat } from './entities/belongChat.entity';
import { BelongChatRepository } from './entities/belongChat.repository';

@Injectable()
export class ChatsService {
      constructor(private readonly belongChatRepository: BelongChatRepository) {}
      async checkBelongChat(userId: string, chatId: string): Promise<BelongChat> {
            return await this.belongChatRepository
                  .createQueryBuilder()
                  .select('*')
                  .where('userId = :userId', { userId: userId })
                  .andWhere('chatId = :chatId', { chatId: chatId })
                  .execute();
      }
}
