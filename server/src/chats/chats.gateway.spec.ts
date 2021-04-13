import { INestApplication } from '@nestjs/common';
import * as io from 'socket.io-client';
import { AuthService } from '../auth/auth.service';
import { initTestModule } from '../../test/initTest';

describe('ChatsGateway', () => {
      let app: INestApplication;
      let port: number;
      let client;
      let authService: AuthService;
      let socketToken: string;
      beforeAll(async () => {
            const { configModule, getUser } = await initTestModule();
            app = configModule;
            port = 5208;
            authService = app.get<AuthService>(AuthService);
            socketToken = await authService.getSocketToken(getUser);
            await app.listen(port);
      });

      beforeEach(async () => {
            client = await io(`http://localhost:${port}`, {
                  autoConnect: false,
                  transportOptions: {
                        polling: {
                              extraHeaders: {
                                    Cookie: `io-token=${socketToken};`,
                              },
                        },
                  },
            });
      });

      afterEach(async () => {
            await client.disconnect();
      });

      describe('', () => {
            beforeEach(async () => {
                  await client.connect();
            });

            it('Pass', async (done) => {
                  client.on('events', (data) => {
                        console.log(data);
                        done();
                  });
                  client.emit('events', { data: 'hello' }, async () => {
                        console.log('call');
                  });
            });
      });

      afterAll(async () => {
            await app.close();
      });
});

// import { Test, TestingModule } from '@nestjs/testing';
// import { ChatsGateway } from './chats.gateway';
// import { ChatsService } from './chats.service';

// describe('ChatsGateway', () => {
//       let gateway: ChatsGateway;

//       beforeEach(async () => {
//             const module: TestingModule = await Test.createTestingModule({
//                   providers: [ChatsGateway, ChatsService],
//             }).compile();

//             gateway = module.get<ChatsGateway>(ChatsGateway);
//       });

//       it('should be defined', () => {
//             expect(gateway).toBeDefined();
//       });
// });
