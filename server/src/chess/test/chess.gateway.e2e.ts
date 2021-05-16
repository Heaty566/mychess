import { INestApplication } from '@nestjs/common';

//---- Helper
import { getIoClient } from '../../test/test.helper';
import { initTestModule } from '../../test/initTest';

//---- Entity
import { ChessBoard } from '../entity/chessBoard.entity';
import { ChessPlayer } from '../entity/chess.interface';
import { User } from '../../user/entities/user.entity';

//---- Service
import { ChessCommonService } from '../chessCommon.service';
import { AuthService } from '../../auth/auth.service';

//---- Gateway
import { ChessGateway } from '../chess.gateway';

//---- Common
import { SocketServerResponse } from '../../app/interface/socketResponse';
import { ChessGatewayAction } from '../chessGateway.action';

describe('ChessGateway ', () => {
      let app: INestApplication;
      const port = 5032;
      let authService: AuthService;

      let resetDB: any;
      let ticTacToeGateWay: ChessGateway;
      let generateFakeUser: () => Promise<User>;
      let ticTacToeCommonService: ChessCommonService;

      beforeAll(async () => {
            const { configModule, resetDatabase, getFakeUser } = await initTestModule();
            app = configModule;
            generateFakeUser = getFakeUser;
            resetDB = resetDatabase;
            await app.listen(port);

            authService = app.get<AuthService>(AuthService);
            ticTacToeGateWay = app.get<ChessGateway>(ChessGateway);
            ticTacToeCommonService = app.get<ChessCommonService>(ChessCommonService);
            jest.spyOn(ticTacToeGateWay.server, 'to').mockImplementation().mockReturnThis();
      });

      describe(`${ChessGatewayAction.CHESS_GET}`, () => {
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
                  client1 = await getIoClient(port, 'chess', socketToken1);
                  const user2 = await generateFakeUser();
                  const socketToken2 = await authService.getSocketToken(user2);
                  client2 = await getIoClient(port, 'chess', socketToken2);
                  await client2.connect();
                  await client1.connect();
            });

            afterEach(async () => {
                  client1.disconnect();
                  client2.disconnect();
            });

            it('Pass', async (done) => {
                  client1.on(ChessGatewayAction.CHESS_GET, async (data: SocketServerResponse<ChessBoard>) => {
                        const isExistUser = data.data.users.find((item) => item.id === user1.id);

                        expect(isExistUser).toBeDefined();
                        expect(data.data).toBeDefined();
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client1.emit(ChessGatewayAction.CHESS_GET, { roomId: tttId });
            });

            it('Failed Not Found', async (done) => {
                  client1.on('exception', async (data: SocketServerResponse<null>) => {
                        expect(data.statusCode).toBe(404);
                        done();
                  });

                  client1.emit(ChessGatewayAction.CHESS_GET, { roomId: 'hello-world' });
            });
      });

      describe(`${ChessGatewayAction.CHESS_COUNTER}`, () => {
            let client1: SocketIOClient.Socket;
            let client2: SocketIOClient.Socket;
            let user1: User;
            let tttId: string;
            let player1: ChessPlayer;

            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  tttId = await ticTacToeCommonService.createNewGame(user1, true);
                  const getBoard = await ticTacToeCommonService.getBoard(tttId);
                  await ticTacToeCommonService.toggleReadyStatePlayer(tttId, getBoard.users[0]);
                  await ticTacToeCommonService.toggleReadyStatePlayer(tttId, getBoard.users[1]);
                  await ticTacToeCommonService.startGame(tttId);

                  const socketToken1 = await authService.getSocketToken(user1);
                  client1 = await getIoClient(port, 'chess', socketToken1);
                  const user2 = await generateFakeUser();
                  const socketToken2 = await authService.getSocketToken(user2);
                  client2 = await getIoClient(port, 'chess', socketToken2);

                  player1 = getBoard.users[0];

                  await client2.connect();
                  await client1.connect();
            });

            afterEach(async () => {
                  client1.disconnect();
                  client2.disconnect();
            });

            it('Pass user1', async (done) => {
                  const getBoard = await ticTacToeCommonService.getBoard(tttId);
                  getBoard.turn = false;
                  await ticTacToeCommonService.setBoard(getBoard);

                  client1.on(ChessGatewayAction.CHESS_COUNTER, async (data: SocketServerResponse<Array<ChessPlayer>>) => {
                        expect(data.data[0].time).not.toBe(900000);
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client1.emit(ChessGatewayAction.CHESS_COUNTER, { roomId: tttId });
            });
            it('Pass user2', async (done) => {
                  const getBoard = await ticTacToeCommonService.getBoard(tttId);
                  getBoard.turn = true;
                  await ticTacToeCommonService.setBoard(getBoard);

                  client1.on(ChessGatewayAction.CHESS_COUNTER, async (data: SocketServerResponse<Array<ChessPlayer>>) => {
                        expect(data.data[1].time).not.toBe(900000);
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client1.emit(ChessGatewayAction.CHESS_COUNTER, { roomId: tttId });
            });

            it('Failed game is end', async (done) => {
                  await ticTacToeCommonService.surrender(tttId, player1);

                  client1.on(ChessGatewayAction.CHESS_COUNTER, async (data: SocketServerResponse<Array<ChessPlayer>>) => {
                        expect(data.data[0].time).toBe(900000);
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client1.emit(ChessGatewayAction.CHESS_COUNTER, { roomId: tttId });
            });
            it('Failed user time out', async (done) => {
                  const getBoard = await ticTacToeCommonService.getBoard(tttId);
                  getBoard.turn = false;
                  getBoard.users[0].time = 0;
                  await ticTacToeCommonService.setBoard(getBoard);

                  client1.on(ChessGatewayAction.CHESS_COUNTER, async (data: SocketServerResponse<ChessBoard>) => {
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client1.emit(ChessGatewayAction.CHESS_COUNTER, { roomId: tttId });
            });
      });

      describe(`${ChessGatewayAction.CHESS_JOIN}`, () => {
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
                  client1 = await getIoClient(port, 'chess', socketToken1);
                  const user2 = await generateFakeUser();
                  const socketToken2 = await authService.getSocketToken(user2);
                  client2 = await getIoClient(port, 'chess', socketToken2);
                  await client2.connect();
                  await client1.connect();
            });

            afterEach(async () => {
                  client1.disconnect();
                  client2.disconnect();
            });

            it('Pass', async (done) => {
                  client1.on(ChessGatewayAction.CHESS_JOIN, async (data: SocketServerResponse<null>) => {
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client1.emit(ChessGatewayAction.CHESS_JOIN, { roomId: tttId });
            });
            it('Failed wrong user', async (done) => {
                  client2.on('exception', async (data: SocketServerResponse<null>) => {
                        expect(data.statusCode).toBe(401);
                        done();
                  });

                  client2.emit(ChessGatewayAction.CHESS_JOIN, { roomId: tttId });
            });
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
