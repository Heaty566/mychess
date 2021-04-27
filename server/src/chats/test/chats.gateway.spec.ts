import { INestApplication } from '@nestjs/common';

//---- Helper
import { getIoClient } from '../../test/test.helper';
import { initTestModule } from '../../test/initTest';

//---- Entity
import User from '../../users/entities/user.entity';
import { Chat } from '../entities/chat.entity';
import { Message } from '../entities/message.entity';

//---- Repository
import { UserRepository } from '../../users/entities/user.repository';
import { ChatRepository } from '../entities/chat.repository';

describe('ChatsGateway', () => {
      let app: INestApplication;
      const port = 5208;
      let client: SocketIOClient.Socket;
      let userSocketToken: string;
      let user: User;
      let chat: Chat;
      let message: Message;
      let userRepository: UserRepository;
      let chatRepository: ChatRepository;
      let resetDB: any;

      beforeAll(async () => {
            const { configModule, users, messages, chats, resetDatabase } = await initTestModule();
            app = configModule;

            userRepository = app.get<UserRepository>(UserRepository);
            chatRepository = app.get<ChatRepository>(ChatRepository);

            userSocketToken = (await users[0]).ioToken;
            user = (await users[0]).user;

            chat = await chats;
            chat.users = [user];
            await chatRepository.save(chat);

            message = await messages;

            resetDB = resetDatabase;
            await app.listen(port);
      });

      beforeEach(async () => {
            client = await getIoClient(port, 'chats', userSocketToken);
      });

      afterEach(async () => {
            await client.disconnect();
      });

      describe('connection-chat', () => {
            beforeEach(async () => {
                  client.connect();
            });

            it('Pass(connection-chat-success)', async (done) => {
                  client.on('connection-chat-success', (data) => {
                        expect(data).toBeNull();
                        done();
                  });
                  client.emit('connection-chat', { chatId: chat.id });
                  client.on('load-message-history', (data) => {
                        expect(data).toBeDefined();
                  });
            });
      });

      describe('send-message', () => {
            beforeEach(async () => {
                  client.connect();
            });

            it('Pass(send-message-success)', async (done) => {
                  client.on('send-message-success', (data) => {
                        expect(data).toBeDefined();
                        done();
                  });
                  client.emit('send-message', message);
            });
      });

      describe('disconnection-chat', () => {
            beforeEach(async () => {
                  client.connect();
            });

            it('Pass(disconnection-chat-success', async (done) => {
                  client.on('disconnection-chat-success', (data) => {
                        expect(data).toBeNull();
                        done();
                  });
                  client.emit('disconnection-chat');
            });
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
