import { Injectable } from '@nestjs/common';

//---- Repository
import { ChatRepository } from './entities/chat.repository';
import { MessageRepository } from './entities/message.repository';

//---- Entity
import { Message } from './entities/message.entity';

@Injectable()
export class ChatsService {
      constructor(private readonly chatRepository: ChatRepository, private readonly messageRepository: MessageRepository) {}
      async checkUserBelongToChat(userId: string, chatId: string) {
            const listChat = await this.chatRepository
                  .createQueryBuilder('chat')
                  .innerJoinAndSelect('chat.users', 'user')
                  .where('chatId = :chatId', { chatId: chatId })
                  .getMany();

            if (listChat.length === 0) return false;

            return listChat[0].users[0].id === userId;
      }

      async loadMessage(chatId: string) {
            return await this.messageRepository.createQueryBuilder().select('*').where('chatId = :chatId', { chatId: chatId }).execute();
      }

      async saveMessage(message: Message) {
            return await this.messageRepository.save(message);
      }
}
