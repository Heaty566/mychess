import { INestApplication } from '@nestjs/common';

//---- Helper
import { getIoClient } from '../../test/test.helper';
import { initTestModule } from '../../test/initTest';

//---- Entity

import { User } from '../../users/entities/user.entity';
//---- Repository

import { AuthService } from '../../auth/auth.service';
import { TicTacToeStatus } from '../entity/ticTacToe.interface';
import { TicTacToeGateway } from '../ticTacToe.gateway';
//---- Common
import { TTTGatewayAction } from '../ticTacToe.action';
import { SocketServerResponse } from '../../app/interface/socketResponse';
import { RoomIdDTO } from '../dto/roomIdDto';
import { TicTacToeService } from '../ticTacToe.service';
import { TicTacToeBoard } from '../entity/ticTacToeBoard.entity';
import { TicTacToeCommonService } from '../ticTacToeCommon.service';
import { AddMoveDto } from '../dto/addMoveDto';
import { TicTacToeBotService } from '../ticTacToeBot.service';

describe('TicTacToeGateway ', () => {
      let app: INestApplication;
      const port = 3021;
      let authService: AuthService;

      let resetDB: any;
      let ticTacToeGateWay: TicTacToeGateway;
      let generateFakeUser: () => Promise<User>;
      let ticTacToeService: TicTacToeService;
      let ticTacToeCommonService: TicTacToeCommonService;

      let tttBoard: TicTacToeBoard;
      let ticTacToeBotService: TicTacToeBotService;
      let user1: User;
      let user2: User;
      beforeAll(async () => {
            const { configModule, resetDatabase, getFakeUser } = await initTestModule();
            app = configModule;
            generateFakeUser = getFakeUser;
            resetDB = resetDatabase;
            await app.listen(port);

            authService = app.get<AuthService>(AuthService);
            ticTacToeGateWay = app.get<TicTacToeGateway>(TicTacToeGateway);
            ticTacToeCommonService = app.get<TicTacToeCommonService>(TicTacToeCommonService);
            ticTacToeService = app.get<TicTacToeService>(TicTacToeService);
            ticTacToeBotService = app.get<TicTacToeBotService>(TicTacToeBotService);
            jest.spyOn(ticTacToeGateWay.server, 'to').mockImplementation().mockReturnThis();
      });

      describe(`${TTTGatewayAction.TTT_GET}`, () => {
            let client1: SocketIOClient.Socket;
            let client2: SocketIOClient.Socket;

            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  user2 = await generateFakeUser();
                  tttBoard = await ticTacToeCommonService.createNewGame(user1, false);

                  const socketToken1 = await authService.getSocketToken(user1);
                  client1 = await getIoClient(port, 'tic-tac-toe', socketToken1);

                  const socketToken2 = await authService.getSocketToken(user2);
                  client2 = await getIoClient(port, 'tic-tac-toe', socketToken2);

                  await client1.connect();
                  await client2.connect();
            });

            afterEach(async () => {
                  client1.disconnect();
                  client2.disconnect();
            });

            it('Pass', async (done) => {
                  client1.on(TTTGatewayAction.TTT_GET, async (data: SocketServerResponse<TicTacToeBoard>) => {
                        const isExistUser = data.data.info.users.find((item) => item.id === user1.id);

                        expect(isExistUser).toBeDefined();
                        expect(data.data).toBeDefined();
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client1.emit(TTTGatewayAction.TTT_GET, { roomId: tttBoard.id });
            });
            it('Failed Not Found', async (done) => {
                  client1.on('exception', async (data: SocketServerResponse<null>) => {
                        expect(data.statusCode).toBe(404);
                        done();
                  });

                  client1.emit(TTTGatewayAction.TTT_GET, { roomId: 'hello-world' });
            });

            it('Failed user is not allow', async (done) => {
                  client2.on('exception', async (data: SocketServerResponse<null>) => {
                        expect(data.statusCode).toBe(401);
                        done();
                  });

                  client2.emit(TTTGatewayAction.TTT_GET, { roomId: tttBoard.id });
            });
      });

      describe(`${TTTGatewayAction.TTT_JOIN}`, () => {
            let client1: SocketIOClient.Socket;
            let client2: SocketIOClient.Socket;

            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  user2 = await generateFakeUser();
                  tttBoard = await ticTacToeCommonService.createNewGame(user1, false);

                  const socketToken1 = await authService.getSocketToken(user1);
                  client1 = await getIoClient(port, 'tic-tac-toe', socketToken1);

                  const socketToken2 = await authService.getSocketToken(user2);
                  client2 = await getIoClient(port, 'tic-tac-toe', socketToken2);

                  await client1.connect();
                  await client2.connect();
            });

            afterEach(async () => {
                  client1.disconnect();
                  client2.disconnect();
            });

            it('Pass', async (done) => {
                  client1.on(TTTGatewayAction.TTT_JOIN, async (data: SocketServerResponse<null>) => {
                        expect(data.data).toBeDefined();
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client1.emit(TTTGatewayAction.TTT_JOIN, { roomId: tttBoard.id });
            });
      });

      describe(`${TTTGatewayAction.TTT_READY}`, () => {
            let client1: SocketIOClient.Socket;
            let client2: SocketIOClient.Socket;

            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  user2 = await generateFakeUser();
                  tttBoard = await ticTacToeCommonService.createNewGame(user1, false);
                  tttBoard.info.users.push(user2);
                  await ticTacToeService.loadUser(tttBoard);
                  tttBoard = await ticTacToeCommonService.getBoard(tttBoard.id);

                  const socketToken1 = await authService.getSocketToken(user1);
                  client1 = await getIoClient(port, 'tic-tac-toe', socketToken1);

                  const socketToken2 = await authService.getSocketToken(user2);
                  client2 = await getIoClient(port, 'tic-tac-toe', socketToken2);

                  await client1.connect();
                  await client2.connect();
            });

            afterEach(async () => {
                  client1.disconnect();
                  client2.disconnect();
            });

            it('Pass', async (done) => {
                  client1.on(TTTGatewayAction.TTT_READY, async (data: SocketServerResponse<null>) => {
                        expect(data.data).toBeDefined();
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client1.emit(TTTGatewayAction.TTT_READY, { roomId: tttBoard.id });
            });
            it('Failed user only one', async (done) => {
                  await ticTacToeService.leaveGame(tttBoard, user2);
                  client1.on('exception', async (data: SocketServerResponse<null>) => {
                        expect(data.statusCode).toBe(400);
                        done();
                  });

                  client1.emit(TTTGatewayAction.TTT_READY, { roomId: tttBoard.id });
            });
      });

      describe(`${TTTGatewayAction.TTT_BOT_BEST_MOVE}`, () => {
            let client1: SocketIOClient.Socket;
            let client2: SocketIOClient.Socket;

            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  user2 = await generateFakeUser();
                  tttBoard = await ticTacToeCommonService.createNewGame(user1, true);
                  const bot = ticTacToeBotService.getBotInfo();
                  tttBoard.currentTurn = false;
                  tttBoard.info.users = [bot, user1];
                  tttBoard.users[0].ready = true;
                  tttBoard.users[1].ready = true;
                  tttBoard.users[0].id = '123456';
                  await ticTacToeCommonService.setBoard(tttBoard.id, tttBoard);
                  await ticTacToeService.startGame(tttBoard);
                  tttBoard = await ticTacToeCommonService.getBoard(tttBoard.id);

                  const socketToken1 = await authService.getSocketToken(user1);
                  client1 = await getIoClient(port, 'tic-tac-toe', socketToken1);

                  const socketToken2 = await authService.getSocketToken(user2);
                  client2 = await getIoClient(port, 'tic-tac-toe', socketToken2);

                  await client1.connect();
                  await client2.connect();
            });

            afterEach(async () => {
                  client1.disconnect();
                  client2.disconnect();
            });

            it('Pass', async (done) => {
                  const input: AddMoveDto = {
                        roomId: tttBoard.id,
                        x: 1,
                        y: 1,
                  };

                  client1.on(TTTGatewayAction.TTT_BOT_BEST_MOVE, async (data: SocketServerResponse<null>) => {
                        const getBoard = await ticTacToeCommonService.getBoard(tttBoard.id);

                        expect(getBoard.board[1][1]).toBe(1);
                        expect(getBoard.currentTurn).toBeFalsy();
                        expect(data.data).toBeDefined();
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client1.emit(TTTGatewayAction.TTT_BOT_BEST_MOVE, input);
            });

            it('Failed cell is picked', async (done) => {
                  const input: AddMoveDto = {
                        roomId: tttBoard.id,
                        x: 0,
                        y: 0,
                  };

                  tttBoard.board[0][0] = 0;
                  await ticTacToeCommonService.setBoard(tttBoard.id, tttBoard);

                  client1.on('exception', async (data: SocketServerResponse<null>) => {
                        const getBoard = await ticTacToeCommonService.getBoard(tttBoard.id);

                        expect(getBoard.board[0][0]).toBe(0);
                        expect(getBoard.currentTurn).toBeFalsy();
                        expect(data.data).toBeDefined();
                        expect(data.statusCode).toBe(400);
                        done();
                  });

                  client1.emit(TTTGatewayAction.TTT_BOT_BEST_MOVE, input);
            });
            it('Failed wrong turn', async (done) => {
                  const input: AddMoveDto = {
                        roomId: tttBoard.id,
                        x: 0,
                        y: 0,
                  };

                  tttBoard.currentTurn = true;
                  await ticTacToeCommonService.setBoard(tttBoard.id, tttBoard);

                  client1.on('exception', async (data: SocketServerResponse<null>) => {
                        const getBoard = await ticTacToeCommonService.getBoard(tttBoard.id);

                        expect(getBoard.board[0][0]).toBe(-1);
                        expect(getBoard.currentTurn).toBeTruthy();
                        expect(data.data).toBeDefined();
                        expect(data.statusCode).toBe(400);
                        done();
                  });

                  client1.emit(TTTGatewayAction.TTT_BOT_BEST_MOVE, input);
            });

            it('Pass user win', async (done) => {
                  const input: AddMoveDto = {
                        roomId: tttBoard.id,
                        x: 0,
                        y: 0,
                  };
                  tttBoard.board[1][1] = 1;
                  tttBoard.board[2][2] = 1;
                  tttBoard.board[3][3] = 1;
                  tttBoard.board[4][4] = 1;
                  await ticTacToeCommonService.setBoard(tttBoard.id, tttBoard);

                  client1.on(TTTGatewayAction.TTT_BOT_BEST_MOVE, async (data: SocketServerResponse<null>) => {
                        const getBoard = await ticTacToeCommonService.getBoard(tttBoard.id);

                        expect(getBoard.board[0][0]).toBe(1);
                        expect(getBoard.info.winner).toBe(1);
                        expect(getBoard.info.status).toBe(TicTacToeStatus.END);
                        expect(getBoard.currentTurn).toBeTruthy();
                        expect(data.data).toBeDefined();
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client1.emit(TTTGatewayAction.TTT_BOT_BEST_MOVE, input);
            });

            it('Pass bot win', async (done) => {
                  const input: AddMoveDto = {
                        roomId: tttBoard.id,
                        x: 0,
                        y: 0,
                  };
                  tttBoard.board[1][1] = 0;
                  tttBoard.board[2][2] = 0;
                  tttBoard.board[3][3] = 0;
                  tttBoard.board[4][4] = 0;
                  await ticTacToeCommonService.setBoard(tttBoard.id, tttBoard);

                  client1.on(TTTGatewayAction.TTT_BOT_BEST_MOVE, async (data: SocketServerResponse<null>) => {
                        const getBoard = await ticTacToeCommonService.getBoard(tttBoard.id);

                        expect(getBoard.board[5][5]).toBe(0);
                        expect(getBoard.info.winner).toBe(0);
                        expect(getBoard.info.status).toBe(TicTacToeStatus.END);
                        expect(getBoard.currentTurn).toBeFalsy();
                        expect(data.data).toBeDefined();
                        expect(data.statusCode).toBe(200);

                        done();
                  });

                  client1.emit(TTTGatewayAction.TTT_BOT_BEST_MOVE, input);
            });
            it('Failed room is end', async (done) => {
                  const input: AddMoveDto = {
                        roomId: tttBoard.id,
                        x: 0,
                        y: 0,
                  };
                  tttBoard.info.status = TicTacToeStatus.END;
                  await ticTacToeCommonService.setBoard(tttBoard.id, tttBoard);

                  client1.on('exception', async (data: SocketServerResponse<null>) => {
                        const getBoard = await ticTacToeCommonService.getBoard(tttBoard.id);

                        expect(getBoard.board[0][0]).toBe(-1);
                        expect(getBoard.info.status).toBe(TicTacToeStatus.END);
                        expect(getBoard.currentTurn).toBeFalsy();
                        expect(data.data).toBeDefined();
                        expect(data.statusCode).toBe(400);

                        done();
                  });
                  client1.emit(TTTGatewayAction.TTT_BOT_BEST_MOVE, input);
            });
            it('Failed wrong player', async (done) => {
                  const input: AddMoveDto = {
                        roomId: tttBoard.id,
                        x: 0,
                        y: 0,
                  };

                  client2.on('exception', async (data: SocketServerResponse<null>) => {
                        const getBoard = await ticTacToeCommonService.getBoard(tttBoard.id);

                        expect(getBoard.board[0][0]).toBe(-1);
                        expect(getBoard.info.status).toBe(TicTacToeStatus.PLAYING);
                        expect(getBoard.currentTurn).toBeFalsy();
                        expect(data.data).toBeDefined();
                        expect(data.statusCode).toBe(401);

                        done();
                  });

                  client2.emit(TTTGatewayAction.TTT_BOT_BEST_MOVE, input);
            });
      });

      describe(`${TTTGatewayAction.TTT_LEAVE}`, () => {
            let client1: SocketIOClient.Socket;
            let client2: SocketIOClient.Socket;

            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  user2 = await generateFakeUser();
                  tttBoard = await ticTacToeCommonService.createNewGame(user1, false);
                  tttBoard.info.users = [user2, user1];
                  tttBoard.users[0].ready = true;
                  tttBoard.users[1].ready = true;
                  tttBoard.users[0].id = '123456';
                  await ticTacToeCommonService.setBoard(tttBoard.id, tttBoard);

                  tttBoard = await ticTacToeCommonService.getBoard(tttBoard.id);

                  const socketToken1 = await authService.getSocketToken(user1);
                  client1 = await getIoClient(port, 'tic-tac-toe', socketToken1);

                  const socketToken2 = await authService.getSocketToken(user2);
                  client2 = await getIoClient(port, 'tic-tac-toe', socketToken2);

                  await client1.connect();
                  await client2.connect();
            });

            afterEach(async () => {
                  client1.disconnect();
                  client2.disconnect();
            });

            it('Pass', async (done) => {
                  const input: RoomIdDTO = {
                        roomId: tttBoard.id,
                  };

                  client1.on(TTTGatewayAction.TTT_LEAVE, async (data: SocketServerResponse<null>) => {
                        const getBoard = await ticTacToeCommonService.getBoard(tttBoard.id);

                        expect(getBoard.info.users.length).toBe(1);
                        expect(getBoard.users[0].ready).toBeFalsy();
                        expect(getBoard.users[0].id).toBeNull();
                        expect(getBoard.users[1].ready).toBeFalsy();
                        expect(getBoard.users[1].id).toBeNull();
                        expect(data.data).toBeDefined();
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client1.emit(TTTGatewayAction.TTT_LEAVE, input);
            });
            it('Pass', async (done) => {
                  await ticTacToeService.leaveGame(tttBoard, user2);
                  const input: RoomIdDTO = {
                        roomId: tttBoard.id,
                  };

                  client1.on(TTTGatewayAction.TTT_LEAVE, async (data: SocketServerResponse<null>) => {
                        const getBoard = await ticTacToeCommonService.getBoard(tttBoard.id);
                        expect(getBoard).toBeNull();
                        expect(data.data).toBeDefined();
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client1.emit(TTTGatewayAction.TTT_LEAVE, input);
            });
      });

      describe(`${TTTGatewayAction.TTT_START}`, () => {
            let client1: SocketIOClient.Socket;
            let client2: SocketIOClient.Socket;

            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  user2 = await generateFakeUser();
                  tttBoard = await ticTacToeCommonService.createNewGame(user1, false);
                  tttBoard.info.users = [user2, user1];
                  tttBoard.users[0].ready = true;
                  tttBoard.users[1].ready = true;
                  tttBoard.users[0].id = '123456';
                  await ticTacToeCommonService.setBoard(tttBoard.id, tttBoard);

                  tttBoard = await ticTacToeCommonService.getBoard(tttBoard.id);

                  const socketToken1 = await authService.getSocketToken(user1);
                  client1 = await getIoClient(port, 'tic-tac-toe', socketToken1);

                  const socketToken2 = await authService.getSocketToken(user2);
                  client2 = await getIoClient(port, 'tic-tac-toe', socketToken2);

                  await client1.connect();
                  await client2.connect();
            });

            afterEach(async () => {
                  client1.disconnect();
                  client2.disconnect();
            });

            it('Pass', async (done) => {
                  const input: RoomIdDTO = {
                        roomId: tttBoard.id,
                  };

                  client1.on(TTTGatewayAction.TTT_START, async (data: SocketServerResponse<null>) => {
                        expect(data.data).toBeDefined();
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client1.emit(TTTGatewayAction.TTT_START, input);
            });
            it('Failed only one', async (done) => {
                  await ticTacToeService.leaveGame(tttBoard, user2);
                  const input: RoomIdDTO = {
                        roomId: tttBoard.id,
                  };

                  client1.on('exception', async (data: SocketServerResponse<null>) => {
                        expect(data.statusCode).toBe(400);
                        done();
                  });

                  client1.emit(TTTGatewayAction.TTT_START, input);
            });
      });

      describe(`${TTTGatewayAction.TTT_ADD_MOVE}`, () => {
            let client1: SocketIOClient.Socket;
            let client2: SocketIOClient.Socket;

            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  user2 = await generateFakeUser();
                  tttBoard = await ticTacToeCommonService.createNewGame(user1, true);

                  tttBoard.currentTurn = false;
                  tttBoard.info.users = [user1, user2];
                  ticTacToeService.loadUser(tttBoard);
                  tttBoard = await ticTacToeCommonService.getBoard(tttBoard.id);
                  tttBoard.users[0].ready = true;
                  tttBoard.users[1].ready = true;
                  await ticTacToeCommonService.setBoard(tttBoard.id, tttBoard);
                  await ticTacToeService.startGame(tttBoard);

                  const socketToken1 = await authService.getSocketToken(user1);
                  client1 = await getIoClient(port, 'tic-tac-toe', socketToken1);

                  const socketToken2 = await authService.getSocketToken(user2);
                  client2 = await getIoClient(port, 'tic-tac-toe', socketToken2);

                  await client1.connect();
                  await client2.connect();
            });

            afterEach(async () => {
                  client1.disconnect();
                  client2.disconnect();
            });

            it('Pass user1', async (done) => {
                  tttBoard.currentTurn = true;
                  await ticTacToeCommonService.setBoard(tttBoard.id, tttBoard);
                  const input: AddMoveDto = {
                        roomId: tttBoard.id,
                        x: 1,
                        y: 1,
                  };

                  client1.on(TTTGatewayAction.TTT_ADD_MOVE, async (data: SocketServerResponse<null>) => {
                        const getBoard = await ticTacToeCommonService.getBoard(tttBoard.id);

                        expect(getBoard.board[1][1]).toBe(0);
                        expect(getBoard.currentTurn).toBeFalsy();
                        expect(data.data).toBeDefined();
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client1.emit(TTTGatewayAction.TTT_ADD_MOVE, input);
            });

            it('Pass user2', async (done) => {
                  tttBoard.currentTurn = false;
                  await ticTacToeCommonService.setBoard(tttBoard.id, tttBoard);
                  const input: AddMoveDto = {
                        roomId: tttBoard.id,
                        x: 1,
                        y: 1,
                  };
                  client2.on('exception', async (data: SocketServerResponse<null>) => {
                        expect(data.statusCode).toBe(400);
                        done();
                  });

                  client2.on(TTTGatewayAction.TTT_ADD_MOVE, async (data: SocketServerResponse<null>) => {
                        const getBoard = await ticTacToeCommonService.getBoard(tttBoard.id);

                        expect(getBoard.board[1][1]).toBe(1);
                        expect(getBoard.currentTurn).toBeTruthy();
                        expect(data.data).toBeDefined();
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client2.emit(TTTGatewayAction.TTT_ADD_MOVE, input);
            });

            it('Pass user1 add move and win', async (done) => {
                  tttBoard.currentTurn = true;
                  tttBoard.board[1][1] = 0;
                  tttBoard.board[2][2] = 0;
                  tttBoard.board[3][3] = 0;
                  tttBoard.board[4][4] = 0;
                  await ticTacToeCommonService.setBoard(tttBoard.id, tttBoard);
                  const input: AddMoveDto = {
                        roomId: tttBoard.id,
                        x: 0,
                        y: 0,
                  };

                  client2.on(TTTGatewayAction.TTT_WIN, async (data: SocketServerResponse<null>) => {
                        const getBoard = await ticTacToeCommonService.getBoard(tttBoard.id);
                        expect(getBoard.board[1][1]).toBe(0);
                        expect(getBoard.currentTurn).toBeFalsy();
                        expect(getBoard.info.winner).toBe(0);
                        expect(getBoard.info.status).toBe(TicTacToeStatus.END);
                        expect(data.data).toBeDefined();
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client1.on(TTTGatewayAction.TTT_ADD_MOVE, async (data: SocketServerResponse<null>) => {
                        const getBoard = await ticTacToeCommonService.getBoard(tttBoard.id);

                        expect(getBoard.board[1][1]).toBe(0);
                        expect(getBoard.currentTurn).toBeFalsy();
                        expect(getBoard.info.winner).toBe(0);
                        expect(getBoard.info.status).toBe(TicTacToeStatus.END);
                        expect(data.data).toBeDefined();
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client1.emit(TTTGatewayAction.TTT_ADD_MOVE, input);
            });

            it('Failed wrong turn', async (done) => {
                  tttBoard.currentTurn = false;
                  await ticTacToeCommonService.setBoard(tttBoard.id, tttBoard);
                  const input: AddMoveDto = {
                        roomId: tttBoard.id,
                        x: 1,
                        y: 1,
                  };

                  client1.on('exception', async (data: SocketServerResponse<null>) => {
                        expect(data.statusCode).toBe(400);
                        done();
                  });

                  client1.emit(TTTGatewayAction.TTT_ADD_MOVE, input);
            });
            it('Failed cell is picked', async (done) => {
                  tttBoard.board[1][1] = 1;
                  await ticTacToeCommonService.setBoard(tttBoard.id, tttBoard);
                  const input: AddMoveDto = {
                        roomId: tttBoard.id,
                        x: 1,
                        y: 1,
                  };

                  client1.on('exception', async (data: SocketServerResponse<null>) => {
                        expect(data.statusCode).toBe(400);
                        done();
                  });

                  client1.emit(TTTGatewayAction.TTT_ADD_MOVE, input);
            });
      });

      describe(`${TTTGatewayAction.TTT_SURRENDER}`, () => {
            let client1: SocketIOClient.Socket;
            let client2: SocketIOClient.Socket;

            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  user2 = await generateFakeUser();
                  tttBoard = await ticTacToeCommonService.createNewGame(user1, true);

                  tttBoard.currentTurn = false;
                  tttBoard.info.users = [user1, user2];
                  ticTacToeService.loadUser(tttBoard);
                  tttBoard = await ticTacToeCommonService.getBoard(tttBoard.id);
                  tttBoard.users[0].ready = true;
                  tttBoard.users[1].ready = true;
                  await ticTacToeCommonService.setBoard(tttBoard.id, tttBoard);
                  await ticTacToeService.startGame(tttBoard);

                  const socketToken1 = await authService.getSocketToken(user1);
                  client1 = await getIoClient(port, 'tic-tac-toe', socketToken1);

                  const socketToken2 = await authService.getSocketToken(user2);
                  client2 = await getIoClient(port, 'tic-tac-toe', socketToken2);

                  await client1.connect();
                  await client2.connect();
            });

            afterEach(async () => {
                  client1.disconnect();
                  client2.disconnect();
            });

            it('Pass user1 surrender', async (done) => {
                  tttBoard.currentTurn = true;
                  await ticTacToeCommonService.setBoard(tttBoard.id, tttBoard);
                  const input: RoomIdDTO = {
                        roomId: tttBoard.id,
                  };

                  client1.on(TTTGatewayAction.TTT_SURRENDER, async (data: SocketServerResponse<null>) => {
                        const getBoard = await ticTacToeCommonService.getBoard(tttBoard.id);

                        expect(getBoard.info.winner).toBe(1);
                        expect(getBoard.info.status).toBe(TicTacToeStatus.END);
                        expect(data.data).toBeDefined();
                        done();
                  });

                  client1.emit(TTTGatewayAction.TTT_SURRENDER, input);
            });

            it('Pass user2 surrender', async (done) => {
                  tttBoard.currentTurn = true;
                  await ticTacToeCommonService.setBoard(tttBoard.id, tttBoard);
                  const input: RoomIdDTO = {
                        roomId: tttBoard.id,
                  };

                  client2.on(TTTGatewayAction.TTT_SURRENDER, async (data: SocketServerResponse<null>) => {
                        const getBoard = await ticTacToeCommonService.getBoard(tttBoard.id);

                        expect(getBoard.info.winner).toBe(0);
                        expect(getBoard.info.status).toBe(TicTacToeStatus.END);
                        expect(data.data).toBeDefined();
                        done();
                  });

                  client2.emit(TTTGatewayAction.TTT_SURRENDER, input);
            });
      });

      describe(`${TTTGatewayAction.TTT_CREATE}`, () => {
            let client1: SocketIOClient.Socket;
            let client2: SocketIOClient.Socket;

            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  user2 = await generateFakeUser();
                  tttBoard = await ticTacToeCommonService.createNewGame(user1, true);

                  tttBoard.currentTurn = false;
                  tttBoard.info.users = [user1, user2];
                  ticTacToeService.loadUser(tttBoard);
                  tttBoard = await ticTacToeCommonService.getBoard(tttBoard.id);
                  tttBoard.users[0].ready = true;
                  tttBoard.users[1].ready = true;
                  await ticTacToeCommonService.setBoard(tttBoard.id, tttBoard);
                  await ticTacToeService.startGame(tttBoard);

                  const socketToken1 = await authService.getSocketToken(user1);
                  client1 = await getIoClient(port, 'tic-tac-toe', socketToken1);

                  const socketToken2 = await authService.getSocketToken(user2);
                  client2 = await getIoClient(port, 'tic-tac-toe', socketToken2);

                  await client1.connect();
                  await client2.connect();
            });

            afterEach(async () => {
                  client1.disconnect();
                  client2.disconnect();
            });

            it('Pass user1 create new game', async (done) => {
                  tttBoard.info.status = TicTacToeStatus.END;
                  await ticTacToeCommonService.setBoard(tttBoard.id, tttBoard);
                  const input: RoomIdDTO = {
                        roomId: tttBoard.id,
                  };

                  client1.on(TTTGatewayAction.TTT_CREATE, async (data: SocketServerResponse<RoomIdDTO>) => {
                        expect(data.data.roomId).toBeDefined();
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client1.emit(TTTGatewayAction.TTT_CREATE, input);
            });

            it('Pass user2 create new game', async (done) => {
                  tttBoard.info.status = TicTacToeStatus.END;
                  await ticTacToeCommonService.setBoard(tttBoard.id, tttBoard);
                  const input: RoomIdDTO = {
                        roomId: tttBoard.id,
                  };

                  client2.on(TTTGatewayAction.TTT_CREATE, async (data: SocketServerResponse<RoomIdDTO>) => {
                        expect(data.data.roomId).toBeDefined();
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client2.emit(TTTGatewayAction.TTT_CREATE, input);
            });
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
