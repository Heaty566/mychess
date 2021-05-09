import * as supertest from 'supertest';
import { INestApplication } from '@nestjs/common';

//---- Entity
import { User } from '../../user/entities/user.entity';

//---- Service

import { AuthService } from '../../auth/auth.service';
import { ChatService } from '../chat.service';

//---- DTO
import { RoomIdChatDTO } from '../dto/roomIdChatDto';
import { SendMessageDTO } from '../dto/sendMessageDto';

//---- Repository
import { ChatRepository } from '../entities/chat.repository';

//---- Common
import { initTestModule } from '../../test/initTest';
import { generateCookie } from '../../test/test.helper';

describe('ChatController', () => {
      let app: INestApplication;
      let resetDB: any;

      let generateFakeUser: () => Promise<User>;
      let authService: AuthService;
      let chatService: ChatService;
      let chatRepository: ChatRepository;

      beforeAll(async () => {
            const { getApp, module, resetDatabase, getFakeUser } = await initTestModule();
            app = getApp;
            resetDB = resetDatabase;
            generateFakeUser = getFakeUser;
            chatService = module.get<ChatService>(ChatService);
            authService = module.get<AuthService>(AuthService);
            chatRepository = module.get<ChatRepository>(ChatRepository);
      });

      describe('POST /chat', () => {
            let newUser: User;
            let newCookie: string[];
            beforeEach(async () => {
                  newUser = await generateFakeUser();
                  newCookie = generateCookie(await authService.createReToken(newUser));
            });

            const reqApi = () => supertest(app.getHttpServer()).post('/api/chat/new').set({ cookie: newCookie }).send();

            it('Pass', async () => {
                  const res = await reqApi();

                  expect(res.body.data.chatId).toBeDefined();
                  expect(res.status).toBe(201);
            });
      });

      describe('POST /join', () => {
            let user1: User;
            let user1Cookie: string[];
            let user2: User;
            let user2Cookie: string[];
            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  user1Cookie = generateCookie(await authService.createReToken(user1));

                  user2 = await generateFakeUser();
                  user2Cookie = generateCookie(await authService.createReToken(user2));
            });

            const reqApi = (input: RoomIdChatDTO, cookie: string[]) =>
                  supertest(app.getHttpServer()).put('/api/chat/join').set({ cookie }).send(input);

            it('Pass join owner', async () => {
                  const chat = await chatService.createChat(user1);
                  const res = await reqApi({ chatId: chat.id }, user1Cookie);
                  const getChat = await chatService.getChat(chat.id);

                  expect(getChat.users.length).toBe(1);
                  expect(res.body.data.chatId).toBeDefined();
                  expect(res.status).toBe(200);
            });
            it('Pass join other room', async () => {
                  const chat = await chatService.createChat(user1);
                  const res = await reqApi({ chatId: chat.id }, user2Cookie);
                  const getChat = await chatService.getChat(chat.id);

                  expect(getChat.users.length).toBe(2);
                  expect(res.body.data.chatId).toBeDefined();
                  expect(res.status).toBe(200);
            });
      });
      describe('POST /send-message', () => {
            let user1: User;
            let user1Cookie: string[];
            let user2: User;
            let user2Cookie: string[];
            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  user1Cookie = generateCookie(await authService.createReToken(user1));

                  user2 = await generateFakeUser();
                  user2Cookie = generateCookie(await authService.createReToken(user2));
            });

            const reqApi = (input: SendMessageDTO, cookie: string[]) =>
                  supertest(app.getHttpServer()).put('/api/chat/send-message').set({ cookie }).send(input);

            it('Pass join user1 add message', async () => {
                  const chat = await chatService.createChat(user1);
                  const res = await reqApi({ chatId: chat.id, content: 'hello world' }, user1Cookie);
                  const getChat = await chatService.getChat(chat.id);

                  const findMessage = getChat.messages.find((item) => item.content === 'hello world');

                  expect(findMessage).toBeDefined();
                  expect(getChat.messages.length).toBe(1);
                  expect(res.status).toBe(200);
            });
            it('Pass join user1 send wrong chat id', async () => {
                  const res = await reqApi({ chatId: 'hello-world', content: 'hello world' }, user1Cookie);

                  expect(res.status).toBe(404);
            });

            it('Failed user2 is not belong to this chat', async () => {
                  const chat = await chatService.createChat(user1);
                  const res = await reqApi({ chatId: chat.id, content: 'hello world' }, user2Cookie);
                  const getChat = await chatService.getChat(chat.id);

                  const findMessage = getChat.messages.find((item) => item.content === 'hello world');

                  expect(findMessage).toBeUndefined();
                  expect(getChat.messages.length).toBe(0);
                  expect(res.status).toBe(403);
            });
      });

      describe('POST /save', () => {
            let user1: User;
            let user1Cookie: string[];
            let user2: User;
            let user2Cookie: string[];
            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  user1Cookie = generateCookie(await authService.createReToken(user1));

                  user2 = await generateFakeUser();
                  user2Cookie = generateCookie(await authService.createReToken(user2));
            });

            const reqApi = (input: RoomIdChatDTO, cookie: string[]) =>
                  supertest(app.getHttpServer()).put('/api/chat/save').set({ cookie }).send(input);

            it('Pass join user1 add message', async () => {
                  const chat = await chatService.createChat(user1);
                  await chatService.addMessage(chat.id, user1, 'hello');
                  await chatService.joinChat(chat.id, user2);
                  const res = await reqApi({ chatId: chat.id }, user1Cookie);
                  const getChat = await chatService.getChat(chat.id);
                  const getChatFromDb = await chatRepository.getOneChatById(chat.id);

                  const findUser = getChat.users.find((item) => item.id === user1.id);
                  const findMessage = getChat.messages.find((item) => item.content === 'hello');

                  expect(getChatFromDb).toBeDefined();
                  expect(getChatFromDb.messages.length).toBe(1);
                  expect(getChatFromDb.users.length).toBe(2);
                  expect(findMessage.id).toBeDefined();
                  expect(findMessage.userId).toBe(user1.id);
                  expect(findMessage).toBeDefined();
                  expect(findUser).toBeDefined();
                  expect(res.status).toBe(200);
            });

            it('Failed user2 is not belong to this chat', async () => {
                  const chat = await chatService.createChat(user1);
                  const res = await reqApi({ chatId: chat.id }, user2Cookie);
                  const getChat = await chatService.getChat(chat.id);

                  expect(getChat.messages.length).toBe(0);
                  expect(res.status).toBe(403);
            });
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
