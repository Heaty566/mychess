import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

//---- Service
import { RedisService } from '../utils/redis/redis.service';

//---- Repository
import { ChatRepository } from './entities/chat.repository';
import { MessageRepository } from './entities/message.repository';

//---- Entity
import { Message } from './entities/message.entity';
import User from '../user/entities/user.entity';
import { Chat } from './entities/chat.entity';
@Injectable()
export class ChatService {
      constructor(
            private readonly chatRepository: ChatRepository,
            private readonly redisService: RedisService,
            private readonly messageRepository: MessageRepository,
      ) {}

      async getChat(chatId: string) {
            const newChatId = `chat-${chatId}`;
            const chat = await this.redisService.getObjectByKey<Chat>(newChatId);

            if (!chat) {
                  const dbChat = await this.chatRepository.getOneChatById(chatId);
                  if (!dbChat) return null;
                  await this.setChat(dbChat);

                  return dbChat;
            }
            return chat;
      }

      async createChat(user: User) {
            const chat = new Chat();
            chat.users = [];
            chat.id = uuidv4();
            chat.messages = [];
            await this.setChat(chat);
            await this.joinChat(chat.id, user);

            return chat;
      }

      async setChat(chat: Chat) {
            const newChatId = `chat-${chat.id}`;

            return await this.redisService.setObjectByKey(newChatId, chat, 120);
      }

      async joinChat(chatId: string, user: User) {
            const chat = await this.getChat(chatId);
            if (chat) {
                  chat.users.push({
                        ...user,
                        password: null,
                        phoneNumber: null,
                        email: null,
                        facebookId: null,
                        googleId: null,
                        githubId: null,
                  });
                  await this.setChat(chat);
            }
      }

      async saveMessage(chat: Chat) {
            const messages = await this.messageRepository.save(chat.messages);
            return messages;
      }

      async saveChat(chatId: string) {
            const chat = await this.getChat(chatId);
            if (chat) {
                  const messages = await this.saveMessage(chat);
                  chat.messages = messages;
                  const saveChat = await this.chatRepository.save(chat);
                  await this.setChat(saveChat);
                  return saveChat;
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
