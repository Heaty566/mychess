import { INestApplication } from '@nestjs/common';

//---- Helper
import { initTestModule } from '../../test/initTest';

//---- Service
import { ChessCommonService } from '../chessCommon.service';

//---- Entity
import User from '../../user/entities/user.entity';
import { ChessBoard } from '../../chess/entity/chessBoard.entity';
import { ChessPlayer, ChessStatus, EloCalculator, PlayerFlagEnum } from '../entity/chess.interface';
import { ChessService } from '../chess.service';

describe('chessCommonService', () => {
      let app: INestApplication;
      let resetDB: any;
      let generateFakeUser: () => Promise<User>;
      let chessCommonService: ChessCommonService;
      beforeAll(async () => {
            const { getApp, module, resetDatabase, getFakeUser } = await initTestModule();
            app = getApp;
            resetDB = resetDatabase;
            generateFakeUser = getFakeUser;
            chessCommonService = module.get<ChessCommonService>(ChessCommonService);
      });

      describe('getBoard', () => {
            let boardId: string;
            beforeEach(async () => {
                  boardId = await chessCommonService.createNewGame(await generateFakeUser());
            });

            it('Pass', async () => {
                  const board = await chessCommonService.getBoard(boardId);
                  expect(board).toBeDefined();
                  expect(board.id).toBe(boardId);
            });

            it('Failed no found', async () => {
                  const board = await chessCommonService.getBoard('chess-hai-dep-trai');
                  expect(board).toBeNull();
            });
      });

      describe('setBoard', () => {
            let board: ChessBoard;
            let boardId: string;
            beforeEach(async () => {
                  boardId = await chessCommonService.createNewGame(await generateFakeUser());
                  board = await chessCommonService.getBoard(boardId);
            });

            it('Pass', async () => {
                  board.status = ChessStatus.PLAYING;
                  await chessCommonService.setBoard(board);
                  const newUpdate = await chessCommonService.getBoard(boardId);
                  expect(newUpdate).toBeDefined();
                  expect(newUpdate.status).toBe(ChessStatus.PLAYING);
            });
      });

      describe('isExistUser', () => {
            let boardId: string;
            let user: User;
            beforeEach(async () => {
                  user = await generateFakeUser();
                  boardId = await chessCommonService.createNewGame(user);
            });

            it('Pass', async () => {
                  const getUser = await chessCommonService.isExistUser(boardId, user.id);
                  expect(getUser).toBeDefined();
            });

            it('Failed not found', async () => {
                  const fakeUser = await generateFakeUser();
                  const getUser = await chessCommonService.isExistUser(boardId, fakeUser.id);
                  expect(getUser).toBeUndefined();
            });
      });

      describe('joinGame', () => {
            let boardId: string;
            let user1: User, user2: User;
            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  boardId = await chessCommonService.createNewGame(user1);
            });

            it('Pass user2 join', async () => {
                  user2 = await generateFakeUser();
                  await chessCommonService.joinGame(boardId, user2);
                  const getBoard = await chessCommonService.getBoard(boardId);

                  expect(getBoard.users[1].id).toBe(user2.id);
            });

            it('Failed join wrong id', async () => {
                  user2 = await generateFakeUser();
                  await chessCommonService.joinGame('haideptrai', user2);
                  const getBoard = await chessCommonService.getBoard(boardId);

                  expect(getBoard.users.length).toBe(1);
            });
      });

      describe('createNewGame', () => {
            let user: User;
            beforeEach(async () => {
                  user = await generateFakeUser();
            });

            it('Pass User', async () => {
                  const boardId = await chessCommonService.createNewGame(user);
                  const getBoard = await chessCommonService.getBoard(boardId);
                  expect(getBoard).toBeDefined();
                  expect(getBoard.users[0].id).toBe(user.id);
                  expect(getBoard.users[1]).toBeUndefined();
            });
      });

      describe('startGame', () => {
            let user1: User, user2: User;
            let boardId: string;

            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  user2 = await generateFakeUser();
                  boardId = await chessCommonService.createNewGame(user1);
                  await chessCommonService.joinGame(boardId, user2);
            });

            it('Pass start with 2 ready', async () => {
                  const getBoard = await chessCommonService.getBoard(boardId);
                  await chessCommonService.toggleReadyStatePlayer(boardId, getBoard.users[0]);
                  await chessCommonService.toggleReadyStatePlayer(boardId, getBoard.users[1]);
                  const isStart = await chessCommonService.startGame(boardId);
                  const getBoardAfter = await chessCommonService.getBoard(boardId);
                  expect(isStart).toBeTruthy();
                  expect(getBoard.status).toBe(ChessStatus.NOT_YET);
                  expect(getBoardAfter.status).toBe(ChessStatus.PLAYING);
            });

            it('Failed start with 1 ready', async () => {
                  const getBoard = await chessCommonService.getBoard(boardId);
                  await chessCommonService.toggleReadyStatePlayer(boardId, getBoard.users[0]);
                  const isStart = await chessCommonService.startGame(boardId);
                  const getBoardAfter = await chessCommonService.getBoard(boardId);
                  expect(isStart).toBeFalsy();
                  expect(getBoard.status).toBe(ChessStatus.NOT_YET);
                  expect(getBoardAfter.status).toBe(ChessStatus.NOT_YET);
            });
      });

      describe('leaveGame', () => {
            let player1: ChessPlayer;
            let player2: ChessPlayer;
            let chessId: string;

            beforeEach(async () => {
                  const user = await generateFakeUser();
                  chessId = await chessCommonService.createNewGame(user, true);
                  await chessCommonService.joinGame(chessId, await generateFakeUser());
                  const getBoard = await chessCommonService.getBoard(chessId);
                  await chessCommonService.toggleReadyStatePlayer(chessId, getBoard.users[0]);
                  await chessCommonService.toggleReadyStatePlayer(chessId, getBoard.users[1]);

                  player1 = getBoard.users[0];
                  player2 = getBoard.users[1];
            });

            it('Pass player 1 leave when game playing', async () => {
                  await chessCommonService.startGame(chessId);
                  await chessCommonService.leaveGame(chessId, player1);
                  const getBoard = await chessCommonService.getBoard(chessId);

                  expect(getBoard.status).toBe(ChessStatus.END);
                  expect(getBoard.winner).toBe(PlayerFlagEnum.BLACK);
            });

            it('Pass player 1 leave', async () => {
                  await chessCommonService.leaveGame(chessId, player1);
                  const getBoard = await chessCommonService.getBoard(chessId);

                  expect(getBoard.status).toBe(ChessStatus.NOT_YET);
                  expect(getBoard.users.length).toBe(1);
                  expect(getBoard.winner).toBe(PlayerFlagEnum.EMPTY);
            });

            it('Pass player 2 leave when game playing', async () => {
                  await chessCommonService.startGame(chessId);
                  await chessCommonService.leaveGame(chessId, player2);
                  const getBoard = await chessCommonService.getBoard(chessId);

                  expect(getBoard.status).toBe(ChessStatus.END);
                  expect(getBoard.winner).toBe(PlayerFlagEnum.WHITE);
            });

            it('Pass player 2 leave when game end', async () => {
                  await chessCommonService.startGame(chessId);
                  await chessCommonService.surrender(chessId, player2);
                  await chessCommonService.leaveGame(chessId, player1);
                  const getBoard = await chessCommonService.getBoard(chessId);

                  expect(getBoard.status).toBe(ChessStatus.END);
                  expect(getBoard.winner).toBe(PlayerFlagEnum.WHITE);
            });

            it('Pass player 2 leave', async () => {
                  await chessCommonService.leaveGame(chessId, player2);
                  const getBoard = await chessCommonService.getBoard(chessId);

                  expect(getBoard.status).toBe(ChessStatus.NOT_YET);
                  expect(getBoard.users.length).toBe(1);
                  expect(getBoard.winner).toBe(PlayerFlagEnum.EMPTY);
            });

            it('wrong board id ', async () => {
                  await chessCommonService.leaveGame('hello', player2);
                  const getBoard = await chessCommonService.getBoard(chessId);

                  expect(getBoard.status).toBe(ChessStatus.NOT_YET);
                  expect(getBoard.users.length).toBe(2);
                  expect(getBoard.winner).toBe(PlayerFlagEnum.EMPTY);
            });
      });

      describe('toggleReadyStatePlayer', () => {
            let boardId: string;
            let user1: User, user2: User;

            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  user2 = await generateFakeUser();
                  boardId = await chessCommonService.createNewGame(user1);
                  await chessCommonService.joinGame(boardId, user2);
            });

            it('Pass 1 ready', async () => {
                  const getBoard = await chessCommonService.getBoard(boardId);
                  await chessCommonService.toggleReadyStatePlayer(boardId, getBoard.users[0]);
                  const getBoardAfter = await chessCommonService.getBoard(boardId);

                  expect(getBoardAfter.users[0].ready).toBeTruthy();
            });

            it('Pass 2 ready', async () => {
                  const getBoard = await chessCommonService.getBoard(boardId);
                  await chessCommonService.toggleReadyStatePlayer(boardId, getBoard.users[1]);
                  const getBoardAfter = await chessCommonService.getBoard(boardId);

                  expect(getBoardAfter.users[1].ready).toBeTruthy();
            });
      });

      describe('surrender', () => {
            let player1: ChessPlayer, player2: ChessPlayer;
            let user1: User, user2: User;
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
                  player1 = getBoard.users[0];
                  player2 = getBoard.users[1];
            });

            it('Pass player1 surrender', async () => {
                  await chessCommonService.surrender(boardId, player1);
                  const getBoard = await chessCommonService.getBoard(boardId);

                  expect(getBoard.status).toBe(ChessStatus.END);
                  expect(getBoard.winner).toBe(PlayerFlagEnum.BLACK);
            });

            it('Pass player2 surrender', async () => {
                  await chessCommonService.surrender(boardId, player2);
                  const getBoard = await chessCommonService.getBoard(boardId);

                  expect(getBoard.status).toBe(ChessStatus.END);
                  expect(getBoard.winner).toBe(PlayerFlagEnum.WHITE);
            });

            it('Failed wron id', async () => {
                  await chessCommonService.surrender('haideptrai', player2);
                  const getBoard = await chessCommonService.getBoard(boardId);

                  expect(getBoard.status).toBe(ChessStatus.PLAYING);
                  expect(getBoard.winner).toBe(PlayerFlagEnum.EMPTY);
            });
      });

      describe('calculateElo', () => {
            let player1: ChessPlayer, player2: ChessPlayer;
            let user1: User, user2: User;
            let boardId: string;

            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  user2 = await generateFakeUser();
                  boardId = await chessCommonService.createNewGame(user1);
                  await chessCommonService.joinGame(boardId, user2);
                  const getBoard = await chessCommonService.getBoard(boardId);
                  player1 = getBoard.users[0];
                  player2 = getBoard.users[1];
            });

            it('Test 1', () => {
                  player1.elo = 1600;
                  player2.elo = 1800;
                  const result: EloCalculator = chessCommonService.calculateElo(PlayerFlagEnum.WHITE, player1, player2);
                  expect(result).toBeDefined();
            });

            it('Test 2', () => {
                  player1.elo = 1600;
                  player2.elo = 1800;
                  const result: EloCalculator = chessCommonService.calculateElo(PlayerFlagEnum.BLACK, player1, player2);
                  expect(result).toBeDefined();
            });

            it('Test 3', () => {
                  player1.elo = 1600;
                  player2.elo = 1800;
                  const result: EloCalculator = chessCommonService.calculateElo(PlayerFlagEnum.EMPTY, player1, player2);
                  expect(result).toBeDefined();
            });
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
