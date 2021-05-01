import { INestApplication } from '@nestjs/common';

//---- Helper
import { getIoClient } from '../../test/test.helper';
import { initTestModule } from '../../test/initTest';

//---- Entity
import { User } from '../../users/entities/user.entity';
import { fakeUser } from '../../test/fakeEntity';
import { TicTacToe } from '../entity/ticTacToe.entity';
import { TicTacToeBoard } from '../entity/ticTacToeBoard.entity';
import { TicTacToeStatus } from '../entity/ticTacToe.interface';

//---- Repository
import { TicTacToeRepository } from '../entity/ticTacToe.repository';
import { UserRepository } from '../../users/entities/user.repository';

//---- Service
import { TicTacToeService } from '../ticTacToe.service';
import { TicTacToeCommonService } from '../ticTacToeCommon.service';
import { RedisService } from '../../providers/redis/redis.service';
import { AuthService } from '../../auth/auth.service';

//---- Dto
import { RoomIdDTO } from '../dto/roomIdDto';
import { AddMoveDto } from '../dto/addMoveDto';

//---- Gateway
import { TicTacToeGateway } from '../ticTacToe.gateway';

//---- Common
import { TTTAction } from '../ticTacToe.action';
import { SocketServerResponse } from '../../app/interface/socketResponse';

