import { INestApplication } from '@nestjs/common';

//---- Helper
import { getIoClient } from '../../test/test.helper';
import { initTestModule } from '../../test/initTest';

//---- Entity
import { Chat } from '../entities/chat.entity';
import { User } from '../../user/entities/user.entity';

//---- Service
import { AuthService } from '../../auth/auth.service';
import { ChatService } from '../chat.service';

//---- Gateway
import { ChatGateway } from '../chat.gateway';

//---- Common
import { SocketServerResponse } from '../../app/interface/socketResponse';
import { ChatGatewayAction } from '../chatGateway.action';

describe('ChatGateway ', () => {
      let app: INestApplication;
      const port = 4832;
      let authService: AuthService;

      let resetDB: any;
      let chatGateway: ChatGateway;
      let chatService: ChatService;
      let generateFakeUser: () => Promise<User>;

      beforeAll(async () => {
            const { configModule, resetDatabase, getFakeUser } = await initTestModule();
            app = configModule;
            generateFakeUser = getFakeUser;
            resetDB = resetDatabase;
            await app.listen(port);

            authService = app.get<AuthService>(AuthService);
            chatGateway = app.get<ChatGateway>(ChatGateway);
            chatService = app.get<ChatService>(ChatService);
            jest.spyOn(chatGateway.server, 'to').mockImplementation().mockReturnThis();
      });

      describe(`${ChatGatewayAction.CHAT_GET}`, () => {
            let client1: SocketIOClient.Socket;
            let client2: SocketIOClient.Socket;
            let user1: User;
            let chat: Chat;

            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  chat = await chatService.createChat(user1);
                  await chatService.addMessage(chat.id, user1, 'hello');
                  const socketToken1 = await authService.getSocketToken(user1);
                  client1 = await getIoClient(port, 'chat', socketToken1);
                  const user2 = await generateFakeUser();
                  const socketToken2 = await authService.getSocketToken(user2);
                  client2 = await getIoClient(port, 'chat', socketToken2);

                  await client2.connect();
                  await client1.connect();
            });

            afterEach(async () => {
                  client1.disconnect();
                  client2.disconnect();
            });

            it('Pass', async (done) => {
                  client1.on(ChatGatewayAction.CHAT_GET, async (data: SocketServerResponse<Chat>) => {
                        const isExistUser = data.data.users.find((item) => item.id === user1.id);
                        expect(isExistUser).toBeDefined();
                        expect(data.data).toBeDefined();
                        expect(data.data.users.length).toBe(1);
                        expect(data.data.messages.length).toBe(1);
                        expect(data.data.users[0].name).toBeDefined();
                        expect(data.data.users[0].avatarUrl).toBeDefined();
                        expect(data.data.users[0].password).toBeNull();
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client1.emit(ChatGatewayAction.CHAT_GET, { chatId: chat.id });
            });

            it('Failed Not Found', async (done) => {
                  client1.on('exception', async (data: SocketServerResponse<null>) => {
                        expect(data.statusCode).toBe(404);
                        done();
                  });

                  client1.emit(ChatGatewayAction.CHAT_GET, { chatId: 'hello-world' });
            });

            it('Failed action not allow', async (done) => {
                  client2.on('exception', async (data: SocketServerResponse<null>) => {
                        expect(data.statusCode).toBe(403);
                        done();
                  });

                  client2.emit(ChatGatewayAction.CHAT_GET, { chatId: chat.id });
            });
      });

      describe(`${ChatGatewayAction.CHAT_JOIN}`, () => {
            let client1: SocketIOClient.Socket;
            let user1: User;
            let chat: Chat;

            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  chat = await chatService.createChat(user1);

                  const socketToken1 = await authService.getSocketToken(user1);
                  client1 = await getIoClient(port, 'chat', socketToken1);

                  await client1.connect();
            });

            afterEach(async () => {
                  client1.disconnect();
            });

            it('Pass', async (done) => {
                  client1.on(ChatGatewayAction.CHAT_JOIN, async (data: SocketServerResponse<Chat>) => {
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client1.emit(ChatGatewayAction.CHAT_JOIN, { chatId: chat.id });
            });

            // it('Failed Not Found', async (done) => {
            //       client1.on('exception', async (data: SocketServerResponse<null>) => {
            //             expect(data.statusCode).toBe(404);
            //             done();
            //       });

            //       client1.emit(ChatGatewayAction.CHAT_GET, { chatId: 'hello-world' });
            // });

            // it('Failed action not allow', async (done) => {
            //       client2.on('exception', async (data: SocketServerResponse<null>) => {
            //             expect(data.statusCode).toBe(403);
            //             done();
            //       });

            //       client2.emit(ChatGatewayAction.CHAT_GET, { chatId: chat.id });
            // });
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
