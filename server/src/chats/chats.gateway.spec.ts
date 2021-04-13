import { INestApplication } from '@nestjs/common';
import * as io from 'socket.io-client';

import { initTestModule } from '../../test/initTest';

describe('ChatsGateway', () => {
      let app: INestApplication;
      let port: number;
      let client;

      let userSocketToken: string;
      beforeAll(async () => {
            const { configModule, socketToken } = await initTestModule();
            app = configModule;
            port = 5208;
            userSocketToken = socketToken;

            await app.listen(port);
      });

      beforeEach(async () => {
            client = await io(`http://localhost:${port}`, {
                  autoConnect: false,
                  transportOptions: {
                        polling: {
                              extraHeaders: {
                                    Cookie: `io-token=${userSocketToken};`,
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
                        done();
                  });
                  client.emit('events', { data: 'hello' }, async () => {
                        //
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