describe('TicTacToeGateway ', () => {
      let app: INestApplication;
      const port = 3021;
      let authService: AuthService;
      let ticTacToeRepository: TicTacToeRepository;
      let userRepository: UserRepository;
      let resetDB: any;
      let ticTacToeGateWay: TicTacToeGateway;
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
            ticTacToeGateWay = app.get<TicTacToeGateway>(TicTacToeGateway);
            ticTacToeService = app.get<TicTacToeService>(TicTacToeService);
            ticTacToeCommonService = app.get<TicTacToeCommonService>(TicTacToeCommonService);

            jest.spyOn(ticTacToeGateWay.server, 'to').mockImplementation().mockReturnThis();
      });

      describe(`${TTTAction.TTT_CONNECT}`, () => {
            let client: SocketIOClient.Socket;

            let user2: User;

            beforeEach(async () => {
                  user2 = await createFakeUser();

                  const socketToken = await authService.getSocketToken(user2);
                  client = await getIoClient(port, 'tic-tac-toe', socketToken);
                  await client.connect();
            });

            afterEach(async () => {
                  client.disconnect();
            });

            it('Pass ', async (done) => {
                  client.on(TTTAction.TTT_CONNECT, (data: SocketServerResponse<null>) => {
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client.emit(TTTAction.TTT_CONNECT, {});
            });
      });

      describe(`${TTTAction.TTT_CREATE}`, () => {
            let client3: SocketIOClient.Socket;
            let user: User;
            beforeEach(async () => {
                  user = await userRepository.save(fakeUser());
                  const socketToken = await authService.getSocketToken(user);
                  client3 = await getIoClient(port, 'tic-tac-toe', socketToken);

                  await client3.connect();
            });

            afterEach(async () => {
                  client3.disconnect();
            });

            it('Pass', async (done) => {
                  client3.on('join-test', () => {
                        done();
                  });
                  client3.on(TTTAction.TTT_CREATE, async (data: SocketServerResponse<RoomIdDTO>) => {
                        const ttt = await ticTacToeRepository
                              .createQueryBuilder('tic')
                              .leftJoinAndSelect('tic.users', 'user')
                              .where('user.id = :userId and status = :status', { userId: user.id, status: TicTacToeStatus['NOT-YET'] })
                              .getOne();

                        const getGameRedis = await ticTacToeCommonService.getBoard(ttt.id);

                        expect(getGameRedis.users[0].id).toBe(user.id);
                        expect(ttt).toBeDefined();
                        expect(data.data.roomId).toBeDefined();
                        expect(data.statusCode).toBe(200);
                        ticTacToeGateWay.server.to(`tic-tac-toe-${ttt.id}`).emit('join-test', {});
                  });

                  client3.emit(TTTAction.TTT_CREATE, {});
            });

            it('Failed User is Playing', async (done) => {
                  const ticTacToe = new TicTacToe();
                  ticTacToe.users = [user];
                  ticTacToe.status = TicTacToeStatus.PLAYING;
                  await ticTacToeRepository.save(ticTacToe);

                  client3.on('exception', (data: SocketServerResponse<null>) => {
                        expect(data).toBeDefined();
                        expect(data.details).toBeDefined();
                        expect(data.statusCode).toBe(400);
                        done();
                  });

                  client3.emit(TTTAction.TTT_CREATE, {});
            });
      });

      describe(`${TTTAction.TTT_JOIN}`, () => {
            let client2: SocketIOClient.Socket;
            let user2: User;
            let user1: User;
            let ttt: TicTacToe;
            beforeEach(async () => {
                  user1 = await createFakeUser();
                  const ticTacToe = new TicTacToe();
                  ticTacToe.users = [user1];
                  ttt = await ticTacToeRepository.save(ticTacToe);

                  await ticTacToeService.loadGameToCache(ttt.id);
                  await ticTacToeService.joinGame(ttt.id, user1);

                  user2 = await createFakeUser();
                  const socketToken = await authService.getSocketToken(user2);
                  client2 = await getIoClient(port, 'tic-tac-toe', socketToken);
                  await client2.connect();
            });

            afterEach(async () => {
                  client2.disconnect();
            });

            it('Pass', (done) => {
                  client2.on(TTTAction.TTT_JOIN, async () => {
                        const getGame = await ticTacToeRepository
                              .createQueryBuilder('tic')
                              .leftJoinAndSelect('tic.users', 'user')
                              .where('tic.id = :id', { id: ttt.id })
                              .getOne();

                        const getGameRedis = await ticTacToeCommonService.getBoard(ttt.id);

                        expect(getGameRedis).toBeDefined();
                        expect(getGameRedis.users.filter((item) => item.id === user2.id)).toHaveLength(1);
                        expect(getGame.users.filter((item) => item.id === user2.id)).toHaveLength(1);
                        done();
                  });
                  client2.emit(TTTAction.TTT_JOIN, { roomId: ttt.id });
            });

            it('Failed Join double time', async (done) => {
                  await ticTacToeService.joinGame(ttt.id, user2);
                  client2.on('exception', (data: SocketServerResponse<null>) => {
                        expect(data).toBeDefined();
                        expect(data.details).toBeDefined();
                        expect(data.statusCode).toBe(400);
                        done();
                  });

                  client2.emit(TTTAction.TTT_JOIN, { roomId: ttt.id });
            });

            it('Failed roomId was not found', async (done) => {
                  client2.on('exception', (data: SocketServerResponse<null>) => {
                        expect(data).toBeDefined();
                        expect(data.details).toBeDefined();
                        expect(data.statusCode).toBe(404);
                        done();
                  });

                  client2.emit(TTTAction.TTT_JOIN, { roomId: 'hello-world' });
            });

            it('Failed user is playing game', async (done) => {
                  ttt.users.push(user2);
                  ttt.status = TicTacToeStatus.PLAYING;
                  await ticTacToeRepository.save(ttt);
                  client2.on('exception', (data: SocketServerResponse<null>) => {
                        expect(data).toBeDefined();
                        expect(data.details).toBeDefined();
                        expect(data.statusCode).toBe(400);
                        done();
                  });

                  client2.emit(TTTAction.TTT_JOIN, { roomId: ttt.id });
            });

            it('Failed room is full', async (done) => {
                  const user3 = await createFakeUser();
                  ttt.users.push(user3);
                  await ticTacToeRepository.save(ttt);
                  await ticTacToeService.loadGameToCache(ttt.id);

                  client2.on('exception', (data: SocketServerResponse<null>) => {
                        expect(data).toBeDefined();
                        expect(data.details).toBeDefined();
                        expect(data.statusCode).toBe(400);
                        done();
                  });

                  client2.emit(TTTAction.TTT_JOIN, { roomId: ttt.id });
            });

            it('Failed game is already start', async (done) => {
                  ttt.status = TicTacToeStatus.PLAYING;
                  const getGame = await ticTacToeRepository.save(ttt);
                  const tTTBoard = new TicTacToeBoard(getGame);
                  redisService.setObjectByKey(`ttt-${getGame.id}`, tTTBoard);

                  client2.on('exception', (data: SocketServerResponse<null>) => {
                        expect(data).toBeDefined();
                        expect(data.details).toBeDefined();
                        expect(data.statusCode).toBe(400);
                        done();
                  });

                  client2.emit(TTTAction.TTT_JOIN, { roomId: ttt.id });
            });
            it('Failed game is not exist in database', async (done) => {
                  await ticTacToeRepository.createQueryBuilder().delete().where(`id = :id`, { id: ttt.id }).execute();

                  client2.on('exception', (data: SocketServerResponse<null>) => {
                        expect(data).toBeDefined();
                        expect(data.details).toBeDefined();
                        expect(data.statusCode).toBe(404);
                        done();
                  });

                  client2.emit(TTTAction.TTT_JOIN, { roomId: ttt.id });
            });

            it('Failed game is already start', async (done) => {
                  ttt.status = TicTacToeStatus.PLAYING;
                  const getGame = await ticTacToeRepository.save(ttt);
                  const tTTBoard = new TicTacToeBoard(getGame);
                  redisService.setObjectByKey(`ttt-${getGame.id}`, tTTBoard);

                  client2.on('exception', (data: SocketServerResponse<null>) => {
                        expect(data).toBeDefined();
                        expect(data.details).toBeDefined();
                        expect(data.statusCode).toBe(400);
                        done();
                  });

                  client2.emit(TTTAction.TTT_JOIN, { roomId: ttt.id });
            });
      });

      describe(`${TTTAction.TTT_GET}`, () => {
            let client: SocketIOClient.Socket;
            let client2: SocketIOClient.Socket;
            let user2: User;
            let ttt: TicTacToe;
            beforeEach(async () => {
                  user2 = await createFakeUser();
                  const ticTacToe = new TicTacToe();
                  ticTacToe.users = [user2];
                  ttt = await ticTacToeRepository.save(ticTacToe);
                  await ticTacToeService.loadGameToCache(ttt.id);

                  const socketToken = await authService.getSocketToken(user2);
                  client = await getIoClient(port, 'tic-tac-toe', socketToken);
                  await client.connect();

                  const user3 = await createFakeUser();
                  const socketToken3 = await authService.getSocketToken(user3);
                  client2 = await getIoClient(port, 'tic-tac-toe', socketToken3);
                  await client2.connect();
            });

            afterEach(async () => {
                  client.disconnect();
                  client2.disconnect();
            });

            it('Pass ', async (done) => {
                  client.on(TTTAction.TTT_GET, (data: SocketServerResponse<TicTacToeBoard>) => {
                        expect(data.data.info.users[0].id).toBeDefined();
                        expect(data.data.info.users[0].password).toBeUndefined();
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client.emit(TTTAction.TTT_GET, { roomId: ttt.id });
            });

            it('Failed roomId was not found', async (done) => {
                  client.on('exception', (data: SocketServerResponse<null>) => {
                        expect(data).toBeDefined();
                        expect(data.details).toBeDefined();
                        expect(data.statusCode).toBe(404);
                        done();
                  });

                  client.emit(TTTAction.TTT_GET, { roomId: 'hello-world' });
            });
      });

      describe(`${TTTAction.TTT_READY}`, () => {
            let client2: SocketIOClient.Socket;
            let client3: SocketIOClient.Socket;
            let user2: User;
            let ttt: TicTacToe;
            beforeEach(async () => {
                  const user1 = await createFakeUser();
                  const ticTacToe = new TicTacToe();
                  ticTacToe.users = [user1];
                  ttt = await ticTacToeRepository.save(ticTacToe);

                  await ticTacToeService.loadGameToCache(ttt.id);
                  await ticTacToeService.joinGame(ttt.id, user1);
                  user2 = await createFakeUser();
                  const socketToken = await authService.getSocketToken(user2);
                  client2 = await getIoClient(port, 'tic-tac-toe', socketToken);
                  await client2.connect();

                  const user3 = await createFakeUser();
                  const socketToken3 = await authService.getSocketToken(user3);
                  client3 = await getIoClient(port, 'tic-tac-toe', socketToken3);
                  await client3.connect();
            });

            afterEach(async () => {
                  client2.disconnect();
                  client3.disconnect();
            });

            it('Pass ', async (done) => {
                  await ticTacToeService.joinGame(ttt.id, user2);

                  client2.on(TTTAction.TTT_READY, async (data: SocketServerResponse<null>) => {
                        const getGame = await ticTacToeRepository
                              .createQueryBuilder('tic')
                              .leftJoinAndSelect('tic.users', 'user')
                              .where('tic.id = :id', { id: ttt.id })
                              .getOne();
                        const getGameRedis = await ticTacToeCommonService.getBoard(ttt.id);

                        expect(getGameRedis.users.filter((item) => item.ready)).toHaveLength(1);
                        expect(getGame.status).toBe(TicTacToeStatus['NOT-YET']);
                        expect(data.statusCode).toBe(200);
                        done();
                  });
                  client2.emit(TTTAction.TTT_READY, { roomId: ttt.id });
            });
            it('Pass turn true to failed ', async (done) => {
                  await ticTacToeService.joinGame(ttt.id, user2);
                  await ticTacToeService.toggleReadyStatePlayer(ttt.id, user2);

                  client2.on(TTTAction.TTT_READY, async (data: SocketServerResponse<null>) => {
                        const getGame = await ticTacToeRepository
                              .createQueryBuilder('tic')
                              .leftJoinAndSelect('tic.users', 'user')
                              .where('tic.id = :id', { id: ttt.id })
                              .getOne();
                        const getGameRedis = await ticTacToeCommonService.getBoard(ttt.id);

                        expect(getGameRedis.users.filter((item) => item.id === user2.id)[0].ready).toBeFalsy();
                        expect(getGame.status).toBe(TicTacToeStatus['NOT-YET']);
                        expect(data.statusCode).toBe(200);
                        done();
                  });
                  client2.emit(TTTAction.TTT_READY, { roomId: ttt.id });
            });
            it('Failed miss one player ', async (done) => {
                  const newTicTacToe = new TicTacToe();
                  const insertTTT = await ticTacToeRepository.save(newTicTacToe);
                  await ticTacToeService.loadGameToCache(insertTTT.id);
                  await ticTacToeService.joinGame(insertTTT.id, user2);

                  client2.on('exception', async (data: SocketServerResponse<null>) => {
                        expect(data.statusCode).toBe(400);
                        done();
                  });

                  client2.emit(TTTAction.TTT_READY, { roomId: insertTTT.id });
            });

            it('Failed roomId was not found', async (done) => {
                  client2.on('exception', (data: SocketServerResponse<null>) => {
                        expect(data).toBeDefined();
                        expect(data.details).toBeDefined();
                        expect(data.statusCode).toBe(404);
                        done();
                  });

                  client2.emit(TTTAction.TTT_READY, { roomId: 'hello-world' });
            });

            it('Failed user is not owner', async (done) => {
                  client3.on('exception', (data: SocketServerResponse<null>) => {
                        expect(data).toBeDefined();
                        expect(data.details).toBeDefined();
                        expect(data.statusCode).toBe(401);
                        done();
                  });

                  client3.emit(TTTAction.TTT_READY, { roomId: ttt.id });
            });
      });

      describe(`${TTTAction.TTT_START}`, () => {
            let client2: SocketIOClient.Socket;
            let client3: SocketIOClient.Socket;
            let user2: User;
            let user1: User;
            let ttt: TicTacToe;
            beforeEach(async () => {
                  user1 = await createFakeUser();
                  const ticTacToe = new TicTacToe();
                  ticTacToe.users = [user1];
                  ttt = await ticTacToeRepository.save(ticTacToe);

                  await ticTacToeService.loadGameToCache(ttt.id);
                  await ticTacToeService.joinGame(ttt.id, user1);
                  user2 = await createFakeUser();
                  const socketToken = await authService.getSocketToken(user2);
                  client2 = await getIoClient(port, 'tic-tac-toe', socketToken);
                  await client2.connect();

                  const user3 = await createFakeUser();
                  const socketToken3 = await authService.getSocketToken(user3);
                  client3 = await getIoClient(port, 'tic-tac-toe', socketToken3);
                  await client3.connect();
            });

            afterEach(async () => {
                  client2.disconnect();
                  client3.disconnect();
            });

            it('Pass ', async (done) => {
                  await ticTacToeService.joinGame(ttt.id, user2);
                  await ticTacToeService.toggleReadyStatePlayer(ttt.id, user1);
                  await ticTacToeService.toggleReadyStatePlayer(ttt.id, user2);
                  client2.on(TTTAction.TTT_START, (data: SocketServerResponse<null>) => {
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client2.emit(TTTAction.TTT_START, { roomId: ttt.id });
            });
            it('Failed have to wait for more player ', async (done) => {
                  await ticTacToeService.joinGame(ttt.id, user2);
                  await ticTacToeService.toggleReadyStatePlayer(ttt.id, user2);
                  client2.on('exception', (data: SocketServerResponse<null>) => {
                        expect(data).toBeDefined();
                        expect(data.details).toBeDefined();
                        expect(data.statusCode).toBe(400);
                        done();
                  });

                  client2.emit(TTTAction.TTT_START, { roomId: ttt.id });
            });

            it('Failed roomId was not found', async (done) => {
                  client2.on('exception', (data: SocketServerResponse<null>) => {
                        expect(data).toBeDefined();
                        expect(data.details).toBeDefined();
                        expect(data.statusCode).toBe(404);
                        done();
                  });

                  client2.emit(TTTAction.TTT_START, { roomId: 'hello-world' });
            });
            it('Failed user is not owner', async (done) => {
                  client3.on('exception', (data: SocketServerResponse<null>) => {
                        expect(data).toBeDefined();
                        expect(data.details).toBeDefined();
                        expect(data.statusCode).toBe(401);
                        done();
                  });

                  client3.emit(TTTAction.TTT_START, { roomId: ttt.id });
            });
      });
      describe(`${TTTAction.TTT_SURRENDER}`, () => {
            let client2: SocketIOClient.Socket;
            let client3: SocketIOClient.Socket;
            let user2: User;
            let user1: User;
            let ttt: TicTacToe;
            beforeEach(async () => {
                  user1 = await createFakeUser();
                  user2 = await createFakeUser();
                  const ticTacToe = new TicTacToe();
                  ticTacToe.users = [user1, user2];
                  ttt = await ticTacToeRepository.save(ticTacToe);
                  await ticTacToeService.loadGameToCache(ttt.id);
                  await ticTacToeService.joinGame(ttt.id, user1);
                  await ticTacToeService.joinGame(ttt.id, user2);
                  await ticTacToeService.toggleReadyStatePlayer(ttt.id, user1);
                  await ticTacToeService.toggleReadyStatePlayer(ttt.id, user2);
                  await ticTacToeService.startGame(ttt.id, user2);

                  const socketToken = await authService.getSocketToken(user2);
                  client2 = await getIoClient(port, 'tic-tac-toe', socketToken);
                  await client2.connect();

                  const user3 = await createFakeUser();
                  const socketToken3 = await authService.getSocketToken(user3);
                  client3 = await getIoClient(port, 'tic-tac-toe', socketToken3);
                  await client3.connect();
            });

            afterEach(async () => {
                  client2.disconnect();
                  client3.disconnect();
            });

            it('Pass ', async (done) => {
                  client2.on(TTTAction.TTT_SURRENDER, async (data: SocketServerResponse<null>) => {
                        const getGameRedis = await ticTacToeCommonService.getBoard(ttt.id);
                        expect(getGameRedis.info.winner).not.toBe(getGameRedis.users[1].flag);
                        expect(getGameRedis.info.status).toBe(TicTacToeStatus.END);
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client2.emit(TTTAction.TTT_SURRENDER, { roomId: ttt.id });
            });

            it('Failed roomId was not found', async (done) => {
                  client2.on('exception', (data: SocketServerResponse<null>) => {
                        expect(data).toBeDefined();
                        expect(data.details).toBeDefined();
                        expect(data.statusCode).toBe(404);
                        done();
                  });

                  client2.emit(TTTAction.TTT_SURRENDER, { roomId: 'hello-world' });
            });
            it('Failed user is not owner', async (done) => {
                  client3.on('exception', (data: SocketServerResponse<null>) => {
                        expect(data).toBeDefined();
                        expect(data.details).toBeDefined();
                        expect(data.statusCode).toBe(401);
                        done();
                  });

                  client3.emit(TTTAction.TTT_SURRENDER, { roomId: ttt.id });
            });
      });

      describe(`${TTTAction.TTT_LEAVE}`, () => {
            let client2: SocketIOClient.Socket;
            let client3: SocketIOClient.Socket;
            let user2: User;
            let user1: User;
            let ttt: TicTacToe;
            beforeEach(async () => {
                  user1 = await createFakeUser();
                  user2 = await createFakeUser();
                  const ticTacToe = new TicTacToe();
                  ticTacToe.users = [user1];
                  ttt = await ticTacToeRepository.save(ticTacToe);

                  await ticTacToeService.loadGameToCache(ttt.id);
                  await ticTacToeService.joinGame(ttt.id, user1);
                  await ticTacToeService.joinGame(ttt.id, user2);
                  await ticTacToeService.toggleReadyStatePlayer(ttt.id, user1);
                  await ticTacToeService.toggleReadyStatePlayer(ttt.id, user2);

                  const socketToken = await authService.getSocketToken(user2);
                  client2 = await getIoClient(port, 'tic-tac-toe', socketToken);
                  await client2.connect();

                  const user3 = await createFakeUser();
                  const socketToken3 = await authService.getSocketToken(user3);
                  client3 = await getIoClient(port, 'tic-tac-toe', socketToken3);
                  await client3.connect();
            });

            afterEach(async () => {
                  client2.disconnect();
                  client3.disconnect();
            });

            it('Pass ', async (done) => {
                  client2.on(TTTAction.TTT_LEAVE, async (data: SocketServerResponse<null>) => {
                        const getGameRedis = await ticTacToeCommonService.getBoard(ttt.id);

                        expect(getGameRedis.users.filter((item) => !item.ready)).toHaveLength(2);
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client2.emit(TTTAction.TTT_LEAVE, { roomId: ttt.id });
            });

            it('Pass ', async (done) => {
                  await ticTacToeService.leaveGame(ttt.id, user1);
                  client2.on(TTTAction.TTT_LEAVE, async (data: SocketServerResponse<null>) => {
                        const getGameRedis = await ticTacToeCommonService.getBoard(ttt.id);
                        const getTTT = await ticTacToeRepository.getOneTTTByFiled('tic.id = :id', { id: ttt.id });
                        expect(getTTT).toBeUndefined();
                        expect(getGameRedis).toBeNull();
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client2.emit(TTTAction.TTT_LEAVE, { roomId: ttt.id });
            });

            it('Failed roomId was not found', async (done) => {
                  client2.on('exception', (data: SocketServerResponse<null>) => {
                        expect(data).toBeDefined();
                        expect(data.details).toBeDefined();
                        expect(data.statusCode).toBe(404);
                        done();
                  });

                  client2.emit(TTTAction.TTT_LEAVE, { roomId: 'hello-world' });
            });
            it('Failed user is not owner', async (done) => {
                  client3.on('exception', (data: SocketServerResponse<null>) => {
                        expect(data).toBeDefined();
                        expect(data.details).toBeDefined();
                        expect(data.statusCode).toBe(401);
                        done();
                  });

                  client3.emit(TTTAction.TTT_LEAVE, { roomId: ttt.id });
            });
      });

      describe(`${TTTAction.TTT_ADD_MOVE}`, () => {
            let client2: SocketIOClient.Socket;
            let client3: SocketIOClient.Socket;
            let client1: SocketIOClient.Socket;
            let user2: User;
            let user1: User;
            let ttt: TicTacToe;
            beforeEach(async () => {
                  user1 = await createFakeUser();
                  user2 = await createFakeUser();
                  const ticTacToe = new TicTacToe();
                  ticTacToe.users = [user1];
                  ttt = await ticTacToeRepository.save(ticTacToe);

                  await ticTacToeService.loadGameToCache(ttt.id);
                  await ticTacToeService.joinGame(ttt.id, user1);
                  await ticTacToeService.joinGame(ttt.id, user2);
                  await ticTacToeService.toggleReadyStatePlayer(ttt.id, user1);
                  await ticTacToeService.toggleReadyStatePlayer(ttt.id, user2);
                  await ticTacToeService.startGame(ttt.id, user2);

                  const socketToken1 = await authService.getSocketToken(user2);
                  client1 = await getIoClient(port, 'tic-tac-toe', socketToken1);
                  await client1.connect();

                  const socketToken2 = await authService.getSocketToken(user2);
                  client2 = await getIoClient(port, 'tic-tac-toe', socketToken2);
                  await client2.connect();

                  const user3 = await createFakeUser();
                  const socketToken3 = await authService.getSocketToken(user3);
                  client3 = await getIoClient(port, 'tic-tac-toe', socketToken3);
                  await client3.connect();
            });

            afterEach(async () => {
                  client2.disconnect();
                  client3.disconnect();
            });

            it('Pass ', async (done) => {
                  const updateTurn = await ticTacToeCommonService.getBoard(ttt.id);
                  updateTurn.currentTurn = false;
                  await ticTacToeCommonService.setBoard(ttt.id, updateTurn);

                  const input: AddMoveDto = {
                        roomId: ttt.id,
                        x: 1,
                        y: 1,
                  };

                  client2.on(TTTAction.TTT_ADD_MOVE, async (data: SocketServerResponse<null>) => {
                        const getGameRedis = await ticTacToeCommonService.getBoard(ttt.id);

                        expect(getGameRedis.board[input.x][input.y]).toBe(1);
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client2.emit(TTTAction.TTT_ADD_MOVE, input);
            });

            it('Pass win ', async (done) => {
                  const updateTurn = await ticTacToeCommonService.getBoard(ttt.id);
                  updateTurn.currentTurn = false;
                  updateTurn.board[0][0] = 1;
                  updateTurn.board[1][1] = 1;
                  updateTurn.board[2][2] = 1;
                  updateTurn.board[3][3] = 1;
                  await ticTacToeCommonService.setBoard(ttt.id, updateTurn);

                  const input: AddMoveDto = {
                        roomId: ttt.id,
                        x: 4,
                        y: 4,
                  };

                  client2.on(TTTAction.TTT_WIN, () => {
                        done();
                  });

                  client2.on(TTTAction.TTT_ADD_MOVE, async (data: SocketServerResponse<null>) => {
                        const getGameRedis = await ticTacToeCommonService.getBoard(ttt.id);

                        const getTicDB = await ticTacToeRepository
                              .createQueryBuilder('tic')
                              .leftJoinAndSelect('tic.users', 'user')
                              .where('tic.id = :id ', { id: ttt.id })
                              .getOne();

                        expect(getTicDB.winner).toBe(1);
                        expect(getTicDB.status).toBe(TicTacToeStatus.END);
                        expect(getGameRedis.info.winner).toBe(1);
                        expect(getGameRedis.info.status).toBe(TicTacToeStatus.END);
                        expect(getGameRedis.board[input.x][input.y]).toBe(1);
                        expect(data.statusCode).toBe(200);
                  });

                  client2.emit(TTTAction.TTT_ADD_MOVE, input);
            });

            it('Failed cell is already picked ', async (done) => {
                  const updateTurn = await ticTacToeCommonService.getBoard(ttt.id);
                  updateTurn.currentTurn = false;
                  updateTurn.board[1][1] = 0;
                  await ticTacToeCommonService.setBoard(ttt.id, updateTurn);

                  const input: AddMoveDto = {
                        roomId: ttt.id,
                        x: 1,
                        y: 1,
                  };

                  client2.on('exception', async (data: SocketServerResponse<null>) => {
                        const getGameRedis = await ticTacToeCommonService.getBoard(ttt.id);

                        expect(getGameRedis.board[input.x][input.y]).toBe(0);
                        expect(data.statusCode).toBe(400);
                        done();
                  });

                  client2.emit(TTTAction.TTT_ADD_MOVE, input);
            });
            it('Failed wrong turn ', async (done) => {
                  const updateTurn = await ticTacToeCommonService.getBoard(ttt.id);
                  updateTurn.currentTurn = true;
                  await ticTacToeCommonService.setBoard(ttt.id, updateTurn);

                  const input: AddMoveDto = {
                        roomId: ttt.id,
                        x: 1,
                        y: 1,
                  };

                  client2.on('exception', async (data: SocketServerResponse<null>) => {
                        const getGameRedis = await ticTacToeCommonService.getBoard(ttt.id);

                        expect(getGameRedis.board[input.x][input.y]).not.toBe(1);
                        expect(data.statusCode).toBe(400);
                        done();
                  });

                  client2.emit(TTTAction.TTT_ADD_MOVE, input);
            });
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
