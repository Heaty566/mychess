import { INestApplication } from '@nestjs/common';

//---- Helper
import { initTestModule } from '../../test/initTest';

//---- Service
import { ChessCommonService } from '../chessCommon.service';

//---- Entity
import { User } from '../../user/entities/user.entity';
import { ChessBoard } from '../../chess/entity/chessBoard.entity';
import { ChessPlayer, ChessStatus, EloCalculator, PlayerFlagEnum } from '../entity/chess.interface';
import { Chess } from '../entity/chess.entity';

//---- Repository
import { ChessRepository } from '../entity/chess.repository';

describe('chessCommonService', () => {
      let app: INestApplication;
      let resetDB: any;
      let generateFakeUser: () => Promise<User>;
      let chessCommonService: ChessCommonService;
      let chessRepository: ChessRepository;
      beforeAll(async () => {
            const { getApp, module, resetDatabase, getFakeUser } = await initTestModule();
            app = getApp;
            resetDB = resetDatabase;
            generateFakeUser = getFakeUser;
            chessCommonService = module.get<ChessCommonService>(ChessCommonService);
            chessRepository = module.get<ChessRepository>(ChessRepository);
      });

      describe('getAllBoardByUserId', () => {
            let user1: User;

            beforeEach(async () => {
                  user1 = await generateFakeUser();
            });
            it('Pass nothing', async () => {
                  const getBoard = await chessCommonService.getAllBoardByUserId(user1.id);

                  expect(getBoard.boards.length).toBe(0);
            });

            it('Pass two game', async () => {
                  const ttt1 = new Chess();
                  ttt1.users = [user1];
                  await chessRepository.save(ttt1);
                  const ttt2 = new Chess();
                  ttt2.users = [user1];
                  await chessRepository.save(ttt2);

                  const getBoard = await chessCommonService.getAllBoardByUserId(user1.id);
                  expect(getBoard.boards.length).toBe(2);
                  expect(getBoard.totalWin).toBe(0);
                  expect(getBoard.count).toBe(2);
            });
            it('Pass two game, one win', async () => {
                  const ttt1 = new Chess();
                  ttt1.users = [user1];
                  ttt1.winner = PlayerFlagEnum.WHITE;
                  await chessRepository.save(ttt1);
                  const ttt2 = new Chess();
                  ttt2.users = [user1];
                  await chessRepository.save(ttt2);

                  const getBoard = await chessCommonService.getAllBoardByUserId(user1.id);
                  expect(getBoard.boards.length).toBe(2);
                  expect(getBoard.totalWin).toBe(1);
                  expect(getBoard.count).toBe(2);
            });
      });

      describe('createNewGame', () => {
            let user: User;
            beforeEach(async () => {
                  user = await generateFakeUser();
            });

            it('Pass User with user', async () => {
                  const boardId = await chessCommonService.createNewGame(user);
                  const getBoard = await chessCommonService.getBoard(boardId);
                  expect(getBoard).toBeDefined();
                  expect(getBoard.users[0].id).toBe(user.id);
                  expect(getBoard.users[1]).toBeUndefined();
            });

            it('Pass User with bot', async () => {
                  const boardId = await chessCommonService.createNewGame(user, true);
                  const getBoard = await chessCommonService.getBoard(boardId);
                  expect(getBoard).toBeDefined();
                  expect(getBoard.users[0].id).toBe(user.id);
                  expect(getBoard.users[1].name).toBe('BOT');
            });
      });

      describe('findUser', () => {
            let boardId: string;
            let user: User;
            beforeEach(async () => {
                  user = await generateFakeUser();
                  boardId = await chessCommonService.createNewGame(user);
            });

            it('Pass', async () => {
                  const getUser = await chessCommonService.findUser(boardId, user.id);
                  expect(getUser).toBeDefined();
            });

            it('Failed user not found', async () => {
                  const fakeUser = await generateFakeUser();
                  const getUser = await chessCommonService.findUser(boardId, fakeUser.id);
                  expect(getUser).toBeUndefined();
            });

            it('Failed wrong bot', async () => {
                  const getUser = await chessCommonService.findUser('hello', user.id);
                  expect(getUser).toBeUndefined();
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

      describe('draw', () => {
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
            });

            it('Pass user not accept draw', async () => {
                  await chessCommonService.draw(boardId, false);
                  const getBoard = await chessCommonService.getBoard(boardId);

                  expect(getBoard.status).toBe(ChessStatus.PLAYING);
                  expect(getBoard.winner).toBe(PlayerFlagEnum.EMPTY);
            });

            it('Pass user allow accept draw', async () => {
                  await chessCommonService.draw(boardId, true);
                  const getBoard = await chessCommonService.getBoard(boardId);

                  expect(getBoard.status).toBe(ChessStatus.END);
                  expect(getBoard.winner).toBe(PlayerFlagEnum.EMPTY);
            });
            it('Failed wrong id ', async () => {
                  const isDraw = await chessCommonService.draw('hello', true);

                  expect(isDraw).toBeFalsy();
            });
      });

      describe('createDrawRequests', () => {
            let user1: User, user2: User;
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
            });

            it('Pass user not accept draw', async () => {
                  await chessCommonService.createDrawRequest(boardId, player1);
                  const getBoard = await chessCommonService.getBoard(boardId);

                  expect(getBoard.status).toBe(ChessStatus.DRAW);
                  expect(getBoard.winner).toBe(PlayerFlagEnum.EMPTY);
            });

            it('Failed wrong id ', async () => {
                  const isDraw = await chessCommonService.createDrawRequest('hello', player1);

                  expect(isDraw).toBeFalsy();
            });
      });

      describe('saveChessFromCacheToDb', () => {
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
                  await chessCommonService.surrender(boardId, getBoard.users[0]);
            });

            it('Pass user not accept draw', async () => {
                  const chess = await chessCommonService.saveChessFromCacheToDb(boardId);
                  const getBoard = await chessCommonService.getBoard(boardId);

                  expect(chess).toBeDefined();
                  expect(getBoard.status).toBe(ChessStatus.END);
            });

            it('Failed wrong id ', async () => {
                  const isDraw = await chessCommonService.saveChessFromCacheToDb('hello');

                  expect(isDraw).toBeUndefined();
            });
      });

      describe('leaveGame', () => {
            let user1: User, user2: User;
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
                  player1 = getBoard.users[0];
            });

            it('Pass user1 leave when game playing', async () => {
                  await chessCommonService.startGame(boardId);
                  const isLeave = await chessCommonService.leaveGame(boardId, player1);
                  const getBoard = await chessCommonService.getBoard(boardId);

                  expect(isLeave).toBeDefined();
                  expect(getBoard.status).toBe(ChessStatus.END);
                  expect(getBoard.winner).toBe(PlayerFlagEnum.BLACK);
            });

            it('Pass user1 leave when game not playing', async () => {
                  const isLeave = await chessCommonService.leaveGame(boardId, player1);
                  const getBoard = await chessCommonService.getBoard(boardId);

                  expect(isLeave).toBeDefined();
                  expect(getBoard.status).toBe(ChessStatus.NOT_YET);
                  expect(getBoard.winner).toBe(PlayerFlagEnum.EMPTY);
            });

            it('Failed game is end', async () => {
                  await chessCommonService.surrender(boardId, player1);
                  const isLeave = await chessCommonService.leaveGame(boardId, player1);
                  const getBoard = await chessCommonService.getBoard(boardId);

                  expect(isLeave).toBeFalsy();
                  expect(getBoard.status).toBe(ChessStatus.END);
                  expect(getBoard.winner).not.toBe(PlayerFlagEnum.EMPTY);
            });

            it('Failed wrong id ', async () => {
                  const isDraw = await chessCommonService.leaveGame('hello', player1);

                  expect(isDraw).toBeFalsy();
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
            it('Failed wrong id', async () => {
                  const getBoard = await chessCommonService.getBoard(boardId);
                  const isReady = await chessCommonService.toggleReadyStatePlayer('hello', getBoard.users[1]);

                  expect(isReady).toBeFalsy();
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
                  player1.elo = 2100;
                  player2.elo = 2200;
                  const result: EloCalculator = chessCommonService.calculateElo(PlayerFlagEnum.BLACK, player1, player2);
                  expect(result).toBeDefined();
            });

            it('Test 3', () => {
                  player1.elo = 2500;
                  player2.elo = 2200;
                  const result: EloCalculator = chessCommonService.calculateElo(PlayerFlagEnum.EMPTY, player1, player2);
                  expect(result).toBeDefined();
            });

            it('Test 4', () => {
                  player1.elo = 2500;
                  player2.elo = 2600;
                  const result: EloCalculator = chessCommonService.calculateElo(PlayerFlagEnum.EMPTY, player1, player2);
                  expect(result).toBeDefined();
            });
      });

      describe('restartGame', () => {
            let user1: User, user2: User;
            let boardId: string;

            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  user2 = await generateFakeUser();
                  boardId = await chessCommonService.createNewGame(user1);
                  await chessCommonService.joinGame(boardId, user2);
                  await chessCommonService.startGame(boardId);
                  const getBoard = await chessCommonService.getBoard(boardId);
                  await chessCommonService.surrender(boardId, getBoard.users[0]);
            });

            it('Pass ', async () => {
                  const newGameId = await chessCommonService.restartGame(boardId);
                  const getBoard = await chessCommonService.getBoard(newGameId);

                  expect(getBoard).toBeDefined();
                  expect(getBoard.users[1].id).toBe(user1.id);
            });

            it('Failed wrong id ', async () => {
                  const newGameId = await chessCommonService.restartGame('hello');

                  expect(newGameId).toBeUndefined();
            });
      });

      describe('getAllBoard', () => {
            let user1: User, user2: User, user3: User;

            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  user2 = await generateFakeUser();
                  user3 = await generateFakeUser();
                  const boardId1 = await chessCommonService.createNewGame(user1);
                  const boardId2 = await chessCommonService.createNewGame(user2);
                  const boardId3 = await chessCommonService.createNewGame(user3);
            });

            it('Pass', async () => {
                  const result = await chessCommonService.getAllBoard();
                  expect(result).toBeDefined();
                  expect(result.length).toBeGreaterThan(2);
            });
      });

      describe('quickJoinRoom', () => {
            let user1: User, user2: User, user3: User;

            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  user2 = await generateFakeUser();
                  user3 = await generateFakeUser();
                  const boardId1 = await chessCommonService.createNewGame(user1);
                  const boardId2 = await chessCommonService.createNewGame(user2);
                  const boardId3 = await chessCommonService.createNewGame(user3);
            });

            it('Pass', async () => {
                  const result = await chessCommonService.quickJoinRoom();

                  expect(result).toBeDefined();
            });
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
