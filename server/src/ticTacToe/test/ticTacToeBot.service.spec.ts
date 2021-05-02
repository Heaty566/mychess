import { INestApplication } from '@nestjs/common';

//---- Helper
import { initTestModule } from '../../test/initTest';

//---- Entity
import { User } from '../../users/entities/user.entity';
import { TicTacToe } from '../entity/ticTacToe.entity';
import { TicTacToeMove } from '../entity/ticTacToeMove.entity';

//---- Service
import { TicTacToeService } from '../ticTacToe.service';
import { RedisService } from '../../providers/redis/redis.service';
import { TicTacToeBotService } from '../ticTacToeBot.service';
import { TicTacToeCommonService } from '../ticTacToeCommon.service';
//---- Repository
import { TicTacToeRepository } from '../entity/ticTacToe.repository';
import { TicTacToeMoveRepository } from '../entity/ticTacToeMove.repository';

describe('ticTacToeBotService', () => {
      let app: INestApplication;
      let user1: User;
      let user2: User;
      let ticTacToeService: TicTacToeService;
      let resetDB: any;
      let ticTacToeRepository: TicTacToeRepository;
      let generateFakeUser: () => Promise<User>;
      let redisService: RedisService;
      let ticTacToeBotService: TicTacToeBotService;
      let ticTacToeMoveRepository: TicTacToeMoveRepository;
      let ticTacToeCommonService: TicTacToeCommonService;

      beforeAll(async () => {
            const { getApp, module, resetDatabase, getFakeUser } = await initTestModule();
            app = getApp;

            resetDB = resetDatabase;
            generateFakeUser = getFakeUser;

            ticTacToeService = module.get<TicTacToeService>(TicTacToeService);
            ticTacToeRepository = module.get<TicTacToeRepository>(TicTacToeRepository);
            ticTacToeMoveRepository = module.get<TicTacToeMoveRepository>(TicTacToeMoveRepository);
            redisService = module.get<RedisService>(RedisService);
            ticTacToeBotService = module.get<TicTacToeBotService>(TicTacToeBotService);
            ticTacToeCommonService = module.get<TicTacToeCommonService>(TicTacToeCommonService);
      });

      beforeEach(async () => {
            user1 = await generateFakeUser();
            user2 = await generateFakeUser();
            const newMove = new TicTacToeMove();
            newMove.x = 1;
            newMove.y = 1;
            newMove.flag = 1;
            const move = await ticTacToeMoveRepository.save(newMove);
            const ticTicToe = new TicTacToe();
            ticTicToe.users = [user1, user2];
            ticTicToe.moves = [move];

            await ticTacToeRepository.save(ticTicToe);
      });

      describe('findBestMove', () => {
            let boardGame: TicTacToe;
            beforeEach(async () => {
                  const ticTicToe = new TicTacToe();
                  boardGame = await ticTacToeRepository.save(ticTicToe);
                  await ticTacToeService.loadGameToCache(boardGame.id);
                  await ticTacToeService.joinGame(`ttt-${boardGame.id}`, user1);
                  await ticTacToeService.joinGame(`ttt-${boardGame.id}`, user2);
                  await ticTacToeService.toggleReadyStatePlayer(`ttt-${boardGame.id}`, user1);
                  await ticTacToeService.toggleReadyStatePlayer(`ttt-${boardGame.id}`, user2);
                  await ticTacToeService.startGame(`ttt-${boardGame.id}`, user2);
            });

            it('Pass', async () => {
                  const getBoardGame = await ticTacToeCommonService.getBoard(boardGame.id);
                  getBoardGame.board[0][0] = 0;
                  getBoardGame.board[0][2] = 0;
                  await ticTacToeCommonService.setBoard(boardGame.id, getBoardGame);
                  const afterBoardUpdate = await ticTacToeCommonService.getBoard(boardGame.id);

                  const botBestMove = await ticTacToeBotService.findBestMove(afterBoardUpdate.board, 0);
                  const userBestMove = await ticTacToeBotService.findBestMove(afterBoardUpdate.board, 1);
                  expect(userBestMove.point).toBe(-Infinity);
                  expect(botBestMove.point).toBe(20);
            });

            it('Pass', async () => {
                  const getBoardGame = await ticTacToeCommonService.getBoard(boardGame.id);
                  getBoardGame.board[0][0] = 0;
                  getBoardGame.board[0][2] = 0;
                  getBoardGame.board[0][3] = 0;
                  getBoardGame.board[0][4] = 0;
                  getBoardGame.board[0][5] = 1;
                  await redisService.setObjectByKey(`ttt-${boardGame.id}`, getBoardGame);
                  const afterBoardUpdate = await ticTacToeCommonService.getBoard(boardGame.id);

                  const botBestMove = await ticTacToeBotService.findBestMove(afterBoardUpdate.board, 0);
                  const userBestMove = await ticTacToeBotService.findBestMove(afterBoardUpdate.board, 1);
                  expect(userBestMove.point).toBe(10);
                  expect(botBestMove.point).toBe(40);
            });

            it('Pass', async () => {
                  const getBoardGame = await ticTacToeCommonService.getBoard(boardGame.id);

                  getBoardGame.board[0][2] = 0;
                  getBoardGame.board[0][3] = 0;
                  getBoardGame.board[0][4] = 0;
                  getBoardGame.board[3][5] = 1;
                  getBoardGame.board[3][6] = 1;
                  getBoardGame.board[3][7] = 1;
                  await redisService.setObjectByKey(`ttt-${boardGame.id}`, getBoardGame);
                  const afterBoardUpdate = await ticTacToeCommonService.getBoard(boardGame.id);

                  const botBestMove = await ticTacToeBotService.findBestMove(afterBoardUpdate.board, 0);
                  const userBestMove = await ticTacToeBotService.findBestMove(afterBoardUpdate.board, 1);
                  expect(userBestMove.point).toBe(30);
                  expect(botBestMove.point).toBe(30);
            });
            it('Pass', async () => {
                  const getBoardGame = await ticTacToeCommonService.getBoard(boardGame.id);

                  getBoardGame.board[13][2] = 0;
                  getBoardGame.board[13][3] = 0;
                  getBoardGame.board[13][4] = 0;
                  getBoardGame.board[3][13] = 1;
                  getBoardGame.board[4][13] = 1;
                  getBoardGame.board[5][13] = 1;
                  await redisService.setObjectByKey(`ttt-${boardGame.id}`, getBoardGame);
                  const afterBoardUpdate = await ticTacToeCommonService.getBoard(boardGame.id);

                  const botBestMove = await ticTacToeBotService.findBestMove(afterBoardUpdate.board, 0);
                  const userBestMove = await ticTacToeBotService.findBestMove(afterBoardUpdate.board, 1);
                  expect(userBestMove.point).toBe(30);
                  expect(botBestMove.point).toBe(30);
            });
            it('Pass', async () => {
                  const getBoardGame = await ticTacToeCommonService.getBoard(boardGame.id);

                  getBoardGame.board[13][0] = 0;
                  getBoardGame.board[13][1] = 0;
                  getBoardGame.board[13][2] = 0;
                  getBoardGame.board[13][3] = 0;
                  getBoardGame.board[0][13] = 1;
                  getBoardGame.board[1][13] = 1;
                  getBoardGame.board[2][13] = 1;
                  getBoardGame.board[3][13] = 1;
                  await redisService.setObjectByKey(`ttt-${boardGame.id}`, getBoardGame);
                  const afterBoardUpdate = await ticTacToeCommonService.getBoard(boardGame.id);

                  const botBestMove = await ticTacToeBotService.findBestMove(afterBoardUpdate.board, 0);
                  const userBestMove = await ticTacToeBotService.findBestMove(afterBoardUpdate.board, 1);
                  expect(userBestMove.point).toBe(40);
                  expect(botBestMove.point).toBe(40);
            });

            it('Pass', async () => {
                  const getBoardGame = await ticTacToeCommonService.getBoard(boardGame.id);

                  getBoardGame.board[13][0] = 0;
                  getBoardGame.board[13][1] = 0;
                  getBoardGame.board[13][2] = 1;
                  getBoardGame.board[13][3] = 0;
                  getBoardGame.board[0][13] = 0;
                  getBoardGame.board[1][13] = 1;
                  getBoardGame.board[2][13] = 1;
                  getBoardGame.board[3][13] = 1;
                  await redisService.setObjectByKey(`ttt-${boardGame.id}`, getBoardGame);
                  const afterBoardUpdate = await ticTacToeCommonService.getBoard(boardGame.id);

                  const botBestMove = await ticTacToeBotService.findBestMove(afterBoardUpdate.board, 0);
                  const userBestMove = await ticTacToeBotService.findBestMove(afterBoardUpdate.board, 1);
                  expect(userBestMove.point).toBe(30);
                  expect(botBestMove.point).toBe(10);
            });
      });

      describe('addMoveToBoardBot', () => {
            let boardGame: TicTacToe;
            beforeEach(async () => {
                  const ticTicToe = new TicTacToe();
                  boardGame = await ticTacToeRepository.save(ticTicToe);
                  await ticTacToeService.loadGameToCache(boardGame.id);
            });

            it('Pass', async () => {
                  const getBoardGameBefore = await ticTacToeCommonService.getBoard(boardGame.id);
                  await ticTacToeBotService.addMoveToBoardBot(boardGame.id, 1, 1);
                  const getBoardGameAfter = await ticTacToeCommonService.getBoard(boardGame.id);

                  expect(getBoardGameAfter).toBeDefined();
                  expect(getBoardGameAfter.currentTurn).not.toBe(getBoardGameBefore.currentTurn);
                  expect(getBoardGameAfter.board[1][1]).toBe(1);
            });
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
