import { INestApplication } from '@nestjs/common';

//---- Helper
import { fakeData, getIoClient } from '../../test/test.helper';
import { initTestModule } from '../../test/initTest';

//---- Entity

import { User } from '../../users/entities/user.entity';
import { fakeUser } from '../../test/fakeEntity';
import { TicTacToe } from '../entity/ticTacToe.entity';
//---- Repository
import { TicTacToeRepository } from '../entity/ticTacToe.repository';
import { UserRepository } from '../../users/entities/user.repository';

import { AuthService } from '../../auth/auth.service';
import { TicTacToeStatus } from '../entity/ticTacToe.interface';
import { TicTacToeGateway } from '../ticTacToe.gateway';
//---- Common
import { TTTAction } from '../ticTacToe.action';
import { SocketServerResponse } from '../../app/interface/socketResponse';
import { RoomIdDTO } from '../dto/roomIdDto';
import { TicTacToeService } from '../ticTacToe.service';
import { RedisService } from '../../providers/redis/redis.service';
import { TicTacToeBoard } from '../entity/ticTacToeBoard.entity';
import { TicTacToeCommonService } from '../ticTacToeCommon.service';
import { AddMoveDto } from '../dto/addMoveDto';
import { TicTacToeBotGateway } from '../ticTacToeBot.gateway';
import { TTTBotAction } from '../ticTacToeBot.action';

