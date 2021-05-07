import { INestApplication } from '@nestjs/common';

//---- Helper
import { initTestModule } from '../../test/initTest';

//---- Service
import { ChatService } from '../chat.service';
import { RedisService } from '../../utils/redis/redis.service';

//---- Entity
import { User } from '../../user/entities/user.entity';
import { Chat } from '../entities/chat.entity';

//---- Repository
import { ChatRepository } from '../entities/chat.repository';

describe('ChatService', () => {
      let app: INestApplication;

      let resetDB: any;
      let generateFakeUser: () => Promise<User>;
      let chatService: ChatService;
      let redisService: RedisService;
      let chatRepository: ChatRepository;
      beforeAll(async () => {
            const { getApp, module, resetDatabase, getFakeUser } = await initTestModule();
            app = getApp;

            resetDB = resetDatabase;
            generateFakeUser = getFakeUser;
            redisService = module.get<RedisService>(RedisService);
            chatService = module.get<ChatService>(ChatService);
            chatRepository = module.get<ChatRepository>(ChatRepository);
      });

      describe('createChat', () => {
            let user: User;

            beforeEach(async () => {
                  user = await generateFakeUser();
            });

            it('Pass', async () => {
                  const chat = await chatService.createChat(user);
                  const getChat = await chatService.getChat(chat.id);

                  const findUser = await getChat.users.find((item) => item.id === user.id);
                  expect(findUser).toBeDefined();
                  expect(getChat.id).toBeDefined();
                  expect(getChat).toBeDefined();
            });
      });

      describe('getChat', () => {
            let chat: Chat;
            let user: User;

            beforeEach(async () => {
                  user = await generateFakeUser();
                  chat = await chatService.createChat(user);
            });

            it('Pass', async () => {
                  const getChat = await chatService.getChat(chat.id);
                  const findUser = await getChat.users.find((item) => item.id === user.id);
                  expect(findUser).toBeDefined();
                  expect(getChat.id).toBeDefined();
                  expect(getChat).toBeDefined();
            });
            it('Pass load from database', async () => {
                  await chatService.addMessage(chat.id, user, 'hello');
                  await chatService.saveChat(chat.id);
                  await redisService.deleteByKey(`chat-${chat.id}`);

                  const getChat = await chatService.getChat(chat.id);

                  const findUser = await getChat.users.find((item) => item.id === user.id);
                  const findMessage = await getChat.messages.find((item) => item.content === 'hello');
                  expect(findMessage).toBeDefined();
                  expect(findUser).toBeDefined();
                  expect(getChat.id).toBeDefined();
                  expect(getChat).toBeDefined();
            });
            it('Failed chat does not exits', async () => {
                  const getChat = await chatService.getChat('hello world');

                  expect(getChat).toBeNull();
            });
      });

      describe('saveChat', () => {
            let chat: Chat;
            let user: User;

            beforeEach(async () => {
                  user = await generateFakeUser();
                  chat = await chatService.createChat(user);
                  await chatService.addMessage(chat.id, user, 'hello');
            });

            it('Pass', async () => {
                  const saveChat = await chatService.saveChat(chat.id);
                  const getChat = await chatRepository
                        .createQueryBuilder('chat')
                        .leftJoinAndSelect('chat.messages', 'message')
                        .where('chat.id = :id', { id: chat.id })
                        .getOne();

                  expect(getChat.id).toBeDefined();
                  expect(saveChat).toBeDefined();
                  expect(getChat.messages[0].content).toBe('hello');
                  expect(getChat.messages[0].id).toBeDefined();
            });
            it('Failed wrong chat id', async () => {
                  const chat = await chatService.saveChat('hello');

                  expect(chat).toBeUndefined();
            });
      });

      describe('addMessage', () => {
            let chat: Chat;
            let user: User;

            beforeEach(async () => {
                  user = await generateFakeUser();
                  chat = await chatService.createChat(user);
            });

            it('Pass', async () => {
                  await chatService.addMessage(chat.id, user, 'hello');
                  await chatService.addMessage('hello', user, 'hello');
                  const getChat = await chatService.getChat(chat.id);

                  expect(getChat.id).toBeDefined();
                  expect(getChat.messages[0].content).toBe('hello');
                  expect(getChat.messages[1]).toBeUndefined();
            });
      });
      describe('joinChat', () => {
            let chat: Chat;
            let user: User;

            beforeEach(async () => {
                  user = await generateFakeUser();
                  chat = await chatService.createChat(user);
            });

            it('Pass', async () => {
                  const newUser = await generateFakeUser();
                  await chatService.joinChat('id', newUser);
                  await chatService.joinChat(chat.id, newUser);
                  const getChat = await chatService.getChat(chat.id);

                  expect(getChat.users.length).toBe(2);
            });
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
