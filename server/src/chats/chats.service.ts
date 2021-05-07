import { Injectable } from '@nestjs/common';

//---- Repository
import { ChatRepository } from './entities/chat.repository';

//---- Entity
import { Message } from './entities/message.entity';
import { RedisService } from '../providers/redis/redis.service';
import { Chat } from './entities/chat.entity';
import User from '../users/entities/user.entity';
import { generatorString } from '../app/helpers/stringGenerator';

@Injectable()
export class ChatsService {
      constructor(private readonly chatRepository: ChatRepository, private readonly redisService: RedisService) {}

      async loadFromDatabase(chatId: string) {
            const chat = await this.chatRepository
                  .createQueryBuilder('chat')
                  .leftJoinAndSelect('chat.messages', 'message')
                  .where('chat.id = :chatId', { chatId })
                  .getOne();
            if (chat) await this.setChat(chat);

            return chat;
      }

      async getChat(chatId: string) {
            const newChatId = `chat-${chatId}`;
            const chat = await this.redisService.getObjectByKey<Chat>(newChatId);
            if (!chat) {
                  const dbChat = await this.loadFromDatabase(chatId);
                  return dbChat;
            }
            return chat;
      }

      async createChat(user: User) {
            const chat = new Chat();
            chat.users = [];
            chat.id = generatorString(10);
            chat.users.push(user);
            chat.messages = [];
            await this.setChat(chat);

            return chat;
      }

      async setChat(chat: Chat) {
            const newChatId = `chat-${chat.id}`;

            return await this.redisService.setObjectByKey(newChatId, chat, 1440);
      }

      async joinGame(chatId: string, user: User) {
            const chat = await this.getChat(chatId);
            if (chat) {
                  chat.users.push(user);
                  await this.setChat(chat);
            }
      }

      async loadToDatabase(chatId: string) {
            const chat = await this.getChat(chatId);
            if (chat) {
                  await this.setChat(chat);

                  return await this.chatRepository.save(chat);
            }
      }

      async addMessage(chatId: string, user: User, content: string) {
            const chat = await this.getChat(chatId);
            if (chat) {
                  const newMessage = new Message(user.id, content);
                  chat.messages.push(newMessage);
                  await this.setChat(chat);
            }
      }
}