describe('TicTacToeBotGateway ', () => {
      let app: INestApplication;
      const port = 3212;
      let authService: AuthService;
      let ticTacToeRepository: TicTacToeRepository;
      let userRepository: UserRepository;
      let resetDB: any;
      let ticTacToeBotGateWay: TicTacToeBotGateway;
      let createFakeUser: () => Promise<User>;
      let ticTacToeService: TicTacToeService;
      let ticTacToeCommonService: TicTacToeCommonService;
      let redisService: RedisService;
      beforeAll(async () => {
            const { configModule, resetDatabase, getFakeUser } = await initTestModule();
            app = configModule;
            createFakeUser = getFakeUser;
            resetDB = resetDatabase;
            await app.listen(port);
            ticTacToeRepository = app.get<TicTacToeRepository>(TicTacToeRepository);
            userRepository = app.get<UserRepository>(UserRepository);
            redisService = app.get<RedisService>(RedisService);
            authService = app.get<AuthService>(AuthService);
            ticTacToeBotGateWay = app.get<TicTacToeBotGateway>(TicTacToeBotGateway);
            ticTacToeService = app.get<TicTacToeService>(TicTacToeService);
            ticTacToeCommonService = app.get<TicTacToeCommonService>(TicTacToeCommonService);

            jest.spyOn(ticTacToeBotGateWay.server, 'to').mockImplementation().mockReturnThis();
      });

      describe(`${TTTBotAction.TTT_BOT_GET}`, () => {
            let client: SocketIOClient.Socket;
            let client2: SocketIOClient.Socket;
            let user2: User;
            let ttt: TicTacToe;
            beforeEach(async () => {
                  user2 = await createFakeUser();
                  const ticTacToe = new TicTacToe();
                  ticTacToe.id = fakeData(10);
                  ticTacToe.users = [user2];
                  const board = new TicTacToeBoard(ticTacToe);
                  board.users[0].id = user2.id;
                  await ticTacToeCommonService.setBoard(ticTacToe.id, board);
                  ttt = ticTacToe;
                  const socketToken = await authService.getSocketToken(user2);
                  client = await getIoClient(port, 'tic-tac-toe-bot', socketToken);
                  await client.connect();

                  const user3 = await createFakeUser();
                  const socketToken3 = await authService.getSocketToken(user3);
                  client2 = await getIoClient(port, 'tic-tac-toe-bot', socketToken3);
                  await client2.connect();
            });

            afterEach(async () => {
                  client.disconnect();
                  client2.disconnect();
            });

            it('Pass ', async (done) => {
                  client.on(TTTBotAction.TTT_BOT_GET, (data: SocketServerResponse<TicTacToeBoard>) => {
                        expect(data.data.info.users[0].id).toBeDefined();
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client.emit(TTTBotAction.TTT_BOT_GET, { roomId: ttt.id });
            });
            it('Failed user is not belong to room', async (done) => {
                  client2.on('exception', (data: SocketServerResponse<null>) => {
                        expect(data).toBeDefined();
                        expect(data.details).toBeDefined();
                        expect(data.statusCode).toBe(401);
                        done();
                  });

                  client2.emit(TTTBotAction.TTT_BOT_GET, { roomId: ttt.id });
            });

            it('Failed roomId was not found', async (done) => {
                  client.on('exception', (data: SocketServerResponse<null>) => {
                        expect(data).toBeDefined();
                        expect(data.details).toBeDefined();
                        expect(data.statusCode).toBe(404);
                        done();
                  });

                  client.emit(TTTBotAction.TTT_BOT_GET, { roomId: 'hello-world' });
            });
      });

      describe(`${TTTBotAction.TTT_BOT_START}`, () => {
            let client: SocketIOClient.Socket;
            let client2: SocketIOClient.Socket;
            let user2: User;
            let ttt: TicTacToe;
            beforeEach(async () => {
                  user2 = await createFakeUser();
                  const ticTacToe = new TicTacToe();
                  ticTacToe.id = fakeData(10);
                  ticTacToe.users = [user2];
                  const board = new TicTacToeBoard(ticTacToe);
                  board.users[0].id = user2.id;
                  board.users[0].ready = true;
                  board.users[1].ready = true;
                  await ticTacToeCommonService.setBoard(ticTacToe.id, board);
                  ttt = ticTacToe;

                  const socketToken = await authService.getSocketToken(user2);
                  client = await getIoClient(port, 'tic-tac-toe-bot', socketToken);
                  await client.connect();

                  const user3 = await createFakeUser();
                  const socketToken3 = await authService.getSocketToken(user3);
                  client2 = await getIoClient(port, 'tic-tac-toe-bot', socketToken3);
                  await client2.connect();
            });

            afterEach(async () => {
                  client.disconnect();
                  client2.disconnect();
            });

            it('Pass ', (done) => {
                  client.on(TTTBotAction.TTT_BOT_START, async (data: SocketServerResponse<TicTacToeBoard>) => {
                        const getBoard = await ticTacToeCommonService.getBoard(ttt.id);

                        expect(getBoard.info.status).toBe(TicTacToeStatus.PLAYING);
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client.emit(TTTBotAction.TTT_BOT_START, { roomId: ttt.id });
            });

            it('Failed user not ready yet ', async (done) => {
                  const beforeUpdate = await ticTacToeCommonService.getBoard(ttt.id);
                  beforeUpdate.users[0].ready = false;
                  await ticTacToeCommonService.setBoard(ttt.id, beforeUpdate);

                  client.on('exception', async (data: SocketServerResponse<null>) => {
                        expect(data.statusCode).toBe(400);
                        done();
                  });

                  client.emit(TTTBotAction.TTT_BOT_START, { roomId: ttt.id });
            });
      });

      describe(`${TTTBotAction.TTT_BOT_MOVE}`, () => {
            let client: SocketIOClient.Socket;

            let user2: User;
            let ttt: TicTacToe;
            beforeEach(async () => {
                  user2 = await createFakeUser();
                  const ticTacToe = new TicTacToe();
                  ticTacToe.id = fakeData(10);
                  ticTacToe.users = [user2];
                  const board = new TicTacToeBoard(ticTacToe);
                  board.users[0].id = user2.id;
                  board.users[0].ready = true;
                  board.users[1].ready = true;
                  board.currentTurn = true;
                  await ticTacToeCommonService.setBoard(ticTacToe.id, board);
                  await ticTacToeService.startGame(ticTacToe.id, user2);

                  ttt = ticTacToe;

                  const socketToken = await authService.getSocketToken(user2);
                  client = await getIoClient(port, 'tic-tac-toe-bot', socketToken);
                  await client.connect();
            });

            afterEach(async () => {
                  client.disconnect();
            });

            it('Pass', (done) => {
                  const input: AddMoveDto = {
                        roomId: ttt.id,
                        x: 1,
                        y: 1,
                  };

                  client.on(TTTBotAction.TTT_BOT_MOVE, async (data: SocketServerResponse<TicTacToeBoard>) => {
                        const getBoard = await ticTacToeCommonService.getBoard(ttt.id);
                        let counter = 0;
                        for (let i = 0; i < getBoard.board.length; i++)
                              for (let j = 0; j < getBoard.board.length; j++) {
                                    if (getBoard.board[i][j] === 1) ++counter;
                              }

                        expect(counter).toBe(1);
                        expect(getBoard.board[1][1]).toBe(0);
                        expect(getBoard.info.status).toBe(TicTacToeStatus.PLAYING);
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client.emit(TTTBotAction.TTT_BOT_MOVE, input);
            });

            it('Pass bot win', async (done) => {
                  const beforeUpdate = await ticTacToeCommonService.getBoard(ttt.id);
                  beforeUpdate.board[0][0] = 1;
                  beforeUpdate.board[0][1] = 1;
                  beforeUpdate.board[0][4] = 1;
                  beforeUpdate.board[0][2] = 1;
                  await ticTacToeCommonService.setBoard(ttt.id, beforeUpdate);

                  const input: AddMoveDto = {
                        roomId: ttt.id,
                        x: 3,
                        y: 7,
                  };

                  client.on(TTTBotAction.TTT_BOT_MOVE, async (data: SocketServerResponse<TicTacToeBoard>) => {
                        const getBoard = await ticTacToeCommonService.getBoard(ttt.id);

                        expect(getBoard.info.winner).toBe(1);
                        expect(getBoard.board[0][3]).toBe(1);
                        expect(getBoard.info.status).toBe(TicTacToeStatus.END);
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client.emit(TTTBotAction.TTT_BOT_MOVE, input);
            });

            it('Pass bot defend', async (done) => {
                  const beforeUpdate = await ticTacToeCommonService.getBoard(ttt.id);
                  beforeUpdate.board[0][1] = 0;
                  beforeUpdate.board[0][4] = 0;
                  beforeUpdate.board[0][2] = 0;
                  await ticTacToeCommonService.setBoard(ttt.id, beforeUpdate);

                  const input: AddMoveDto = {
                        roomId: ttt.id,
                        x: 0,
                        y: 0,
                  };

                  client.on(TTTBotAction.TTT_BOT_MOVE, async (data: SocketServerResponse<TicTacToeBoard>) => {
                        const getBoard = await ticTacToeCommonService.getBoard(ttt.id);

                        expect(getBoard.board[0][3]).toBe(1);
                        expect(getBoard.info.status).toBe(TicTacToeStatus.PLAYING);
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client.emit(TTTBotAction.TTT_BOT_MOVE, input);
            });

            it('Pass bot defend', async (done) => {
                  const beforeUpdate = await ticTacToeCommonService.getBoard(ttt.id);
                  beforeUpdate.board[0][0] = 1;

                  await ticTacToeCommonService.setBoard(ttt.id, beforeUpdate);

                  const input: AddMoveDto = {
                        roomId: ttt.id,
                        x: 0,
                        y: 0,
                  };

                  client.on('exception', async (data: SocketServerResponse<null>) => {
                        const afterUpdate = await ticTacToeCommonService.getBoard(ttt.id);

                        expect(afterUpdate.board[0][0]).toBe(1);
                        expect(data.statusCode).toBe(400);
                        done();
                  });

                  client.emit(TTTBotAction.TTT_BOT_MOVE, input);
            });
            it('Pass wrong turn', async (done) => {
                  const beforeUpdate = await ticTacToeCommonService.getBoard(ttt.id);
                  beforeUpdate.currentTurn = false;

                  await ticTacToeCommonService.setBoard(ttt.id, beforeUpdate);

                  const input: AddMoveDto = {
                        roomId: ttt.id,
                        x: 0,
                        y: 0,
                  };

                  client.on('exception', async (data: SocketServerResponse<null>) => {
                        const afterUpdate = await ticTacToeCommonService.getBoard(ttt.id);

                        expect(afterUpdate.board[0][0]).toBe(-1);
                        expect(data.statusCode).toBe(400);
                        done();
                  });

                  client.emit(TTTBotAction.TTT_BOT_MOVE, input);
            });

            it('Failed user not ready yet ', async (done) => {
                  const beforeUpdate = await ticTacToeCommonService.getBoard(ttt.id);
                  beforeUpdate.users[0].ready = false;
                  await ticTacToeCommonService.setBoard(ttt.id, beforeUpdate);

                  client.on('exception', async (data: SocketServerResponse<null>) => {
                        expect(data.statusCode).toBe(400);
                        done();
                  });

                  client.emit(TTTBotAction.TTT_BOT_START, { roomId: ttt.id });
            });
      });

      describe(`${TTTBotAction.TTT_BOT_LEAVE}`, () => {
            let client: SocketIOClient.Socket;
            let client2: SocketIOClient.Socket;
            let user2: User;
            let ttt: TicTacToe;
            beforeEach(async () => {
                  user2 = await createFakeUser();
                  const ticTacToe = new TicTacToe();
                  ticTacToe.id = fakeData(10);
                  ticTacToe.users = [user2];
                  const board = new TicTacToeBoard(ticTacToe);
                  board.users[0].id = user2.id;
                  await ticTacToeCommonService.setBoard(ticTacToe.id, board);
                  ttt = ticTacToe;
                  const socketToken = await authService.getSocketToken(user2);
                  client = await getIoClient(port, 'tic-tac-toe-bot', socketToken);
                  await client.connect();

                  const user3 = await createFakeUser();
                  const socketToken3 = await authService.getSocketToken(user3);
                  client2 = await getIoClient(port, 'tic-tac-toe-bot', socketToken3);
                  await client2.connect();
            });

            afterEach(async () => {
                  client.disconnect();
                  client2.disconnect();
            });

            it('Pass ', async (done) => {
                  client.on(TTTBotAction.TTT_BOT_LEAVE, async (data: SocketServerResponse<TicTacToeBoard>) => {
                        const getBoard = await ticTacToeCommonService.getBoard(ttt.id);

                        expect(getBoard).toBeNull();
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client.emit(TTTBotAction.TTT_BOT_LEAVE, { roomId: ttt.id });
            });
      });

      describe(`${TTTBotAction.TTT_BOT_CREATE}`, () => {
            let client: SocketIOClient.Socket;

            let user2: User;

            beforeEach(async () => {
                  user2 = await createFakeUser();

                  const socketToken = await authService.getSocketToken(user2);
                  client = await getIoClient(port, 'tic-tac-toe-bot', socketToken);
                  await client.connect();
            });

            afterEach(async () => {
                  client.disconnect();
            });

            it('Pass ', async (done) => {
                  client.on(TTTBotAction.TTT_BOT_CREATE, async (data: SocketServerResponse<RoomIdDTO>) => {
                        const getBoard = await ticTacToeCommonService.getBoard(data.data.roomId);
                        const ttt = await ticTacToeRepository
                              .createQueryBuilder('tic')
                              .leftJoinAndSelect('tic.users', 'user')
                              .where('tic.id = :id', { id: getBoard.info.id })
                              .getOne();
                        expect(ttt).toBeUndefined();
                        expect(getBoard.users[0].id).toBe(user2.id);
                        expect(getBoard.info.users[0].id).toBe(user2.id);
                        expect(getBoard.info.users[1].name).toBe('BOT');
                        expect(getBoard).toBeDefined();
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client.emit(TTTBotAction.TTT_BOT_CREATE, {});
            });

            it('Failed User is Playing', async (done) => {
                  const ticTacToe = new TicTacToe();
                  ticTacToe.users = [user2];
                  ticTacToe.status = TicTacToeStatus.PLAYING;
                  await ticTacToeRepository.save(ticTacToe);

                  client.on('exception', (data: SocketServerResponse<null>) => {
                        expect(data).toBeDefined();
                        expect(data.details).toBeDefined();
                        expect(data.statusCode).toBe(400);
                        done();
                  });

                  client.emit(TTTBotAction.TTT_BOT_CREATE, {});
            });
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
