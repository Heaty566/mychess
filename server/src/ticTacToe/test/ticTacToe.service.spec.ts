import { INestApplication } from '@nestjs/common';

//---- Helper
import { initTestModule } from '../../test/initTest';

//---- Service
// import { TicTacToeCommonService } from '../ticTacToeCommon.service';

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
            const { getApp, module, resetDatabase, getFakeUser } = await initTestModule();
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
                  expect((board.board[1][1] = 1));
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

      describe('joinGame', () => {
            it('Pass join user1 user2', async () => {
                  await ticTacToeService.loadGameToCache(tTTGame.id);
                  const isJoinUser1 = await ticTacToeService.joinGame(`ttt-${tTTGame.id}`, user1);
                  const isJoinUser2 = await ticTacToeService.joinGame(`ttt-${tTTGame.id}`, user2);
                  const getBoard = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);

                  expect(getBoard.users[0].id).toBe(user1.id);
                  expect(getBoard.users[1].id).toBe(user2.id);
                  expect(isJoinUser1).toBeTruthy();
                  expect(isJoinUser2).toBeTruthy();
            });

            it('Pass join user2 user1', async () => {
                  await ticTacToeService.loadGameToCache(tTTGame.id);
                  const isJoinUser1 = await ticTacToeService.joinGame(`ttt-${tTTGame.id}`, user2);
                  const isJoinUser2 = await ticTacToeService.joinGame(`ttt-${tTTGame.id}`, user1);
                  const getBoard = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);

                  expect(getBoard.users[1].id).toBe(user1.id);
                  expect(getBoard.users[0].id).toBe(user2.id);
                  expect(isJoinUser1).toBeTruthy();
                  expect(isJoinUser2).toBeTruthy();
            });

            it('Failed user already join this room', async () => {
                  await ticTacToeService.loadGameToCache(tTTGame.id);
                  const isJoinFistTime = await ticTacToeService.joinGame(`ttt-${tTTGame.id}`, user1);
                  const isJoinSecondTime = await ticTacToeService.joinGame(`ttt-${tTTGame.id}`, user1);
                  const getBoard = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);

                  expect(getBoard.users[0].id).toBe(user1.id);
                  expect(getBoard.users[1].id).toBeNull();

                  expect(isJoinFistTime).toBeTruthy();
                  expect(isJoinSecondTime).toBeFalsy();
            });

            it('Failed user full', async () => {
                  const user3 = await generateFakeUser();

                  await ticTacToeService.loadGameToCache(tTTGame.id);
                  const isJoinUser1 = await ticTacToeService.joinGame(`ttt-${tTTGame.id}`, user1);
                  const isJoinUser2 = await ticTacToeService.joinGame(`ttt-${tTTGame.id}`, user2);
                  const isJoinUser3 = await ticTacToeService.joinGame(`ttt-${tTTGame.id}`, user3);
                  const getBoard = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);
                  const userIds = getBoard.users.map((item) => item.id);

                  expect(isJoinUser1).toBeTruthy();
                  expect(isJoinUser2).toBeTruthy();
                  expect(isJoinUser3).toBeFalsy();
                  expect(userIds.includes(user3.id)).toBeFalsy();
            });

            it('Failed no found', async () => {
                  const isJoinUser1 = await ticTacToeService.joinGame(`ttt-hello-world`, user1);
                  expect(isJoinUser1).toBeFalsy();
            });
      });

      describe('leaveGame', () => {
            beforeEach(async () => {
                  await ticTacToeService.loadGameToCache(tTTGame.id);
                  await ticTacToeService.joinGame(`ttt-${tTTGame.id}`, user1);
                  await ticTacToeService.joinGame(`ttt-${tTTGame.id}`, user2);
            });

            it('Pass join user1 user2 and user1 leave', async () => {
                  const isLeaveUser1 = await ticTacToeService.leaveGame(`ttt-${tTTGame.id}`, user1);
                  const getBoard = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);

                  expect(getBoard.users[0].id).toBeNull();
                  expect(getBoard.users[1].id).toBe(user2.id);
                  expect(isLeaveUser1).toBeTruthy();
            });

            it('Pass join user2 user1 and user2 leave', async () => {
                  const isLeaveUser2 = await ticTacToeService.leaveGame(`ttt-${tTTGame.id}`, user2);
                  const getBoard = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);

                  expect(getBoard.users[0].id).toBe(user1.id);
                  expect(getBoard.users[1].id).toBeNull();
                  expect(isLeaveUser2).toBeTruthy();
            });

            it('Pass user2 user1 leave', async () => {
                  const isLeaveUser1 = await ticTacToeService.leaveGame(`ttt-${tTTGame.id}`, user1);
                  const isLeaveUser2 = await ticTacToeService.leaveGame(`ttt-${tTTGame.id}`, user2);
                  const getBoard = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);

                  const getGame = await ticTacToeRepository.createQueryBuilder().select().where('id = :id', { id: tTTGame.id }).getOne();

                  expect(getBoard).toBeNull();
                  expect(getGame).toBeUndefined();
                  expect(isLeaveUser1).toBeTruthy();
                  expect(isLeaveUser2).toBeTruthy();
            });

            it('Failed user1 leave and user2 is ready', async () => {
                  const isReadyUser2 = await ticTacToeService.toggleReadyStatePlayer(`ttt-${tTTGame.id}`, user2);
                  const getBoardBefore = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);
                  const isLeaveUser1 = await ticTacToeService.leaveGame(`ttt-${tTTGame.id}`, user1);

                  const getBoardAfter = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);

                  expect(getBoardAfter).toBeDefined();
                  expect(getBoardBefore.users[1].ready).toBeTruthy();
                  expect(getBoardAfter.users[0].ready).toBeFalsy();
                  expect(getBoardAfter.users[1].ready).toBeFalsy();
                  expect(isLeaveUser1).toBeTruthy();
                  expect(isReadyUser2).toBeTruthy();
            });

            it('Failed user3 does not join before', async () => {
                  const user3 = await generateFakeUser();

                  const isLeaveUser3 = await ticTacToeService.leaveGame(`ttt-${tTTGame.id}`, user3);
                  expect(isLeaveUser3).toBeFalsy();
            });

            it('Failed no found', async () => {
                  const isJoinUser1 = await ticTacToeService.leaveGame(`ttt-hello-world`, user1);
                  expect(isJoinUser1).toBeFalsy();
            });
      });

      describe('toggleReadyStatePlayer', () => {
            beforeEach(async () => {
                  await ticTacToeService.loadGameToCache(tTTGame.id);
                  await ticTacToeService.joinGame(`ttt-${tTTGame.id}`, user1);
                  await ticTacToeService.joinGame(`ttt-${tTTGame.id}`, user2);
            });

            it('Pass ready user1 user2', async () => {
                  const isReadyUser1 = await ticTacToeService.toggleReadyStatePlayer(`ttt-${tTTGame.id}`, user1);
                  const isReadyUser2 = await ticTacToeService.toggleReadyStatePlayer(`ttt-${tTTGame.id}`, user2);

                  const getBoard = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);

                  expect(isReadyUser1).toBeTruthy();
                  expect(isReadyUser2).toBeTruthy();
                  expect(getBoard.users[0].ready).toBeTruthy();
                  expect(getBoard.users[1].ready).toBeTruthy();
            });

            it('Pass ready user2 ', async () => {
                  const isReadyUser2 = await ticTacToeService.toggleReadyStatePlayer(`ttt-${tTTGame.id}`, user2);
                  const getBoard = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);

                  expect(isReadyUser2).toBeTruthy();
                  expect(getBoard.users[0].ready).toBeFalsy();
                  expect(getBoard.users[1].ready).toBeTruthy();
            });
            it('Pass ready user2 and turn not ready after ', async () => {
                  const isReadyUser2_1th = await ticTacToeService.toggleReadyStatePlayer(`ttt-${tTTGame.id}`, user2);
                  const getBoardBeFore = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);
                  const isReadyUser2_2nd = await ticTacToeService.toggleReadyStatePlayer(`ttt-${tTTGame.id}`, user2);
                  const getBoardAfter = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);

                  expect(isReadyUser2_1th).toBeTruthy();
                  expect(isReadyUser2_2nd).toBeTruthy();
                  expect(getBoardBeFore.users[1].ready).toBeTruthy();
                  expect(getBoardAfter.users[1].ready).toBeFalsy();
            });

            it('Failed only one user ', async () => {
                  await ticTacToeService.leaveGame(`ttt-${tTTGame.id}`, user1);
                  const isReadyUser2 = await ticTacToeService.toggleReadyStatePlayer(`ttt-${tTTGame.id}`, user2);
                  const getBoard = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);
                  expect(isReadyUser2).toBeFalsy();
                  expect(getBoard.users[0].ready).toBeFalsy();
                  expect(getBoard.users[1].ready).toBeFalsy();
            });

            it('Failed user does not join before', async () => {
                  const user3 = await generateFakeUser();
                  await ticTacToeService.loadGameToCache(tTTGame.id);
                  const isReadyUser3 = await ticTacToeService.toggleReadyStatePlayer(`ttt-${tTTGame.id}`, user3);
                  const getBoard = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);

                  expect(isReadyUser3).toBeFalsy();
                  expect(getBoard.users[0].ready).toBeFalsy();
                  expect(getBoard.users[1].ready).toBeFalsy();
            });

            it('Failed no found', async () => {
                  const isJoinUser1 = await ticTacToeService.toggleReadyStatePlayer(`ttt-hello-world`, user1);
                  expect(isJoinUser1).toBeFalsy();
            });
      });

      describe('startGame', () => {
            beforeEach(async () => {
                  await ticTacToeService.loadGameToCache(tTTGame.id);
                  await ticTacToeService.joinGame(`ttt-${tTTGame.id}`, user1);
                  await ticTacToeService.joinGame(`ttt-${tTTGame.id}`, user2);
            });

            it('Pass ', async () => {
                  const isReadyUser1 = await ticTacToeService.toggleReadyStatePlayer(`ttt-${tTTGame.id}`, user1);
                  const isReadyUser2 = await ticTacToeService.toggleReadyStatePlayer(`ttt-${tTTGame.id}`, user2);
                  const isPlay = await ticTacToeService.startGame(`ttt-${tTTGame.id}`, user2);

                  const getBoard = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);

                  expect(getBoard.info.status).toBe(TicTacToeStatus.PLAYING);
                  expect(isReadyUser1).toBeTruthy();
                  expect(isReadyUser2).toBeTruthy();
                  expect(getBoard.users[0].ready).toBeTruthy();
                  expect(getBoard.users[1].ready).toBeTruthy();
                  expect(isPlay).toBeTruthy();
            });
            it('Failed not found ', async () => {
                  const isReadyUser1 = await ticTacToeService.toggleReadyStatePlayer(`ttt-${tTTGame.id}`, user1);
                  const isReadyUser2 = await ticTacToeService.toggleReadyStatePlayer(`ttt-${tTTGame.id}`, user2);
                  const isPlay = await ticTacToeService.startGame(`ttt-hello`, user2);

                  const getBoard = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);

                  expect(getBoard.info.status).toBe(TicTacToeStatus['NOT-YET']);
                  expect(isReadyUser1).toBeTruthy();
                  expect(isReadyUser2).toBeTruthy();
                  expect(getBoard.users[0].ready).toBeTruthy();
                  expect(getBoard.users[1].ready).toBeTruthy();
                  expect(isPlay).toBeFalsy();
            });

            it('Failed not a player ', async () => {
                  const user3 = await generateFakeUser();
                  const isReadyUser1 = await ticTacToeService.toggleReadyStatePlayer(`ttt-${tTTGame.id}`, user1);
                  const isReadyUser2 = await ticTacToeService.toggleReadyStatePlayer(`ttt-${tTTGame.id}`, user2);
                  const isPlay = await ticTacToeService.startGame(`ttt-${tTTGame.id}`, user3);
                  const getBoard = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);

                  expect(getBoard.info.status).toBe(TicTacToeStatus['NOT-YET']);

                  expect(isReadyUser1).toBeTruthy();
                  expect(isReadyUser2).toBeTruthy();
                  expect(getBoard.users[0].ready).toBeTruthy();
                  expect(getBoard.users[1].ready).toBeTruthy();
                  expect(isPlay).toBeFalsy();
            });

            it('Failed one of them is not ready yet ', async () => {
                  const isReadyUser1 = await ticTacToeService.toggleReadyStatePlayer(`ttt-${tTTGame.id}`, user1);
                  const isPlay = await ticTacToeService.startGame(`ttt-${tTTGame.id}`, user1);
                  const getBoard = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);

                  expect(isReadyUser1).toBeTruthy();
                  expect(getBoard.users[0].ready).toBeTruthy();
                  expect(getBoard.users[1].ready).toBeFalsy();
                  expect(isPlay).toBeFalsy();
                  expect(getBoard.info.status).toBe(TicTacToeStatus['NOT-YET']);
            });
      });

      // describe('addMoveToBoard', () => {
      //       it('Pass user 1 play', async () => {
      //             await ticTacToeService.loadGameToCache(tTTGame.id);
      //             await ticTacToeService.startGame(`ttt-${tTTGame.id}`, user1);

      //             const addToBoard = await ticTacToeService.addMoveToBoard(`ttt-${tTTGame.id}`, user1, 0, 0);
      //             const board = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);
      //             expect(addToBoard).toBeTruthy();
      //             expect(board.board[0][0]).toBe(0);
      //       });
      //       it('Pass user 2 play', async () => {
      //             await ticTacToeService.loadGameToCache(tTTGame.id);
      //             await ticTacToeService.startGame(`ttt-${tTTGame.id}`, user1);

      //             const addToBoard = await ticTacToeService.addMoveToBoard(`ttt-${tTTGame.id}`, user2, 0, 0);
      //             const board = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);
      //             expect(addToBoard).toBeTruthy();
      //             expect(board.board[0][0]).toBe(1);
      //             console.log(await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`));
      //       });
      // });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
