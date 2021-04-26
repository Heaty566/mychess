import { INestApplication } from '@nestjs/common';

//---- Helper
import { initTestModule } from '../../test/initTest';

//---- Service
import { TicTacToeCommonService } from '../ticTacToeCommon.service';

//---- Entity
import { User } from '../../users/entities/user.entity';
import { TicTacToe } from '../entity/ticTacToe.entity';
import { TicTacToeService } from '../ticTacToe.service';
import { TicTacToeRepository } from '../entity/ticTacToe.repository';
import { RedisService } from '../../providers/redis/redis.service';
import { TicTacToeBoard } from '../entity/ticTacToeBoard.entity';
import { TicTacToeStatus } from '../entity/ticTacToeStatus';
import { TicTacToeMove } from '../entity/ticTacToeMove.entity';
import { TicTacToeMoveRepository } from '../entity/ticTacToeMove.repository';
//---- Repository

describe('ticTacToeService', () => {
      let app: INestApplication;
      let user1: User;
      let user2: User;
      let ticTacToeService: TicTacToeService;
      let resetDB: any;
      let ticTacToeRepository: TicTacToeRepository;
      let generateFakeUser: () => Promise<User>;
      let redisService: RedisService;
      let tTTGame: TicTacToe;
      let ticTacToeMoveRepository: TicTacToeMoveRepository;
      beforeAll(async () => {
            const { users, getApp, module, resetDatabase, getFakeUser } = await initTestModule();
            app = getApp;

            resetDB = resetDatabase;
            generateFakeUser = getFakeUser;

            ticTacToeService = module.get<TicTacToeService>(TicTacToeService);
            ticTacToeRepository = module.get<TicTacToeRepository>(TicTacToeRepository);
            ticTacToeMoveRepository = module.get<TicTacToeMoveRepository>(TicTacToeMoveRepository);
            redisService = module.get<RedisService>(RedisService);
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

            tTTGame = await ticTacToeRepository.save(ticTicToe);
      });

      describe('loadGameToCache', () => {
            it('Pass get correct', async () => {
                  const res = await ticTacToeService.loadGameToCache(tTTGame.id);
                  const board = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);
                  expect(board).toBeDefined();
                  expect(res).toBeTruthy();
                  expect(board.info.id).toBe(tTTGame.id);
            });
            it('Failed no found', async () => {
                  const res = await ticTacToeService.loadGameToCache('ttt-no-found');
                  const board = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);
                  expect(board).toBeNull();
                  expect(res).toBeFalsy();
            });

            it('Failed game end', async () => {
                  tTTGame.status = TicTacToeStatus.END;
                  const updateTTT = await ticTacToeRepository.save(tTTGame);
                  const res = await ticTacToeService.loadGameToCache(`ttt-${updateTTT.id}`);
                  const board = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);
                  expect(board).toBeNull();
                  expect(res).toBeFalsy();
            });

            it('Failed game playing', async () => {
                  tTTGame.status = TicTacToeStatus.PLAYING;
                  const updateTTT = await ticTacToeRepository.save(tTTGame);
                  const res = await ticTacToeService.loadGameToCache(`ttt-${updateTTT.id}`);
                  const board = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);
                  expect(board).toBeNull();
                  expect(res).toBeFalsy();
            });
      });

      describe('getBoard', () => {
            it('Pass get correct', async () => {
                  const res = await ticTacToeService.loadGameToCache(tTTGame.id);
                  const board = await ticTacToeService.getBoard(`ttt-${tTTGame.id}`);
                  expect(board).toBeDefined();
                  expect(res).toBeTruthy();
                  expect(board.info.id).toBe(tTTGame.id);
            });
            it('Failed no found', async () => {
                  const board = await ticTacToeService.getBoard(`ttt-hello-world`);
                  expect(board).toBeNull();
            });
      });

      describe('startGame', () => {
            it('Pass start game', async () => {
                  await ticTacToeService.loadGameToCache(tTTGame.id);
                  const isReadToPlay = await ticTacToeService.startGame(`ttt-${tTTGame.id}`, user1);
                  const board = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);
                  expect(board.info.status).toBe(TicTacToeStatus.PLAYING);
                  expect(isReadToPlay).toBeTruthy();
            });

            it('Failed wrong user', async () => {
                  await ticTacToeService.loadGameToCache(tTTGame.id);
                  const isReadToPlay = await ticTacToeService.startGame(`ttt-${tTTGame.id}`, await generateFakeUser());
                  const board = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);
                  expect(board.info.status).toBe(TicTacToeStatus['NOT-YET']);
                  expect(isReadToPlay).toBeFalsy();
            });
      });

      describe('addMoveToBoard', () => {
            it('Pass user 1 play', async () => {
                  await ticTacToeService.loadGameToCache(tTTGame.id);
                  await ticTacToeService.startGame(`ttt-${tTTGame.id}`, user1);
                  console.log(user1.id);
                  console.log(user2.id);
                  const addToBoard = await ticTacToeService.addMoveToBoard(`ttt-${tTTGame.id}`, user1, 0, 0);
                  const board = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);
                  expect(addToBoard).toBeTruthy();
                  expect(board.board[0][0]).toBe(0);
                  console.log('------------------');
            });
            it('Pass user 2 play', async () => {
                  await ticTacToeService.loadGameToCache(tTTGame.id);
                  await ticTacToeService.startGame(`ttt-${tTTGame.id}`, user1);
                  console.log(user1.id);
                  console.log(user2.id);
                  const addToBoard = await ticTacToeService.addMoveToBoard(`ttt-${tTTGame.id}`, user2, 0, 0);
                  const board = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);
                  expect(addToBoard).toBeTruthy();
                  expect(board.board[0][0]).toBe(1);
            });
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
