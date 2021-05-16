import * as supertest from 'supertest';
import 'jest-ts-auto-mock';
import { INestApplication } from '@nestjs/common';

//---- Entity
import { User } from '../../user/entities/user.entity';
import { ChessPlayer, ChessRole, ChessStatus, PlayerFlagEnum } from '../entity/chess.interface';

//---- Service
import { ChessService } from '../chess.service';
import { ChessCommonService } from '../chessCommon.service';
import { AuthService } from '../../auth/auth.service';
import { RedisService } from '../../utils/redis/redis.service';

//---- DTO
import { ChessAddMoveDto } from '../dto/chessAddMoveDto';
import { ChessChooseAPieceDTO } from '../dto/chessChooseAPieceDTO';
import { ChessRoomIdDTO } from '../dto/chessRoomIdDto';
import { ChessPromotePawnDto } from '../dto/chessPromotePawnDto';
import { DrawDto } from '../dto/drawDto';

//---- Common
import { initTestModule } from '../../test/initTest';
import { generateCookie } from '../../test/test.helper';

describe('ChessController', () => {
      let app: INestApplication;
      let resetDB: any;
      let generateFakeUser: () => Promise<User>;
      let authService: AuthService;
      let chessService: ChessService;
      let chessCommonService: ChessCommonService;
      let redisService: RedisService;

      beforeAll(async () => {
            const { getApp, module, resetDatabase, getFakeUser } = await initTestModule();
            app = getApp;
            resetDB = resetDatabase;
            generateFakeUser = getFakeUser;
            authService = module.get<AuthService>(AuthService);
            chessService = module.get<ChessService>(ChessService);
            chessCommonService = module.get<ChessCommonService>(ChessCommonService);
            redisService = module.get<RedisService>(RedisService);
      });

      describe('POST /pvp', () => {
            let newUser: User;
            let newCookie: string[];

            beforeEach(async () => {
                  newUser = await generateFakeUser();
                  newCookie = generateCookie(await authService.createReToken(newUser));
            });

            const reqApi = () => supertest(app.getHttpServer()).post('/api/chess/pvp').set({ cookie: newCookie }).send();

            it('Pass', async () => {
                  const res = await reqApi();
                  const getBoard = await chessCommonService.getBoard(res.body.data.roomId);

                  const isExistUser = getBoard.users.find((item) => item.id === newUser.id);

                  expect(isExistUser).toBeDefined();
                  expect(getBoard).toBeDefined();
                  expect(getBoard.users[0].id).toBeDefined();
                  expect(getBoard.users[1]).toBeUndefined();
                  expect(res.status).toBe(201);
            });
      });

      describe('POST /bot', () => {
            let newUser: User;
            let newCookie: string[];

            beforeEach(async () => {
                  newUser = await generateFakeUser();
                  newCookie = generateCookie(await authService.createReToken(newUser));
            });

            const reqApi = () => supertest(app.getHttpServer()).post('/api/chess/bot').set({ cookie: newCookie }).send();

            it('Pass', async () => {
                  const res = await reqApi();
                  const getBoard = await chessCommonService.getBoard(res.body.data.roomId);
                  const isExistUser = getBoard.users.find((item) => item.id === newUser.id);

                  expect(isExistUser).toBeDefined();
                  expect(getBoard).toBeDefined();
                  expect(getBoard.users[0].id).toBeDefined();
                  expect(getBoard.users[1].name).toBe('BOT');
                  expect(res.status).toBe(201);
            });
      });

      describe('GET /:id', () => {
            let newUser: User;
            let newCookie: string[];

            beforeEach(async () => {
                  newUser = await generateFakeUser();
                  newCookie = generateCookie(await authService.createReToken(newUser));
            });

            const reqApi = (id) => supertest(app.getHttpServer()).get(`/api/chess/${id}`).set({ cookie: newCookie }).send();

            it('Pass', async () => {
                  const res = await reqApi(newUser.id);
                  expect(res.body.data).toBeDefined();
            });
      });

      describe('PUT /join-room', () => {
            let user: User;
            let user2: User;
            let cookie1: string[];
            let cookie2: string[];
            let boardId: string;
            beforeEach(async () => {
                  user = await generateFakeUser();
                  user2 = await generateFakeUser();
                  boardId = await chessCommonService.createNewGame(user, false);

                  cookie1 = generateCookie(await authService.createReToken(user));
                  cookie2 = generateCookie(await authService.createReToken(user2));
            });

            const reqApi = (input: ChessRoomIdDTO, cookie: string[]) =>
                  supertest(app.getHttpServer()).put('/api/chess/join-room').set({ cookie }).send(input);

            it('Pass', async () => {
                  const res = await reqApi({ roomId: boardId }, cookie1);
                  const getBoard = await chessCommonService.getBoard(boardId);
                  const isExistUser = await chessCommonService.findUser(boardId, user.id);

                  expect(res.status).toBe(200);
                  expect(isExistUser).toBeDefined();
                  expect(getBoard).toBeDefined();
                  expect(getBoard.users[0].id).toBe(user.id);
            });

            it('Failed game is playing', async () => {
                  const board = await chessCommonService.getBoard(boardId);
                  board.status = ChessStatus.PLAYING;
                  await chessCommonService.setBoard(board);
                  const res = await reqApi({ roomId: boardId }, cookie2);

                  expect(res.status).toBe(404);
            });
            it('Pass game is full', async () => {
                  const res = await reqApi({ roomId: boardId }, cookie2);
                  const isExistUser = await chessCommonService.findUser(boardId, user2.id);
                  expect(isExistUser).toBeDefined();
                  expect(res.status).toBe(200);
            });
      });

      describe('PUT /start', () => {
            let user1: User, user2: User;
            let newCookie: string[];
            let boardId: string;
            let player2: ChessPlayer;
            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  user2 = await generateFakeUser();
                  boardId = await chessCommonService.createNewGame(user1);
                  await chessCommonService.joinGame(boardId, user2);
                  const getBoard = await chessCommonService.getBoard(boardId);
                  await chessCommonService.toggleReadyStatePlayer(boardId, getBoard.users[0]);
                  await chessCommonService.toggleReadyStatePlayer(boardId, getBoard.users[1]);

                  newCookie = generateCookie(await authService.createReToken(user1));

                  player2 = getBoard.users[1];
            });

            const reqApi = (input: ChessRoomIdDTO, cookie: string[]) =>
                  supertest(app.getHttpServer()).put('/api/chess/start').set({ cookie }).send(input);

            it('Pass', async () => {
                  const res = await reqApi({ roomId: boardId }, newCookie);
                  const getBoard = await chessCommonService.getBoard(boardId);

                  expect(res.status).toBe(200);
                  expect(getBoard).toBeDefined();
                  expect(getBoard.status).toBe(ChessStatus.PLAYING);
            });

            it('Failed only one ready', async () => {
                  await chessCommonService.toggleReadyStatePlayer(boardId, player2);
                  const res = await reqApi({ roomId: boardId }, newCookie);
                  const getBoard = await chessCommonService.getBoard(boardId);

                  expect(res.status).toBe(400);
                  expect(getBoard).toBeDefined();
                  expect(getBoard.status).toBe(ChessStatus.NOT_YET);
            });

            it('Failed game is end', async () => {
                  await chessCommonService.startGame(boardId);
                  const res = await reqApi({ roomId: boardId }, newCookie);
                  const getBoard = await chessCommonService.getBoard(boardId);

                  expect(res.status).toBe(403);
                  expect(getBoard).toBeDefined();
            });

            it('Failed not a user', async () => {
                  const fakeCookie = generateCookie(await authService.createReToken(await generateFakeUser()));
                  const res = await reqApi({ roomId: boardId }, fakeCookie);
                  const getBoard = await chessCommonService.getBoard(boardId);

                  expect(res.status).toBe(403);
                  expect(getBoard).toBeDefined();
                  expect(getBoard.status).toBe(ChessStatus.NOT_YET);
            });
      });

      describe('PUT /ready', () => {
            let user: User;
            let newCookie: string[];
            let boardId: string;

            beforeEach(async () => {
                  user = await generateFakeUser();
                  boardId = await chessCommonService.createNewGame(user);
                  newCookie = generateCookie(await authService.createReToken(user));
            });

            const reqApi = (input: ChessRoomIdDTO) => supertest(app.getHttpServer()).put('/api/chess/ready').set({ cookie: newCookie }).send(input);

            it('Pass', async () => {
                  const res = await reqApi({ roomId: boardId });
                  const getBoard = await chessCommonService.getBoard(boardId);

                  expect(res.status).toBe(200);
                  expect(getBoard).toBeDefined();
                  expect(getBoard.users[0].ready).toBeTruthy();
            });
      });

      describe('PUT /promote-pawn', () => {
            let user1: User, user2: User;
            let newCookie1: string[], newCookie2: string[];
            let boardId: string;
            let player1: ChessPlayer;
            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  user2 = await generateFakeUser();
                  boardId = await chessCommonService.createNewGame(user1);
                  await chessCommonService.joinGame(boardId, user2);

                  const getBoard = await chessCommonService.getBoard(boardId);
                  await chessCommonService.toggleReadyStatePlayer(boardId, getBoard.users[0]);
                  await chessCommonService.toggleReadyStatePlayer(boardId, getBoard.users[1]);

                  await chessCommonService.startGame(boardId);

                  player1 = getBoard.users[0];

                  newCookie1 = generateCookie(await authService.createReToken(user1));
                  newCookie2 = generateCookie(await authService.createReToken(user2));
            });
            const reqApi1 = (input: ChessPromotePawnDto) =>
                  supertest(app.getHttpServer()).put('/api/chess/promote-pawn').set({ cookie: newCookie1 }).send(input);
            const reqApi2 = (input: ChessPromotePawnDto) =>
                  supertest(app.getHttpServer()).put('/api/chess/promote-pawn').set({ cookie: newCookie2 }).send(input);

            it('Pass', async () => {
                  let getBoard = await chessCommonService.getBoard(boardId);
                  getBoard.board[5][7] = {
                        flag: PlayerFlagEnum.WHITE,
                        chessRole: ChessRole.PAWN,
                  };
                  await chessCommonService.setBoard(getBoard);
                  const res = await reqApi1({
                        roomId: boardId,
                        promotePos: {
                              x: 5,
                              y: 7,
                        },
                        promoteRole: ChessRole.QUEEN,
                  });
                  getBoard = await chessCommonService.getBoard(boardId);

                  expect(res.status).toBe(200);
                  expect(getBoard.board[5][7].chessRole).toBe(ChessRole.QUEEN);
                  expect(getBoard.board[5][7].flag).toBe(PlayerFlagEnum.WHITE);
                  expect(getBoard.checkedPiece).toBeDefined();
            });

            it('Pass', async () => {
                  let getBoard = await chessCommonService.getBoard(boardId);
                  getBoard.board[2][7] = {
                        flag: PlayerFlagEnum.WHITE,
                        chessRole: ChessRole.PAWN,
                  };
                  await chessCommonService.setBoard(getBoard);
                  const res = await reqApi1({
                        roomId: boardId,
                        promotePos: {
                              x: 2,
                              y: 7,
                        },
                        promoteRole: ChessRole.QUEEN,
                  });
                  getBoard = await chessCommonService.getBoard(boardId);

                  expect(res.status).toBe(200);
                  expect(getBoard.board[2][7].chessRole).toBe(ChessRole.QUEEN);
                  expect(getBoard.board[2][7].flag).toBe(PlayerFlagEnum.WHITE);
                  expect(getBoard.checkedPiece).toBeUndefined();
            });

            it('Pass', async () => {
                  let getBoard = await chessCommonService.getBoard(boardId);
                  getBoard.turn = true;
                  getBoard.board[5][0] = {
                        flag: PlayerFlagEnum.BLACK,
                        chessRole: ChessRole.PAWN,
                  };
                  await chessCommonService.setBoard(getBoard);
                  const res = await reqApi2({
                        roomId: boardId,
                        promotePos: {
                              x: 5,
                              y: 0,
                        },
                        promoteRole: ChessRole.QUEEN,
                  });
                  getBoard = await chessCommonService.getBoard(boardId);

                  expect(res.status).toBe(200);
                  expect(getBoard.board[5][0].chessRole).toBe(ChessRole.QUEEN);
                  expect(getBoard.board[5][0].flag).toBe(PlayerFlagEnum.BLACK);
            });

            it('Not your piece', async () => {
                  let getBoard = await chessCommonService.getBoard(boardId);
                  getBoard.board[5][0] = {
                        flag: PlayerFlagEnum.BLACK,
                        chessRole: ChessRole.PAWN,
                  };
                  await chessCommonService.setBoard(getBoard);
                  const res = await reqApi1({
                        roomId: boardId,
                        promotePos: {
                              x: 5,
                              y: 0,
                        },
                        promoteRole: ChessRole.QUEEN,
                  });
                  getBoard = await chessCommonService.getBoard(boardId);

                  expect(res.status).toBe(400);
            });

            it('Not a promote move', async () => {
                  let getBoard = await chessCommonService.getBoard(boardId);
                  getBoard.board[5][6] = {
                        flag: PlayerFlagEnum.WHITE,
                        chessRole: ChessRole.PAWN,
                  };
                  await chessCommonService.setBoard(getBoard);
                  const res = await reqApi1({
                        roomId: boardId,
                        promotePos: {
                              x: 5,
                              y: 6,
                        },
                        promoteRole: ChessRole.QUEEN,
                  });
                  getBoard = await chessCommonService.getBoard(boardId);

                  expect(res.status).toBe(400);
            });

            it('Failed game is end', async () => {
                  await chessCommonService.surrender(boardId, player1);
                  const res = await reqApi1({
                        roomId: boardId,
                        promotePos: {
                              x: 5,
                              y: 7,
                        },
                        promoteRole: ChessRole.QUEEN,
                  });

                  expect(res.status).toBe(403);
            });
      });

      describe('POST /draw', () => {
            let user1: User, user2: User;
            let newCookie: string[];
            let boardId: string;
            let player1: ChessPlayer;
            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  user2 = await generateFakeUser();
                  boardId = await chessCommonService.createNewGame(user1);
                  await chessCommonService.joinGame(boardId, user2);

                  const getBoard = await chessCommonService.getBoard(boardId);
                  await chessCommonService.toggleReadyStatePlayer(boardId, getBoard.users[0]);
                  await chessCommonService.toggleReadyStatePlayer(boardId, getBoard.users[1]);

                  await chessCommonService.startGame(boardId);
                  player1 = getBoard.users[0];
                  newCookie = generateCookie(await authService.createReToken(user1));
            });
            const reqApi = (input: ChessRoomIdDTO) => supertest(app.getHttpServer()).post('/api/chess/draw').set({ cookie: newCookie }).send(input);

            it('Pass', async () => {
                  const res = await reqApi({ roomId: boardId });
                  const getBoard = await chessCommonService.getBoard(boardId);

                  expect(getBoard.status).toBe(ChessStatus.DRAW);
                  expect(res.status).toBe(201);
            });

            it('Failed game is not playing', async () => {
                  await chessCommonService.surrender(boardId, player1);
                  const res = await reqApi({ roomId: boardId });
                  const getBoard = await chessCommonService.getBoard(boardId);

                  expect(getBoard.status).not.toBe(ChessStatus.DRAW);
                  expect(res.status).toBe(403);
            });
      });

      describe('PUT /surrender', () => {
            let user1: User, user2: User;
            let newCookie: string[];
            let boardId: string;
            let player1: ChessPlayer;
            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  user2 = await generateFakeUser();
                  boardId = await chessCommonService.createNewGame(user1);
                  await chessCommonService.joinGame(boardId, user2);

                  const getBoard = await chessCommonService.getBoard(boardId);
                  await chessCommonService.toggleReadyStatePlayer(boardId, getBoard.users[0]);
                  await chessCommonService.toggleReadyStatePlayer(boardId, getBoard.users[1]);

                  await chessCommonService.startGame(boardId);
                  player1 = getBoard.users[0];
                  newCookie = generateCookie(await authService.createReToken(user1));
            });
            const reqApi = (input: ChessRoomIdDTO) =>
                  supertest(app.getHttpServer()).put('/api/chess/surrender').set({ cookie: newCookie }).send(input);

            it('Pass', async () => {
                  const res = await reqApi({ roomId: boardId });
                  expect(res.status).toBe(200);
            });
            it('Failed game is end', async () => {
                  await chessCommonService.surrender(boardId, player1);
                  const res = await reqApi({ roomId: boardId });

                  expect(res.status).toBe(403);
            });
      });

      describe('Post /restart', () => {
            let user1: User, user2: User;
            let newCookie: string[];
            let boardId: string;
            let player1: ChessPlayer;
            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  user2 = await generateFakeUser();
                  boardId = await chessCommonService.createNewGame(user1);
                  await chessCommonService.joinGame(boardId, user2);

                  const getBoard = await chessCommonService.getBoard(boardId);
                  await chessCommonService.toggleReadyStatePlayer(boardId, getBoard.users[0]);
                  await chessCommonService.toggleReadyStatePlayer(boardId, getBoard.users[1]);
                  await chessCommonService.startGame(boardId);
                  player1 = getBoard.users[0];
                  await chessCommonService.surrender(boardId, player1);
                  newCookie = generateCookie(await authService.createReToken(user1));
            });
            const reqApi = (input: ChessRoomIdDTO) =>
                  supertest(app.getHttpServer()).post('/api/chess/restart').set({ cookie: newCookie }).send(input);

            it('Pass', async () => {
                  const res = await reqApi({ roomId: boardId });
                  expect(res.body.data.roomId).toBeDefined();
                  expect(res.status).toBe(201);
            });
      });

      describe('POST /choose-piece', () => {
            let user1: User, user2: User;
            let newCookie: string[];
            let boardId: string;

            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  user2 = await generateFakeUser();
                  boardId = await chessCommonService.createNewGame(user1);
                  await chessCommonService.joinGame(boardId, user2);
                  const getBoard = await chessCommonService.getBoard(boardId);

                  await chessCommonService.toggleReadyStatePlayer(boardId, getBoard.users[0]);
                  await chessCommonService.toggleReadyStatePlayer(boardId, getBoard.users[1]);

                  await chessCommonService.startGame(boardId);

                  newCookie = generateCookie(await authService.createReToken(user1));
            });

            const reqApi = (input: ChessChooseAPieceDTO) =>
                  supertest(app.getHttpServer()).post('/api/chess/choose-piece').set({ cookie: newCookie }).send(input);

            it('Pass', async () => {
                  const res = await reqApi({ roomId: boardId, x: 3, y: 1 });
                  expect(res.body.data?.length).toBe(2);
            });

            it('Pass no valid move', async () => {
                  const res = await reqApi({ roomId: boardId, x: 0, y: 0 });
                  expect(res.body.data?.length).toBe(0);
            });

            it('Failed choose empty square', async () => {
                  const res = await reqApi({ roomId: boardId, x: 3, y: 2 });
                  expect(res.status).toBe(400);
            });

            it('Failed choose enemy piece', async () => {
                  const res = await reqApi({ roomId: boardId, x: 3, y: 6 });
                  expect(res.status).toBe(400);
            });

            it('Failed board is not PLAYING', async () => {
                  const board = await chessCommonService.getBoard(boardId);
                  board.status = ChessStatus.NOT_YET;
                  await chessCommonService.setBoard(board);
                  const res = await reqApi({ roomId: boardId, x: 3, y: 2 });
                  expect(res.status).toBe(403);
            });
      });

      describe('PUT /draw', () => {
            let user1: User, user2: User;
            let newCookie: string[];
            let boardId: string;
            let player1: ChessPlayer;
            let player2: ChessPlayer;

            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  user2 = await generateFakeUser();
                  boardId = await chessCommonService.createNewGame(user1);
                  await chessCommonService.joinGame(boardId, user2);
                  const getBoard = await chessCommonService.getBoard(boardId);
                  await chessCommonService.toggleReadyStatePlayer(boardId, getBoard.users[0]);
                  await chessCommonService.toggleReadyStatePlayer(boardId, getBoard.users[1]);
                  await chessCommonService.startGame(boardId);
                  player1 = getBoard.users[0];
                  player2 = getBoard.users[1];
                  newCookie = generateCookie(await authService.createReToken(user2));
            });

            const reqApi = (input: DrawDto) => supertest(app.getHttpServer()).put('/api/chess/draw').set({ cookie: newCookie }).send(input);

            it('Pass', async () => {
                  await chessCommonService.createDrawRequest(boardId, player1);
                  const res = await reqApi({ roomId: boardId, isAccept: true });
                  const getBoard = await chessCommonService.getBoard(boardId);

                  expect(getBoard.status).toBe(ChessStatus.END);
                  expect(res.status).toBe(200);
            });
            it('Pass', async () => {
                  await chessCommonService.createDrawRequest(boardId, player1);
                  const res = await reqApi({ roomId: boardId, isAccept: false });
                  const getBoard = await chessCommonService.getBoard(boardId);

                  expect(getBoard.status).toBe(ChessStatus.PLAYING);
                  expect(res.status).toBe(200);
            });
            it('Failed user accept their request', async () => {
                  await chessCommonService.createDrawRequest(boardId, player2);
                  const res = await reqApi({ roomId: boardId, isAccept: true });
                  const getBoard = await chessCommonService.getBoard(boardId);

                  expect(getBoard.status).toBe(ChessStatus.DRAW);
                  expect(res.status).toBe(403);
                  expect(res.status).toBe(403);
            });

            it('Failed other user does not create draw  request', async () => {
                  const res = await reqApi({ roomId: boardId, isAccept: true });
                  const getBoard = await chessCommonService.getBoard(boardId);

                  expect(getBoard.status).toBe(ChessStatus.PLAYING);
                  expect(res.status).toBe(403);
            });
      });

      describe('PUT /leave', () => {
            let user1: User, user2: User;
            let newCookie: string[];
            let boardId: string;
            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  user2 = await generateFakeUser();
                  boardId = await chessCommonService.createNewGame(user1);
                  await chessCommonService.joinGame(boardId, user2);
                  const getBoard = await chessCommonService.getBoard(boardId);

                  await chessCommonService.toggleReadyStatePlayer(boardId, getBoard.users[0]);
                  await chessCommonService.toggleReadyStatePlayer(boardId, getBoard.users[1]);

                  newCookie = generateCookie(await authService.createReToken(user1));
            });

            const reqApi = (input: ChessRoomIdDTO) => supertest(app.getHttpServer()).put('/api/chess/leave').set({ cookie: newCookie }).send(input);

            it('Failed game not found', async () => {
                  const res = await reqApi({ roomId: 'hello' });

                  expect(res.status).toBe(404);
            });

            it('Pass when game playing', async () => {
                  await chessCommonService.startGame(boardId);
                  const res = await reqApi({ roomId: boardId });
                  const getBoard = await chessCommonService.getBoard(boardId);

                  expect(getBoard.users.length).toBe(2);
                  expect(getBoard.status).toBe(ChessStatus.END);
                  expect(getBoard.winner).toBe(PlayerFlagEnum.BLACK);
                  expect(res.status).toBe(200);
            });
            it('Pass when game is not playing', async () => {
                  const res = await reqApi({ roomId: boardId });
                  const getBoard = await chessCommonService.getBoard(boardId);

                  expect(getBoard.users.length).toBe(1);
                  expect(getBoard.status).toBe(ChessStatus.NOT_YET);
                  expect(getBoard.winner).toBe(PlayerFlagEnum.EMPTY);
                  expect(res.status).toBe(200);
            });
      });

      describe('PUT /add-move', () => {
            let user1: User, user2: User;
            let newCookie1: string[];
            let newCookie2: string[];
            let boardId: string;
            let boardBotId: string;
            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  user2 = await generateFakeUser();
                  boardId = await chessCommonService.createNewGame(user1);
                  await chessCommonService.joinGame(boardId, user2);

                  const getBoard = await chessCommonService.getBoard(boardId);
                  await chessCommonService.toggleReadyStatePlayer(boardId, getBoard.users[0]);
                  await chessCommonService.toggleReadyStatePlayer(boardId, getBoard.users[1]);

                  await chessCommonService.startGame(boardId);

                  newCookie1 = generateCookie(await authService.createReToken(user1));
                  newCookie2 = generateCookie(await authService.createReToken(user2));
            });

            const reqApi1 = (input: ChessAddMoveDto) =>
                  supertest(app.getHttpServer()).put('/api/chess/add-move').set({ cookie: newCookie1 }).send(input);
            const reqApi2 = (input: ChessAddMoveDto) =>
                  supertest(app.getHttpServer()).put('/api/chess/add-move').set({ cookie: newCookie2 }).send(input);

            it('Pass', async () => {
                  let getBoard = await chessCommonService.getBoard(boardId);
                  getBoard.turn = false;
                  await chessCommonService.setBoard(getBoard);

                  const res = await reqApi1({
                        roomId: boardId,
                        curPos: {
                              x: 1,
                              y: 1,
                        },
                        desPos: {
                              x: 1,
                              y: 3,
                        },
                  });

                  getBoard = await chessCommonService.getBoard(boardId);
                  expect(res.status).toBe(200);

                  expect(getBoard.board[1][3].chessRole).toBe(ChessRole.PAWN);
                  expect(getBoard.board[1][3].flag).toBe(PlayerFlagEnum.WHITE);
            });

            it('Pass', async () => {
                  let getBoard = await chessCommonService.getBoard(boardId);
                  getBoard.turn = true;
                  await chessCommonService.setBoard(getBoard);

                  const res = await reqApi2({
                        roomId: boardId,
                        curPos: {
                              x: 6,
                              y: 6,
                        },
                        desPos: {
                              x: 6,
                              y: 5,
                        },
                  });

                  getBoard = await chessCommonService.getBoard(boardId);
                  expect(res.status).toBe(200);

                  expect(getBoard.board[6][5].chessRole).toBe(ChessRole.PAWN);
                  expect(getBoard.board[6][5].flag).toBe(PlayerFlagEnum.BLACK);
            });

            it('Failed wrong turn', async () => {
                  const getBoard = await chessCommonService.getBoard(boardId);
                  getBoard.turn = true;
                  await chessCommonService.setBoard(getBoard);

                  const res = await reqApi1({
                        roomId: boardId,
                        curPos: {
                              x: 1,
                              y: 1,
                        },
                        desPos: {
                              x: 1,
                              y: 3,
                        },
                  });

                  expect(res.status).toBe(400);
            });

            it('Failed invalid destination square', async () => {
                  const getBoard = await chessCommonService.getBoard(boardId);
                  getBoard.turn = true;
                  await chessCommonService.setBoard(getBoard);
                  const res = await reqApi1({
                        roomId: boardId,
                        curPos: {
                              x: 5,
                              y: 1,
                        },
                        desPos: {
                              x: 5,
                              y: 4,
                        },
                  });
                  expect(res.status).toBe(400);
            });

            it('Failed wrong current square', async () => {
                  const getBoard = await chessCommonService.getBoard(boardId);
                  getBoard.turn = false;
                  await chessCommonService.setBoard(getBoard);
                  const res = await reqApi1({
                        roomId: boardId,
                        curPos: {
                              x: 5,
                              y: 6,
                        },
                        desPos: {
                              x: 5,
                              y: 4,
                        },
                  });
                  expect(res.status).toBe(400);
            });

            it('Failed choose empty square', async () => {
                  const getBoard = await chessCommonService.getBoard(boardId);
                  getBoard.turn = false;
                  await chessCommonService.setBoard(getBoard);
                  const res = await reqApi1({
                        roomId: boardId,
                        curPos: {
                              x: 3,
                              y: 3,
                        },
                        desPos: {
                              x: 4,
                              y: 4,
                        },
                  });
                  expect(res.status).toBe(400);
            });

            it('Failed board is not PLAYING', async () => {
                  const board = await chessCommonService.getBoard(boardId);
                  board.status = ChessStatus.NOT_YET;
                  await chessCommonService.setBoard(board);
                  const res = await reqApi1({
                        roomId: boardId,
                        curPos: {
                              x: 1,
                              y: 1,
                        },
                        desPos: {
                              x: 1,
                              y: 3,
                        },
                  });
                  expect(res.status).toBe(403);
            });

            it('Add a promote move', async () => {
                  const mySpy = jest.spyOn(chessService, 'isPromotePawn').mockImplementation(() => Promise.resolve(true));
                  const res = await reqApi1({
                        roomId: boardId,
                        curPos: {
                              x: 1,
                              y: 1,
                        },
                        desPos: {
                              x: 1,
                              y: 3,
                        },
                  });
                  expect(res.status).toBe(200);
                  mySpy.mockClear();
            });

            it('Bot mode', async () => {
                  boardBotId = await chessCommonService.createNewGame(user1, true);
                  const getBoardBot = await chessCommonService.getBoard(boardBotId);
                  await chessCommonService.toggleReadyStatePlayer(boardBotId, getBoardBot.users[0]);
                  await chessCommonService.toggleReadyStatePlayer(boardBotId, getBoardBot.users[1]);
                  await chessCommonService.startGame(boardBotId);

                  const res = await reqApi1({
                        roomId: boardBotId,
                        curPos: {
                              x: 1,
                              y: 1,
                        },
                        desPos: {
                              x: 1,
                              y: 3,
                        },
                  });
                  expect(res.status).toBe(200);
            });
      });

      describe('GET /quick-join-room', () => {
            let user: User;
            let cookie: string[];
            let boardIds: string[];

            beforeEach(async () => {
                  user = await generateFakeUser();
                  const boardId = await chessCommonService.createNewGame(user, false);
                  const player = await chessCommonService.findUser(boardId, user.id);
                  await chessCommonService.leaveGame(boardId, player);

                  boardIds = await chessCommonService.getAllBoard();
                  cookie = generateCookie(await authService.createReToken(user));
            });

            const reqApi = (cookie: string[]) => supertest(app.getHttpServer()).get('/api/chess/quick-join-room').set({ cookie });

            it('room one user', async () => {
                  for (let i = 0; i < boardIds.length; i++) {
                        const board = await chessCommonService.getBoard(boardIds[i]);
                        if (board) {
                              if (board.users.length === 0) await redisService.deleteByKey(`chess-${board.id}`);
                        }
                  }
                  const res = await reqApi(cookie);

                  const getBoard = await chessCommonService.getBoard(res.body.data.roomId);
                  const isExistUser = await chessCommonService.findUser(getBoard.id, user.id);

                  expect(res.status).toBe(200);
                  expect(isExistUser).toBeDefined();
                  expect(getBoard).toBeDefined();
                  expect(getBoard.users[1].id).toBe(user.id);
            });

            it('empty room', async () => {
                  const boardIds = await chessCommonService.getAllBoard();

                  for (let i = 0; i < boardIds.length; i++) {
                        const board = await chessCommonService.getBoard(boardIds[i]);
                        if (board) {
                              if (board.users.length === 1) await redisService.deleteByKey(`chess-${board.id}`);
                        }
                  }

                  const res = await reqApi(cookie);
                  const getBoard = await chessCommonService.getBoard(res.body.data.roomId);
                  const isExistUser = await chessCommonService.findUser(getBoard.id, user.id);

                  expect(res.status).toBe(200);
                  expect(isExistUser).toBeDefined();
                  expect(getBoard).toBeDefined();
                  expect(getBoard.users[0].id).toBe(user.id);
            });

            it('no room available', async () => {
                  const boardIds = await chessCommonService.getAllBoard();
                  for (const boardId of boardIds) {
                        await redisService.deleteByKey(`chess-${boardId}`);
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
