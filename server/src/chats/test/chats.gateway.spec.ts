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
import { MessageRepository } from '../entities/message.repository';

describe('ChatsGateway', () => {
      let app: INestApplication;
      const port = 5248;
      let client: SocketIOClient.Socket;
      let userSocketToken: string;
      let user: User;
      let chat: Chat;
      let message: Message;
      let userRepository: UserRepository;
      let chatRepository: ChatRepository;
      let messageRepository: MessageRepository;
      let resetDB: any;

      beforeAll(async () => {
            const { configModule, users, resetDatabase } = await initTestModule();
            app = configModule;

            userRepository = app.get<UserRepository>(UserRepository);
            chatRepository = app.get<ChatRepository>(ChatRepository);
            messageRepository = app.get<MessageRepository>(MessageRepository);

            userSocketToken = (await users[0]).ioToken;
            user = (await users[0]).user;

            // create a fake chat
            chat = new Chat();
            chat.users = [user];
            await chatRepository.save(chat);

            // create a fake message
            message = new Message();
            message.text = 'Hai dep trai';
            message.chat = chat;
            message.userId = (await users[0]).user.id;
            await messageRepository.save(message);

            resetDB = resetDatabase;
            await app.listen(port);
      });

      beforeEach(async () => {
            client = await getIoClient(port, 'chats', userSocketToken);
      });

      afterEach(async () => {
            await client.disconnect();
      });

      describe('chat-connection-chat', () => {
            beforeEach(async () => {
                  client.connect();
            });

            it('Pass(chat-connection-chat)', async (done) => {
                  client.on('chat-connection-chat', (data) => {
                        expect(data).toBeDefined();
                        done();
                  });
                  client.emit('chat-connection-chat', { chatId: chat.id });
                  client.on('chat-load-message-history', (data) => {
                        expect(data).toBeDefined();
                  });
            });
      });

      describe('chat-send-message', () => {
            beforeEach(async () => {
                  client.connect();
            });

            it('Pass(chat-send-message)', async (done) => {
                  client.on('chat-send-message', (data) => {
                        expect(data).toBeDefined();
                        done();
                  });
                  client.emit('chat-send-message', { message: message, chatId: chat.id });
            });
      });

      describe('chat-disconnection-chat', () => {
            beforeEach(async () => {
                  client.connect();
            });

            it('Pass(chat-disconnection-chat', async (done) => {
                  client.on('chat-disconnection-chat', (data) => {
                        expect(data).toBeDefined();
                        done();
                  });
                  client.emit('chat-disconnection-chat');
            });
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
