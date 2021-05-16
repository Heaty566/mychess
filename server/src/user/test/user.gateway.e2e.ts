import { INestApplication } from '@nestjs/common';

//---- Helper
import { getIoClient } from '../../test/test.helper';
import { initTestModule } from '../../test/initTest';

//---- Entity

import { User } from '../entities/user.entity';

//---- Repository

import { AuthService } from '../../auth/auth.service';

//---- Common
import { UserAction } from '../user.action';
import { SocketServerResponse } from '../../app/interface/socketResponse';
import { UserGateway } from '../user.gateway';

describe('TicTacToeGateway ', () => {
      let app: INestApplication;
      const port = 3604;
      let authService: AuthService;
      let createFakeUser: () => Promise<User>;

      let userGateway: UserGateway;
      let resetDB: any;

      beforeAll(async () => {
            const { configModule, resetDatabase, getFakeUser } = await initTestModule();
            app = configModule;
            createFakeUser = getFakeUser;
            resetDB = resetDatabase;
            await app.listen(port);

            userGateway = app.get<UserGateway>(UserGateway);
            authService = app.get<AuthService>(AuthService);
      });

      describe(``, () => {
            let client: SocketIOClient.Socket;
            let user: User;
            beforeEach(async () => {
                  user = await createFakeUser();
                  const socketToken = await authService.getSocketToken(user);
                  client = await getIoClient(port, '', socketToken);

                  await client.connect();
            });

            afterEach(async () => {
                  client.disconnect();
            });

            it('Pass', async (done) => {
                  client.on('test-join', () => {
                        done();
                  });

                  client.on(UserAction.USER_CONNECT, async (data: SocketServerResponse<null>) => {
                        userGateway.server.to(`user-${user.id}`).emit('test-join');
                        expect(data.statusCode).toBe(200);
                  });

                  client.emit(UserAction.USER_CONNECT, {});
            });
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
