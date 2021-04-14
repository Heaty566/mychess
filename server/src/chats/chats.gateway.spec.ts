import { INestApplication } from '@nestjs/common';
import * as io from 'socket.io-client';
import { initTestModule } from '../../test/initTest';

describe('ChatsGateway', () => {
      let app: INestApplication;
      let port: number;
      let namespace: string;
      let client;

      let userSocketToken: string;
      beforeAll(async () => {
            const { configModule, socketToken } = await initTestModule();
            app = configModule;
            port = 5208;
            namespace = 'chat';
            userSocketToken = socketToken;

            await app.listen(port);
      });

      beforeEach(async () => {
            client = await io(`http://localhost:${port}/${namespace}`, {
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
