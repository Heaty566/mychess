import { INestApplication } from '@nestjs/common';

//---- Helper
import { getIoClient } from '../../test/test.helper';
import { initTestModule } from '../../test/initTest';

//---- Entity
import User from '../../users/entities/user.entity';

//---- Repository
import { UserRepository } from '../../users/entities/user.repository';
import { Chat } from '../entities/chat.entity';

describe('ChatsGateway', () => {
      let app: INestApplication;
      const port = 5208;
      let client: SocketIOClient.Socket;
      let userSocketToken: string;
      let user: User;
      let chat: Chat;
      let userRepository: UserRepository;
      let resetDB: any;

      beforeAll(async () => {
            const { configModule, users, chats, resetDatabase } = await initTestModule();
            app = configModule;

            userSocketToken = (await users[0]).ioToken;
            user = (await users[0]).user;

            chat = await chats;

            resetDB = resetDatabase;
            await app.listen(port);

            userRepository = app.get<UserRepository>(UserRepository);
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
                        expect(typeof data).toBe('object');
                  });
            });
      });

      describe('send-message', () => {
            beforeEach(async () => {
                  client.connect();
            });

            it('Pass(send-message-success)', async (done) => {
                  client.on('send-message-success', (data) => {
                        expect(data).toBeNull();
                        done();
                  });
                  client.emit('send-message', 123);
            });
      });
});
