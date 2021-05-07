import { INestApplication } from '@nestjs/common';

//---- Helper
import { getIoClient } from '../../test/test.helper';
import { initTestModule } from '../../test/initTest';

//---- Entity

import { User } from '../../users/entities/user.entity';
import { TicTacToeBoard } from '../entity/ticTacToeBoard.entity';

//---- Service
import { TicTacToeCommonService } from '../ticTacToeCommon.service';
import { AuthService } from '../../auth/auth.service';

//---- Gateway
import { TicTacToeGateway } from '../ticTacToe.gateway';

//---- Common
import { TTTGatewayAction } from '../ticTacToeGateway.action';
import { SocketServerResponse } from '../../app/interface/socketResponse';

describe('TicTacToeGateway ', () => {
      let app: INestApplication;
      const port = 3021;
      let authService: AuthService;

      let resetDB: any;
      let ticTacToeGateWay: TicTacToeGateway;
      let generateFakeUser: () => Promise<User>;
      let ticTacToeCommonService: TicTacToeCommonService;

      beforeAll(async () => {
            const { configModule, resetDatabase, getFakeUser } = await initTestModule();
            app = configModule;
            generateFakeUser = getFakeUser;
            resetDB = resetDatabase;
            await app.listen(port);

            authService = app.get<AuthService>(AuthService);
            ticTacToeGateWay = app.get<TicTacToeGateway>(TicTacToeGateway);
            ticTacToeCommonService = app.get<TicTacToeCommonService>(TicTacToeCommonService);
            jest.spyOn(ticTacToeGateWay.server, 'to').mockImplementation().mockReturnThis();
      });

      describe(`${TTTGatewayAction.TTT_GET}`, () => {
            let client1: SocketIOClient.Socket;
            let client2: SocketIOClient.Socket;
            let user1: User;
            let tttId: string;

            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  tttId = await ticTacToeCommonService.createNewGame(user1, true);
                  const getBoard = await ticTacToeCommonService.getBoard(tttId);
                  await ticTacToeCommonService.toggleReadyStatePlayer(tttId, getBoard.users[0]);
                  await ticTacToeCommonService.toggleReadyStatePlayer(tttId, getBoard.users[1]);
                  await ticTacToeCommonService.startGame(tttId);

                  const socketToken1 = await authService.getSocketToken(user1);
                  client1 = await getIoClient(port, 'tic-tac-toe', socketToken1);
                  const user2 = await generateFakeUser();
                  const socketToken2 = await authService.getSocketToken(user2);
                  client2 = await getIoClient(port, 'tic-tac-toe', socketToken2);
                  await client2.connect();
                  await client1.connect();
            });

            afterEach(async () => {
                  client1.disconnect();
                  client2.disconnect();
            });

            it('Pass', async (done) => {
                  client1.on(TTTGatewayAction.TTT_GET, async (data: SocketServerResponse<TicTacToeBoard>) => {
                        const isExistUser = data.data.users.find((item) => item.id === user1.id);

                        expect(isExistUser).toBeDefined();
                        expect(data.data).toBeDefined();
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client1.emit(TTTGatewayAction.TTT_GET, { roomId: tttId });
            });

            it('Failed Not Found', async (done) => {
                  client1.on('exception', async (data: SocketServerResponse<null>) => {
                        expect(data.statusCode).toBe(404);
                        done();
                  });

                  client1.emit(TTTGatewayAction.TTT_GET, { roomId: 'hello-world' });
            });
      });

      describe(`${TTTGatewayAction.TTT_JOIN}`, () => {
            let client1: SocketIOClient.Socket;
            let client2: SocketIOClient.Socket;
            let user1: User;
            let tttId: string;

            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  tttId = await ticTacToeCommonService.createNewGame(user1, true);
                  const getBoard = await ticTacToeCommonService.getBoard(tttId);
                  await ticTacToeCommonService.toggleReadyStatePlayer(tttId, getBoard.users[0]);
                  await ticTacToeCommonService.toggleReadyStatePlayer(tttId, getBoard.users[1]);
                  await ticTacToeCommonService.startGame(tttId);

                  const socketToken1 = await authService.getSocketToken(user1);
                  client1 = await getIoClient(port, 'tic-tac-toe', socketToken1);
                  const user2 = await generateFakeUser();
                  const socketToken2 = await authService.getSocketToken(user2);
                  client2 = await getIoClient(port, 'tic-tac-toe', socketToken2);
                  await client2.connect();
                  await client1.connect();
            });

            afterEach(async () => {
                  client1.disconnect();
                  client2.disconnect();
            });

            it('Pass', async (done) => {
                  client1.on(TTTGatewayAction.TTT_JOIN, async (data: SocketServerResponse<null>) => {
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client1.emit(TTTGatewayAction.TTT_JOIN, { roomId: tttId });
            });
            it('Failed wrong user', async (done) => {
                  client2.on('exception', async (data: SocketServerResponse<null>) => {
                        expect(data.statusCode).toBe(401);
                        done();
                  });

                  client2.emit(TTTGatewayAction.TTT_JOIN, { roomId: tttId });
            });
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
