import { INestApplication } from '@nestjs/common';
import * as io from 'socket.io-client';
import { AuthService } from '../auth/auth.service';
import { initTestModule } from '../../test/initTest';
import { Socket } from 'socket.io-client';

describe('ChatsGateway', () => {
      let app: INestApplication;
      let port: number;
      let namespace: string;
      let client;
      let authService: AuthService;
      let socketToken: string;
      beforeAll(async () => {
            const { configModule, getUser } = await initTestModule();
            app = configModule;
            port = 5208;
            namespace = 'chat';
            authService = app.get<AuthService>(AuthService);
            socketToken = await authService.getSocketToken(getUser);
            await app.listen(port);
      });

      beforeEach(async () => {
            client = await io(`http://localhost:${port}/${namespace}`, {
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
