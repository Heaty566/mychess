import { INestApplication } from '@nestjs/common';
import * as io from 'socket.io-client';
import { initTestModule } from '../../test/initTest';

describe('ChatsGateway', () => {
      let app: INestApplication;
      let port: number;
      let client;

      beforeAll(async () => {
            const { configModule } = await initTestModule();
            app = configModule;
            port = 5208;
            await app.listen(port);
      });

      beforeEach(async () => {
            client = await io(`http://localhost:${port}`, { autoConnect: false });
      });

      afterEach(async () => {
            await client.disconnect();
      });

      describe('', () => {
            beforeEach(async () => {
                  await client.connect();
            });

            it('Pass', async (done) => {
                  client.emit('events', { data: 'hello' }, async () => {
                        console.log('call');
                  });

                  client.on('events', (data) => {
                        console.log(data);
                        done();
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
