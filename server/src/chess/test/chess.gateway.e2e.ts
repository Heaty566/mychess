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
      let chessGateway: ChessGateway;
      let generateFakeUser: () => Promise<User>;
      let chessCommonService: ChessCommonService;

      beforeAll(async () => {
            const { configModule, resetDatabase, getFakeUser } = await initTestModule();
            app = configModule;
            generateFakeUser = getFakeUser;
            resetDB = resetDatabase;
            await app.listen(port);

            authService = app.get<AuthService>(AuthService);
            chessGateway = app.get<ChessGateway>(ChessGateway);
            chessCommonService = app.get<ChessCommonService>(ChessCommonService);
            jest.spyOn(chessGateway.server, 'to').mockImplementation().mockReturnThis();
      });

      describe(`${ChessGatewayAction.CHESS_GET}`, () => {
            let client1: SocketIOClient.Socket;
            let client2: SocketIOClient.Socket;
            let user1: User;
            let boardId: string;

            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  boardId = await chessCommonService.createNewGame(user1, true);
                  const getBoard = await chessCommonService.getBoard(boardId);
                  await chessCommonService.toggleReadyStatePlayer(boardId, getBoard.users[0]);
                  await chessCommonService.toggleReadyStatePlayer(boardId, getBoard.users[1]);
                  await chessCommonService.startGame(boardId);

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

                  client1.emit(ChessGatewayAction.CHESS_GET, { roomId: boardId });
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
            let user2: User;
            let boardId: string;
            let player1: ChessPlayer;

            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  user2 = await generateFakeUser();
                  boardId = await chessCommonService.createNewGame(user1, false);
                  await chessCommonService.joinGame(boardId, user2);
                  const getBoard = await chessCommonService.getBoard(boardId);
                  await chessCommonService.toggleReadyStatePlayer(boardId, getBoard.users[0]);
                  await chessCommonService.toggleReadyStatePlayer(boardId, getBoard.users[1]);
                  await chessCommonService.startGame(boardId);

                  const socketToken1 = await authService.getSocketToken(user1);
                  client1 = await getIoClient(port, 'chess', socketToken1);
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
                  const getBoard = await chessCommonService.getBoard(boardId);
                  getBoard.turn = false;
                  await chessCommonService.setBoard(getBoard);

                  client1.on(ChessGatewayAction.CHESS_COUNTER, async (data: SocketServerResponse<Array<ChessPlayer>>) => {
                        expect(data.data[0].time).not.toBe(900000);
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client1.emit(ChessGatewayAction.CHESS_COUNTER, { roomId: boardId });
            });
            it('Pass user2', async (done) => {
                  const getBoard = await chessCommonService.getBoard(boardId);
                  getBoard.turn = true;
                  await chessCommonService.setBoard(getBoard);

                  client1.on(ChessGatewayAction.CHESS_COUNTER, async (data: SocketServerResponse<Array<ChessPlayer>>) => {
                        expect(data.data[1].time).not.toBe(900000);
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client1.emit(ChessGatewayAction.CHESS_COUNTER, { roomId: boardId });
            });

            it('Failed game is end', async (done) => {
                  await chessCommonService.surrender(boardId, player1);

                  client1.on(ChessGatewayAction.CHESS_COUNTER, async (data: SocketServerResponse<Array<ChessPlayer>>) => {
                        expect(data.data[0].time).toBe(900000);
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client1.emit(ChessGatewayAction.CHESS_COUNTER, { roomId: boardId });
            });
            it('Failed user time out', async (done) => {
                  const getBoard = await chessCommonService.getBoard(boardId);
                  getBoard.turn = false;
                  getBoard.users[0].time = 0;
                  await chessCommonService.setBoard(getBoard);

                  client1.on(ChessGatewayAction.CHESS_COUNTER, async (data: SocketServerResponse<ChessBoard>) => {
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client1.emit(ChessGatewayAction.CHESS_COUNTER, { roomId: boardId });
            });
      });

      describe(`${ChessGatewayAction.CHESS_JOIN}`, () => {
            let client1: SocketIOClient.Socket;
            let client2: SocketIOClient.Socket;
            let user1: User;
            let user2: User;
            let boardId: string;

            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  user2 = await generateFakeUser();
                  boardId = await chessCommonService.createNewGame(user1, true);

                  const getBoard = await chessCommonService.getBoard(boardId);
                  await chessCommonService.toggleReadyStatePlayer(boardId, getBoard.users[0]);
                  await chessCommonService.toggleReadyStatePlayer(boardId, getBoard.users[1]);
                  await chessCommonService.startGame(boardId);

                  const socketToken1 = await authService.getSocketToken(user1);
                  client1 = await getIoClient(port, 'chess', socketToken1);

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

                  client1.emit(ChessGatewayAction.CHESS_JOIN, { roomId: boardId });
            });

            it('Failed wrong user', async (done) => {
                  client2.on('exception', async (data: SocketServerResponse<null>) => {
                        expect(data.statusCode).toBe(401);
                        done();
                  });

                  client2.emit(ChessGatewayAction.CHESS_JOIN, { roomId: boardId });
            });
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
