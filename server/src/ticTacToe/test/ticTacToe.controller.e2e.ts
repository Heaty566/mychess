import * as supertest from 'supertest';
import 'jest-ts-auto-mock';
import { INestApplication } from '@nestjs/common';

//---- Entity
import { User } from '../../user/entities/user.entity';
import { TicTacToeFlag, TicTacToePlayer, TicTacToeStatus } from '../entity/ticTacToe.interface';

//---- Service
import { TicTacToeService } from '../ticTacToe.service';
import { TicTacToeCommonService } from '../ticTacToeCommon.service';
import { AuthService } from '../../auth/auth.service';
import { RedisService } from '../../utils/redis/redis.service';

//---- DTO
import { TTTRoomIdDTO } from '../dto/tttRoomIdDto';
import { TTTAddMoveDto } from '../dto/tttAddMoveDto';

//---- Common
import { initTestModule } from '../../test/initTest';
import { generateCookie } from '../../test/test.helper';
import { DrawDto } from '../dto/drawDto';

describe('TicTacToeController', () => {
      let app: INestApplication;
      let resetDB: any;

      let ticTacToeCommonService: TicTacToeCommonService;
      let generateFakeUser: () => Promise<User>;
      let authService: AuthService;
      let ticTacToeService: TicTacToeService;
      let redisService: RedisService;

      beforeAll(async () => {
            const { getApp, module, resetDatabase, getFakeUser } = await initTestModule();
            app = getApp;
            resetDB = resetDatabase;
            generateFakeUser = getFakeUser;
            ticTacToeService = module.get<TicTacToeService>(TicTacToeService);
            ticTacToeCommonService = module.get<TicTacToeCommonService>(TicTacToeCommonService);
            authService = module.get<AuthService>(AuthService);
            redisService = module.get<RedisService>(RedisService);
      });

      describe('GET /:id', () => {
            let newUser: User;
            let newCookie: string[];

            beforeEach(async () => {
                  newUser = await generateFakeUser();
                  newCookie = generateCookie(await authService.createReToken(newUser));
            });

            const reqApi = (id) => supertest(app.getHttpServer()).get(`/api/ttt/${id}`).set({ cookie: newCookie }).send();

            it('Pass', async () => {
                  const res = await reqApi(newUser.id);

                  expect(res.body.data).toBeDefined();
            });
      });

      describe('POST /bot', () => {
            let newUser: User;
            let newCookie: string[];
            beforeEach(async () => {
                  newUser = await generateFakeUser();
                  newCookie = generateCookie(await authService.createReToken(newUser));
            });

            const reqApi = () => supertest(app.getHttpServer()).post('/api/ttt/bot').set({ cookie: newCookie }).send();

            it('Pass', async () => {
                  const res = await reqApi();
                  const getBoard = await ticTacToeCommonService.getBoard(res.body.data.roomId);

                  const isExistUser = getBoard.users.find((item) => item.id === newUser.id);

                  expect(isExistUser).toBeDefined();
                  expect(getBoard).toBeDefined();
                  expect(getBoard.users[0].id).toBeDefined();
                  expect(getBoard.users[1].id).toBeDefined();
                  expect(res.status).toBe(201);
            });
      });
      describe('POST /pvp', () => {
            let newUser: User;
            let newCookie: string[];
            beforeEach(async () => {
                  newUser = await generateFakeUser();
                  newCookie = generateCookie(await authService.createReToken(newUser));
            });

            const reqApi = () => supertest(app.getHttpServer()).post('/api/ttt/pvp').set({ cookie: newCookie }).send();

            it('Pass', async () => {
                  const res = await reqApi();
                  const getBoard = await ticTacToeCommonService.getBoard(res.body.data.roomId);

                  const isExistUser = getBoard.users.find((item) => item.id === newUser.id);

                  expect(isExistUser).toBeDefined();
                  expect(getBoard).toBeDefined();
                  expect(getBoard.users[0].id).toBeDefined();
                  expect(getBoard.users[1]).toBeUndefined();
                  expect(res.status).toBe(201);
            });
      });
      describe('POST /restart', () => {
            let user: User;
            let newCookie: string[];
            let tttId: string;
            let player1: TicTacToePlayer;
            beforeEach(async () => {
                  user = await generateFakeUser();
                  tttId = await ticTacToeCommonService.createNewGame(user, true);
                  const getBoard = await ticTacToeCommonService.getBoard(tttId);
                  await ticTacToeCommonService.toggleReadyStatePlayer(tttId, getBoard.users[0]);
                  await ticTacToeCommonService.toggleReadyStatePlayer(tttId, getBoard.users[1]);
                  await ticTacToeCommonService.startGame(tttId);
                  player1 = getBoard.users[0];
                  newCookie = generateCookie(await authService.createReToken(user));
            });

            const reqApi = (input: TTTRoomIdDTO) => supertest(app.getHttpServer()).post('/api/ttt/restart').set({ cookie: newCookie }).send(input);

            it('Pass', async () => {
                  await ticTacToeCommonService.surrender(tttId, player1);
                  const res = await reqApi({ roomId: tttId });
                  const getBoard = await ticTacToeCommonService.getBoard(res.body.data.roomId);
                  const isExistUser = getBoard.users.find((item) => item.id === user.id);

                  expect(isExistUser).toBeDefined();
                  expect(getBoard).toBeDefined();
                  expect(getBoard.users[0].id).toBeDefined();
                  expect(getBoard.users[1]).toBeUndefined();
                  expect(res.status).toBe(201);
            });
            it('Failed game is playing', async () => {
                  const res = await reqApi({ roomId: tttId });

                  expect(res.status).toBe(403);
            });
            it('Failed out id', async () => {
                  const res = await reqApi({ roomId: 'hello' });

                  expect(res.status).toBe(404);
            });
      });

      describe('POST /add-move', () => {
            let user: User;
            let newCookie: string[];
            let tttId: string;
            let player1: TicTacToePlayer;
            beforeEach(async () => {
                  user = await generateFakeUser();
                  tttId = await ticTacToeCommonService.createNewGame(user, true);
                  const getBoard = await ticTacToeCommonService.getBoard(tttId);
                  await ticTacToeCommonService.toggleReadyStatePlayer(tttId, getBoard.users[0]);
                  await ticTacToeCommonService.toggleReadyStatePlayer(tttId, getBoard.users[1]);
                  await ticTacToeCommonService.startGame(tttId);
                  player1 = getBoard.users[0];
                  newCookie = generateCookie(await authService.createReToken(user));
            });

            const reqApi = (input: TTTAddMoveDto) => supertest(app.getHttpServer()).put('/api/ttt/add-move').set({ cookie: newCookie }).send(input);

            it('Pass', async () => {
                  const res = await reqApi({ roomId: tttId, x: 0, y: 0 });
                  const getBoard = await ticTacToeCommonService.getBoard(tttId);

                  expect(getBoard.board[0][0]).toBe(player1.flag);
                  expect(res.status).toBe(200);
            });

            it('Failed wrong turn', async () => {
                  await ticTacToeService.addMoveToBoard(tttId, player1, 1, 2);

                  const res = await reqApi({ roomId: tttId, x: 0, y: 0 });
                  const getBoard = await ticTacToeCommonService.getBoard(tttId);

                  expect(getBoard.board[0][0]).toBe(TicTacToeFlag.EMPTY);
                  expect(res.status).toBe(400);
            });

            it('Pass user win', async () => {
                  const beforeUpdate = await ticTacToeCommonService.getBoard(tttId);
                  beforeUpdate.board[1][1] = TicTacToeFlag.BLUE;
                  beforeUpdate.board[2][2] = TicTacToeFlag.BLUE;
                  beforeUpdate.board[3][3] = TicTacToeFlag.BLUE;
                  beforeUpdate.board[4][4] = TicTacToeFlag.BLUE;
                  await ticTacToeCommonService.setBoard(beforeUpdate);
                  const res = await reqApi({ roomId: tttId, x: 0, y: 0 });
                  const getBoard = await ticTacToeCommonService.getBoard(tttId);

                  expect(getBoard.winner).toBe(TicTacToeFlag.BLUE);
                  expect(getBoard.status).toBe(TicTacToeStatus.END);
                  expect(res.status).toBe(200);
            });

            it('Pass bot win', async () => {
                  const beforeUpdate = await ticTacToeCommonService.getBoard(tttId);
                  beforeUpdate.board[1][1] = TicTacToeFlag.RED;
                  beforeUpdate.board[2][2] = TicTacToeFlag.RED;
                  beforeUpdate.board[3][3] = TicTacToeFlag.RED;
                  beforeUpdate.board[4][4] = TicTacToeFlag.RED;
                  await ticTacToeCommonService.setBoard(beforeUpdate);
                  const res = await reqApi({ roomId: tttId, x: 0, y: 0 });
                  const getBoard = await ticTacToeCommonService.getBoard(tttId);

                  expect(getBoard.winner).toBe(TicTacToeFlag.RED);
                  expect(getBoard.status).toBe(TicTacToeStatus.END);
                  expect(res.status).toBe(200);
            });

            it('Failed cell is picked', async () => {
                  const beforeUpdate = await ticTacToeCommonService.getBoard(tttId);
                  beforeUpdate.board[0][0] = TicTacToeFlag.RED;
                  await ticTacToeCommonService.setBoard(beforeUpdate);
                  const res = await reqApi({ roomId: tttId, x: 0, y: 0 });
                  const getBoard = await ticTacToeCommonService.getBoard(tttId);

                  expect(getBoard.board[0][0]).not.toBe(TicTacToeFlag.EMPTY);
                  expect(res.status).toBe(400);
            });

            it('Failed game is not start yet', async () => {
                  await ticTacToeCommonService.surrender(tttId, player1);
                  const res = await reqApi({ roomId: tttId, x: 0, y: 0 });
                  const getBoard = await ticTacToeCommonService.getBoard(tttId);

                  expect(getBoard.board[0][0]).toBe(TicTacToeFlag.EMPTY);
                  expect(res.status).toBe(403);
            });
      });

      describe('POST /join-room', () => {
            let user: User;
            let newCookie: string[];
            let tttId: string;
            beforeEach(async () => {
                  user = await generateFakeUser();
                  tttId = await ticTacToeCommonService.createNewGame(await generateFakeUser(), false);
                  const getBoard = await ticTacToeCommonService.getBoard(tttId);
                  await ticTacToeCommonService.toggleReadyStatePlayer(tttId, getBoard.users[0]);

                  newCookie = generateCookie(await authService.createReToken(user));
            });

            const reqApi = (input: TTTRoomIdDTO) => supertest(app.getHttpServer()).put('/api/ttt/join-room').set({ cookie: newCookie }).send(input);

            it('Pass', async () => {
                  const res = await reqApi({ roomId: tttId });
                  const getBoard = await ticTacToeCommonService.getBoard(tttId);
                  const isExistUser = getBoard.users.find((item) => item.id === user.id);

                  expect(res.status).toBe(200);
                  expect(isExistUser).toBeDefined();
                  expect(getBoard).toBeDefined();
                  expect(getBoard.users[0].id).toBeDefined();
                  expect(getBoard.users[1].id).toBe(user.id);
            });

            it('Failed game is playing', async () => {
                  const beforeUpdate = await ticTacToeCommonService.getBoard(tttId);
                  beforeUpdate.status = TicTacToeStatus.PLAYING;
                  await ticTacToeCommonService.setBoard(beforeUpdate);

                  const res = await reqApi({ roomId: tttId });

                  expect(res.status).toBe(404);
            });
            it('Pass game full', async () => {
                  await ticTacToeCommonService.joinGame(tttId, user);
                  await ticTacToeCommonService.joinGame(tttId, user);

                  const res = await reqApi({ roomId: tttId });

                  expect(res.status).toBe(200);
            });
      });

      describe('POST /start', () => {
            let user: User;
            let newCookie: string[];
            let tttId: string;
            let player1: TicTacToePlayer;
            beforeEach(async () => {
                  user = await generateFakeUser();
                  tttId = await ticTacToeCommonService.createNewGame(user, true);
                  const getBoard = await ticTacToeCommonService.getBoard(tttId);
                  await ticTacToeCommonService.toggleReadyStatePlayer(tttId, getBoard.users[0]);
                  await ticTacToeCommonService.toggleReadyStatePlayer(tttId, getBoard.users[1]);

                  newCookie = generateCookie(await authService.createReToken(user));
                  player1 = getBoard.users[0];
            });

            const reqApi = (input: TTTRoomIdDTO, cookie: string[]) =>
                  supertest(app.getHttpServer()).put('/api/ttt/start').set({ cookie }).send(input);

            it('Pass', async () => {
                  const res = await reqApi({ roomId: tttId }, newCookie);
                  const getBoard = await ticTacToeCommonService.getBoard(tttId);

                  expect(res.status).toBe(200);

                  expect(getBoard).toBeDefined();
                  expect(getBoard.status).toBe(TicTacToeStatus.PLAYING);
            });
            it('Failed only one ready', async () => {
                  await ticTacToeCommonService.toggleReadyStatePlayer(tttId, player1);
                  const res = await reqApi({ roomId: tttId }, newCookie);
                  const getBoard = await ticTacToeCommonService.getBoard(tttId);

                  expect(res.status).toBe(400);
                  expect(getBoard).toBeDefined();
                  expect(getBoard.status).toBe(TicTacToeStatus['NOT-YET']);
            });
            it('Failed not a user', async () => {
                  const fakeCookie = generateCookie(await authService.createReToken(await generateFakeUser()));
                  const res = await reqApi({ roomId: tttId }, fakeCookie);
                  const getBoard = await ticTacToeCommonService.getBoard(tttId);

                  expect(res.status).toBe(403);
                  expect(getBoard).toBeDefined();
                  expect(getBoard.status).toBe(TicTacToeStatus['NOT-YET']);
            });
      });

      describe('POST /ready', () => {
            let user: User;
            let newCookie: string[];
            let tttId: string;

            beforeEach(async () => {
                  user = await generateFakeUser();
                  tttId = await ticTacToeCommonService.createNewGame(user, true);

                  newCookie = generateCookie(await authService.createReToken(user));
            });

            const reqApi = (input: TTTRoomIdDTO) => supertest(app.getHttpServer()).put('/api/ttt/ready').set({ cookie: newCookie }).send(input);

            it('Pass', async () => {
                  const res = await reqApi({ roomId: tttId });
                  const getBoard = await ticTacToeCommonService.getBoard(tttId);
                  expect(res.status).toBe(200);

                  expect(getBoard).toBeDefined();
                  expect(getBoard.users[0].ready).toBeTruthy();
            });
      });

      describe('POST /leave', () => {
            let user: User;
            let newCookie: string[];
            let tttId: string;

            beforeEach(async () => {
                  user = await generateFakeUser();
                  tttId = await ticTacToeCommonService.createNewGame(user, true);

                  newCookie = generateCookie(await authService.createReToken(user));
            });

            const reqApi = (input: TTTRoomIdDTO) => supertest(app.getHttpServer()).put('/api/ttt/leave').set({ cookie: newCookie }).send(input);

            it('Pass', async () => {
                  const res = await reqApi({ roomId: tttId });
                  const getBoard = await ticTacToeCommonService.getBoard(tttId);

                  expect(res.status).toBe(200);
                  expect(getBoard).toBeDefined();
                  expect(getBoard.users.length).toBe(1);
            });
      });
      describe('PUT /draw', () => {
            let user1: User, user2: User;
            let newCookie: string[];
            let boardId: string;
            let player1: TicTacToePlayer;
            let player2: TicTacToePlayer;

            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  user2 = await generateFakeUser();
                  boardId = await ticTacToeCommonService.createNewGame(user1);
                  await ticTacToeCommonService.joinGame(boardId, user2);
                  const getBoard = await ticTacToeCommonService.getBoard(boardId);
                  await ticTacToeCommonService.toggleReadyStatePlayer(boardId, getBoard.users[0]);
                  await ticTacToeCommonService.toggleReadyStatePlayer(boardId, getBoard.users[1]);
                  await ticTacToeCommonService.startGame(boardId);
                  player1 = getBoard.users[0];
                  player2 = getBoard.users[1];
                  newCookie = generateCookie(await authService.createReToken(user2));
            });

            const reqApi = (input: DrawDto) => supertest(app.getHttpServer()).put('/api/ttt/draw').set({ cookie: newCookie }).send(input);

            it('Pass', async () => {
                  await ticTacToeCommonService.createDrawRequest(boardId, player1);
                  const res = await reqApi({ roomId: boardId, isAccept: true });
                  const getBoard = await ticTacToeCommonService.getBoard(boardId);

                  expect(getBoard.status).toBe(TicTacToeStatus.END);
                  expect(res.status).toBe(200);
            });
            it('Pass', async () => {
                  await ticTacToeCommonService.createDrawRequest(boardId, player1);
                  const res = await reqApi({ roomId: boardId, isAccept: false });
                  const getBoard = await ticTacToeCommonService.getBoard(boardId);

                  expect(getBoard.status).toBe(TicTacToeStatus.PLAYING);
                  expect(res.status).toBe(200);
            });
            it('Failed user accept their request', async () => {
                  await ticTacToeCommonService.createDrawRequest(boardId, player2);
                  const res = await reqApi({ roomId: boardId, isAccept: true });
                  const getBoard = await ticTacToeCommonService.getBoard(boardId);

                  expect(getBoard.status).toBe(TicTacToeStatus.DRAW);
                  expect(res.status).toBe(403);
                  expect(res.status).toBe(403);
            });

            it('Failed other user does not create draw  request', async () => {
                  const res = await reqApi({ roomId: boardId, isAccept: true });
                  const getBoard = await ticTacToeCommonService.getBoard(boardId);

                  expect(getBoard.status).toBe(TicTacToeStatus.PLAYING);
                  expect(res.status).toBe(403);
            });
      });
      describe('POST /draw', () => {
            let user1: User, user2: User;
            let newCookie: string[];
            let boardId: string;
            let player1: TicTacToePlayer;
            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  user2 = await generateFakeUser();
                  boardId = await ticTacToeCommonService.createNewGame(user1);
                  await ticTacToeCommonService.joinGame(boardId, user2);

                  const getBoard = await ticTacToeCommonService.getBoard(boardId);
                  await ticTacToeCommonService.toggleReadyStatePlayer(boardId, getBoard.users[0]);
                  await ticTacToeCommonService.toggleReadyStatePlayer(boardId, getBoard.users[1]);

                  await ticTacToeCommonService.startGame(boardId);
                  player1 = getBoard.users[0];
                  newCookie = generateCookie(await authService.createReToken(user1));
            });
            const reqApi = (input: TTTRoomIdDTO) => supertest(app.getHttpServer()).post('/api/ttt/draw').set({ cookie: newCookie }).send(input);

            it('Pass', async () => {
                  const res = await reqApi({ roomId: boardId });
                  const getBoard = await ticTacToeCommonService.getBoard(boardId);

                  expect(getBoard.status).toBe(TicTacToeStatus.DRAW);
                  expect(res.status).toBe(201);
            });

            it('Failed game is not playing', async () => {
                  await ticTacToeCommonService.surrender(boardId, player1);
                  const res = await reqApi({ roomId: boardId });
                  const getBoard = await ticTacToeCommonService.getBoard(boardId);

                  expect(getBoard.status).not.toBe(TicTacToeStatus.DRAW);
                  expect(res.status).toBe(403);
            });
      });
      describe('PUT /surrender', () => {
            let user1: User, user2: User;
            let newCookie: string[];
            let boardId: string;
            let player1: TicTacToePlayer;
            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  user2 = await generateFakeUser();
                  boardId = await ticTacToeCommonService.createNewGame(user1);
                  await ticTacToeCommonService.joinGame(boardId, user2);

                  const getBoard = await ticTacToeCommonService.getBoard(boardId);
                  await ticTacToeCommonService.toggleReadyStatePlayer(boardId, getBoard.users[0]);
                  await ticTacToeCommonService.toggleReadyStatePlayer(boardId, getBoard.users[1]);

                  await ticTacToeCommonService.startGame(boardId);
                  player1 = getBoard.users[0];
                  newCookie = generateCookie(await authService.createReToken(user1));
            });
            const reqApi = (input: TTTRoomIdDTO) => supertest(app.getHttpServer()).put('/api/ttt/surrender').set({ cookie: newCookie }).send(input);

            it('Pass', async () => {
                  const res = await reqApi({ roomId: boardId });
                  expect(res.status).toBe(200);
            });
            it('Failed game is end', async () => {
                  await ticTacToeCommonService.surrender(boardId, player1);
                  const res = await reqApi({ roomId: boardId });

                  expect(res.status).toBe(403);
            });
      });

      describe('GET /quick-join-room', () => {
            let user: User;
            let cookie: string[];
            let boardIds: string[];

            beforeEach(async () => {
                  user = await generateFakeUser();
                  const boardId = await ticTacToeCommonService.createNewGame(user, false);
                  const player = await ticTacToeCommonService.findUser(boardId, user.id);
                  await ticTacToeCommonService.leaveGame(boardId, player);

                  boardIds = await ticTacToeCommonService.getAllBoard();
                  cookie = generateCookie(await authService.createReToken(user));
            });

            const reqApi = (cookie: string[]) => supertest(app.getHttpServer()).get('/api/ttt/quick-join-room').set({ cookie });

            it('room one user', async () => {
                  for (let i = 0; i < boardIds.length; i++) {
                        const board = await ticTacToeCommonService.getBoard(boardIds[i]);
                        if (board) {
                              if (board.users.length === 0) await redisService.deleteByKey(`ttt-${board.id}`);
                        }
                  }
                  const res = await reqApi(cookie);

                  const getBoard = await ticTacToeCommonService.getBoard(res.body.data.roomId);
                  const isExistUser = await ticTacToeCommonService.findUser(getBoard.id, user.id);

                  expect(res.status).toBe(200);
                  expect(isExistUser).toBeDefined();
                  expect(getBoard).toBeDefined();
                  expect(getBoard.users[1].id).toBe(user.id);
            });

            it('empty room', async () => {
                  const boardIds = await ticTacToeCommonService.getAllBoard();

                  for (let i = 0; i < boardIds.length; i++) {
                        const board = await ticTacToeCommonService.getBoard(boardIds[i]);
                        if (board) {
                              if (board.users.length === 1) await redisService.deleteByKey(`ttt-${board.id}`);
                        }
                  }

                  const res = await reqApi(cookie);
                  const getBoard = await ticTacToeCommonService.getBoard(res.body.data.roomId);
                  const isExistUser = await ticTacToeCommonService.findUser(getBoard.id, user.id);

                  expect(res.status).toBe(200);
                  expect(isExistUser).toBeDefined();
                  expect(getBoard).toBeDefined();
                  expect(getBoard.users[0].id).toBe(user.id);
            });

            it('no room available', async () => {
                  const boardIds = await ticTacToeCommonService.getAllBoard();
                  for (const boardId of boardIds) {
                        await redisService.deleteByKey(`ttt-${boardId}`);
                  }

                  const res = await reqApi(cookie);
                  expect(res.status).toBe(404);
            });
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
