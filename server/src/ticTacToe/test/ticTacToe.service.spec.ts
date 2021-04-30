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
import { TicTacToeStatus } from '../entity/ticTacToe.interface';
import { getManager } from 'typeorm';
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
                  const res = await ticTacToeService.loadGameToCache(updateTTT.id);
                  const board = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);
                  expect(board).toBeNull();
                  expect(res).toBeFalsy();
            });

            it('Failed game playing', async () => {
                  tTTGame.status = TicTacToeStatus.PLAYING;
                  const updateTTT = await ticTacToeRepository.save(tTTGame);
                  const res = await ticTacToeService.loadGameToCache(updateTTT.id);
                  const board = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);
                  expect(board).toBeNull();
                  expect(res).toBeFalsy();
            });
      });

      describe('getBoard', () => {
            it('Pass get correct', async () => {
                  const res = await ticTacToeService.loadGameToCache(tTTGame.id);
                  const board = await ticTacToeService.getBoard(tTTGame.id);
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
                  const isJoinUser1 = await ticTacToeService.joinGame(tTTGame.id, user1);
                  const isJoinUser2 = await ticTacToeService.joinGame(tTTGame.id, user2);
                  const getBoard = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);

                  expect(getBoard.users[0].id).toBe(user1.id);
                  expect(getBoard.users[1].id).toBe(user2.id);
                  expect(isJoinUser1).toBeTruthy();
                  expect(isJoinUser2).toBeTruthy();
            });

            it('Pass join user2 user1', async () => {
                  await ticTacToeService.loadGameToCache(tTTGame.id);
                  const isJoinUser1 = await ticTacToeService.joinGame(tTTGame.id, user2);
                  const isJoinUser2 = await ticTacToeService.joinGame(tTTGame.id, user1);
                  const getBoard = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);

                  expect(getBoard.users[1].id).toBe(user1.id);
                  expect(getBoard.users[0].id).toBe(user2.id);
                  expect(isJoinUser1).toBeTruthy();
                  expect(isJoinUser2).toBeTruthy();
            });

            it('Failed user already join this room', async () => {
                  await ticTacToeService.loadGameToCache(tTTGame.id);
                  const isJoinFistTime = await ticTacToeService.joinGame(tTTGame.id, user1);
                  const isJoinSecondTime = await ticTacToeService.joinGame(tTTGame.id, user1);
                  const getBoard = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);

                  expect(getBoard.users[0].id).toBe(user1.id);
                  expect(getBoard.users[1].id).toBeNull();

                  expect(isJoinFistTime).toBeTruthy();
                  expect(isJoinSecondTime).toBeFalsy();
            });

            it('Failed user full', async () => {
                  const user3 = await generateFakeUser();

                  await ticTacToeService.loadGameToCache(tTTGame.id);
                  const isJoinUser1 = await ticTacToeService.joinGame(tTTGame.id, user1);
                  const isJoinUser2 = await ticTacToeService.joinGame(tTTGame.id, user2);
                  const isJoinUser3 = await ticTacToeService.joinGame(tTTGame.id, user3);
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
                  await ticTacToeService.joinGame(tTTGame.id, user1);
                  await ticTacToeService.joinGame(tTTGame.id, user2);
            });

            it('Pass join user1 user2 and user1 leave', async () => {
                  const isLeaveUser1 = await ticTacToeService.leaveGame(tTTGame.id, user1);
                  const getBoard = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);

                  expect(getBoard.users[0].id).toBeNull();
                  expect(getBoard.users[1].id).toBe(user2.id);
                  expect(isLeaveUser1).toBeTruthy();
            });

            it('Pass join user2 user1 and user2 leave', async () => {
                  const isLeaveUser2 = await ticTacToeService.leaveGame(tTTGame.id, user2);
                  const getBoard = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);

                  expect(getBoard.users[0].id).toBe(user1.id);
                  expect(getBoard.users[1].id).toBeNull();
                  expect(isLeaveUser2).toBeTruthy();
            });

            it('Pass user2 user1 leave', async () => {
                  const isLeaveUser1 = await ticTacToeService.leaveGame(tTTGame.id, user1);
                  const isLeaveUser2 = await ticTacToeService.leaveGame(tTTGame.id, user2);
                  const getBoard = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);

                  const getGame = await ticTacToeRepository.createQueryBuilder().select().where('id = :id', { id: tTTGame.id }).getOne();

                  expect(getBoard).toBeNull();
                  expect(getGame).toBeUndefined();
                  expect(isLeaveUser1).toBeTruthy();
                  expect(isLeaveUser2).toBeTruthy();
            });

            it('Failed user1 leave and user2 is ready', async () => {
                  const isReadyUser2 = await ticTacToeService.toggleReadyStatePlayer(tTTGame.id, user2);
                  const getBoardBefore = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);
                  const isLeaveUser1 = await ticTacToeService.leaveGame(tTTGame.id, user1);

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

                  const isLeaveUser3 = await ticTacToeService.leaveGame(tTTGame.id, user3);
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
                  await ticTacToeService.joinGame(tTTGame.id, user1);
                  await ticTacToeService.joinGame(tTTGame.id, user2);
            });

            it('Pass ready user1 user2', async () => {
                  const isReadyUser1 = await ticTacToeService.toggleReadyStatePlayer(tTTGame.id, user1);
                  const isReadyUser2 = await ticTacToeService.toggleReadyStatePlayer(tTTGame.id, user2);

                  const getBoard = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);

                  expect(isReadyUser1).toBeTruthy();
                  expect(isReadyUser2).toBeTruthy();
                  expect(getBoard.users[0].ready).toBeTruthy();
                  expect(getBoard.users[1].ready).toBeTruthy();
            });

            it('Pass ready user2 ', async () => {
                  const isReadyUser2 = await ticTacToeService.toggleReadyStatePlayer(tTTGame.id, user2);
                  const getBoard = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);

                  expect(isReadyUser2).toBeTruthy();
                  expect(getBoard.users[0].ready).toBeFalsy();
                  expect(getBoard.users[1].ready).toBeTruthy();
            });
            it('Pass ready user2 and turn not ready after ', async () => {
                  const isReadyUser2_1th = await ticTacToeService.toggleReadyStatePlayer(tTTGame.id, user2);
                  const getBoardBeFore = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);
                  const isReadyUser2_2nd = await ticTacToeService.toggleReadyStatePlayer(tTTGame.id, user2);
                  const getBoardAfter = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);

                  expect(isReadyUser2_1th).toBeTruthy();
                  expect(isReadyUser2_2nd).toBeTruthy();
                  expect(getBoardBeFore.users[1].ready).toBeTruthy();
                  expect(getBoardAfter.users[1].ready).toBeFalsy();
            });

            it('Failed only one user ', async () => {
                  await ticTacToeService.leaveGame(tTTGame.id, user1);
                  const isReadyUser2 = await ticTacToeService.toggleReadyStatePlayer(tTTGame.id, user2);
                  const getBoard = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);
                  expect(isReadyUser2).toBeFalsy();
                  expect(getBoard.users[0].ready).toBeFalsy();
                  expect(getBoard.users[1].ready).toBeFalsy();
            });

            it('Failed user does not join before', async () => {
                  const user3 = await generateFakeUser();
                  await ticTacToeService.loadGameToCache(tTTGame.id);
                  const isReadyUser3 = await ticTacToeService.toggleReadyStatePlayer(tTTGame.id, user3);
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
                  await ticTacToeService.joinGame(tTTGame.id, user1);
                  await ticTacToeService.joinGame(tTTGame.id, user2);
            });

            it('Pass ', async () => {
                  const isReadyUser1 = await ticTacToeService.toggleReadyStatePlayer(tTTGame.id, user1);
                  const isReadyUser2 = await ticTacToeService.toggleReadyStatePlayer(tTTGame.id, user2);
                  const isPlay = await ticTacToeService.startGame(tTTGame.id, user2);

                  const getBoard = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);

                  expect(getBoard.info.status).toBe(TicTacToeStatus.PLAYING);
                  expect(isReadyUser1).toBeTruthy();
                  expect(isReadyUser2).toBeTruthy();
                  expect(getBoard.users[0].ready).toBeTruthy();
                  expect(getBoard.users[1].ready).toBeTruthy();
                  expect(isPlay).toBeTruthy();
            });
            it('Failed not found ', async () => {
                  const isReadyUser1 = await ticTacToeService.toggleReadyStatePlayer(tTTGame.id, user1);
                  const isReadyUser2 = await ticTacToeService.toggleReadyStatePlayer(tTTGame.id, user2);
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
                  const isReadyUser1 = await ticTacToeService.toggleReadyStatePlayer(tTTGame.id, user1);
                  const isReadyUser2 = await ticTacToeService.toggleReadyStatePlayer(tTTGame.id, user2);
                  const isPlay = await ticTacToeService.startGame(tTTGame.id, user3);
                  const getBoard = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);

                  expect(getBoard.info.status).toBe(TicTacToeStatus['NOT-YET']);

                  expect(isReadyUser1).toBeTruthy();
                  expect(isReadyUser2).toBeTruthy();
                  expect(getBoard.users[0].ready).toBeTruthy();
                  expect(getBoard.users[1].ready).toBeTruthy();
                  expect(isPlay).toBeFalsy();
            });

            it('Failed one of them is not ready yet ', async () => {
                  const isReadyUser1 = await ticTacToeService.toggleReadyStatePlayer(tTTGame.id, user1);
                  const isPlay = await ticTacToeService.startGame(tTTGame.id, user1);
                  const getBoard = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);

                  expect(isReadyUser1).toBeTruthy();
                  expect(getBoard.users[0].ready).toBeTruthy();
                  expect(getBoard.users[1].ready).toBeFalsy();
                  expect(isPlay).toBeFalsy();
                  expect(getBoard.info.status).toBe(TicTacToeStatus['NOT-YET']);
            });
      });

      describe('addMoveToBoard', () => {
            beforeEach(async () => {
                  await ticTacToeService.loadGameToCache(tTTGame.id);
                  await ticTacToeService.joinGame(tTTGame.id, user1);
                  await ticTacToeService.joinGame(tTTGame.id, user2);
                  await ticTacToeService.toggleReadyStatePlayer(tTTGame.id, user1);
                  await ticTacToeService.toggleReadyStatePlayer(tTTGame.id, user2);
                  await ticTacToeService.startGame(tTTGame.id, user2);
            });

            it('Pass User1 add ', async () => {
                  const beforeBoardUpdate = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);
                  beforeBoardUpdate.currentTurn = true;
                  await redisService.setObjectByKey(`ttt-${tTTGame.id}`, beforeBoardUpdate);
                  const isAddMove = await ticTacToeService.addMoveToBoard(tTTGame.id, user1, 0, 0);
                  const afterBoardUpdate = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);

                  expect(afterBoardUpdate.info.status).toBe(TicTacToeStatus.PLAYING);
                  expect(afterBoardUpdate.board[0][0]).toBe(afterBoardUpdate.users[0].flag);
                  expect(afterBoardUpdate.currentTurn).toBeFalsy();
                  expect(isAddMove).toBeTruthy();
            });
            it('Pass User2 add ', async () => {
                  const beforeBoardUpdate = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);
                  beforeBoardUpdate.currentTurn = false;
                  await redisService.setObjectByKey(`ttt-${tTTGame.id}`, beforeBoardUpdate);
                  const isAddMove = await ticTacToeService.addMoveToBoard(tTTGame.id, user2, 0, 0);
                  const afterBoardUpdate = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);

                  expect(afterBoardUpdate.info.status).toBe(TicTacToeStatus.PLAYING);
                  expect(isAddMove).toBeTruthy();
                  expect(afterBoardUpdate.board[0][0]).toBe(afterBoardUpdate.users[1].flag);
                  expect(afterBoardUpdate.currentTurn).toBeTruthy();
            });

            it('Pass User2 wrong turn ', async () => {
                  const beforeBoardUpdate = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);
                  beforeBoardUpdate.currentTurn = true;
                  await redisService.setObjectByKey(`ttt-${tTTGame.id}`, beforeBoardUpdate);
                  const isAddMove = await ticTacToeService.addMoveToBoard(tTTGame.id, user2, 0, 0);
                  const afterBoardUpdate = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);

                  expect(afterBoardUpdate.info.status).toBe(TicTacToeStatus.PLAYING);
                  expect(isAddMove).toBeFalsy();
                  expect(afterBoardUpdate.board[0][0]).not.toBe(afterBoardUpdate.users[1].flag);
                  expect(afterBoardUpdate.currentTurn).toBeTruthy();
            });

            it('Failed User2 add exist position ', async () => {
                  const beforeBoardUpdate = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);
                  beforeBoardUpdate.board[1][1] = 0;
                  beforeBoardUpdate.currentTurn = false;
                  await redisService.setObjectByKey(`ttt-${tTTGame.id}`, beforeBoardUpdate);
                  const isAddMove = await ticTacToeService.addMoveToBoard(tTTGame.id, user2, 1, 1);
                  const afterBoardUpdate = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);

                  expect(afterBoardUpdate.info.status).toBe(TicTacToeStatus.PLAYING);
                  expect(isAddMove).toBeFalsy();
                  expect(afterBoardUpdate.board[1][1]).not.toBe(afterBoardUpdate.users[1].flag);
                  expect(afterBoardUpdate.currentTurn).toBeFalsy();
            });

            it('Failed User is not a player ', async () => {
                  const user3 = await generateFakeUser();
                  const isAddMove = await ticTacToeService.addMoveToBoard(tTTGame.id, user3, 0, 0);

                  const getBoard = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);
                  expect(getBoard.info.status).toBe(TicTacToeStatus.PLAYING);
                  expect(getBoard.board[0][0]).toBe(-1);
                  expect(isAddMove).toBeFalsy();
            });

            it('Failed Game is not playing yet ', async () => {
                  const ticTicToe = new TicTacToe();
                  ticTicToe.users = [user1, user2];
                  const newTicTac = await ticTacToeRepository.save(ticTicToe);
                  await ticTacToeService.loadGameToCache(newTicTac.id);
                  const isAddMove = await ticTacToeService.addMoveToBoard(newTicTac.id, user2, 0, 0);

                  const getBoard = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${newTicTac.id}`);
                  expect(getBoard.info.status).toBe(TicTacToeStatus['NOT-YET']);
                  expect(getBoard.board[0][0]).toBe(-1);
                  expect(isAddMove).toBeFalsy();
            });

            it('Failed not found ', async () => {
                  const isAddMove = await ticTacToeService.addMoveToBoard(`ttt-hello-world`, user2, 0, 0);

                  const getBoard = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);
                  expect(getBoard.board[0][0]).toBe(-1);
                  expect(isAddMove).toBeFalsy();
            });
      });

      describe('isWin', () => {
            beforeEach(async () => {
                  await ticTacToeService.loadGameToCache(tTTGame.id);
                  await ticTacToeService.joinGame(tTTGame.id, user1);
                  await ticTacToeService.joinGame(tTTGame.id, user2);
                  await ticTacToeService.toggleReadyStatePlayer(tTTGame.id, user1);
                  await ticTacToeService.toggleReadyStatePlayer(tTTGame.id, user2);
                  await ticTacToeService.startGame(tTTGame.id, user2);
            });

            it('Pass diagonal left to right, top to bottom ', async () => {
                  const beforeBoardUpdate = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);
                  beforeBoardUpdate.board[0][0] = 1;
                  beforeBoardUpdate.board[1][1] = 1;
                  beforeBoardUpdate.board[2][2] = 1;
                  beforeBoardUpdate.board[3][3] = 1;
                  beforeBoardUpdate.board[4][4] = 1;
                  await redisService.setObjectByKey(`ttt-${tTTGame.id}`, beforeBoardUpdate);
                  const isWin = await ticTacToeService.isWin(tTTGame.id);
                  const afterBoardUpdate = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);

                  expect(afterBoardUpdate.info.status).toBe(TicTacToeStatus.END);
                  expect(afterBoardUpdate.info.winner).toBe(afterBoardUpdate.users[1].flag);
                  expect(isWin).toBeTruthy();
            });

            it('Failed diagonal left to right, top to bottom  miss one', async () => {
                  const beforeBoardUpdate = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);
                  beforeBoardUpdate.board[0][0] = 1;
                  beforeBoardUpdate.board[1][1] = 0;
                  beforeBoardUpdate.board[2][2] = 1;
                  beforeBoardUpdate.board[3][3] = 1;
                  beforeBoardUpdate.board[4][4] = 1;
                  await redisService.setObjectByKey(`ttt-${tTTGame.id}`, beforeBoardUpdate);
                  const isWin = await ticTacToeService.isWin(tTTGame.id);
                  const afterBoardUpdate = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);

                  expect(afterBoardUpdate.info.status).toBe(TicTacToeStatus.PLAYING);
                  expect(afterBoardUpdate.info.winner).toBe(-1);
                  expect(isWin).toBeFalsy();
            });
            it('Pass diagonal left to right, bottom to top ', async () => {
                  const beforeBoardUpdate = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);
                  beforeBoardUpdate.board[0][4] = 0;
                  beforeBoardUpdate.board[1][3] = 0;
                  beforeBoardUpdate.board[2][2] = 0;
                  beforeBoardUpdate.board[3][1] = 0;
                  beforeBoardUpdate.board[4][0] = 0;
                  await redisService.setObjectByKey(`ttt-${tTTGame.id}`, beforeBoardUpdate);
                  const isWin = await ticTacToeService.isWin(tTTGame.id);
                  const afterBoardUpdate = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);

                  expect(afterBoardUpdate.info.status).toBe(TicTacToeStatus.END);
                  expect(afterBoardUpdate.info.winner).toBe(afterBoardUpdate.users[0].flag);
                  expect(isWin).toBeTruthy();
            });

            it('Failed diagonal left to right, bottom to top miss one', async () => {
                  const beforeBoardUpdate = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);
                  beforeBoardUpdate.board[0][4] = 0;
                  beforeBoardUpdate.board[1][3] = -1;
                  beforeBoardUpdate.board[2][2] = 0;
                  beforeBoardUpdate.board[3][1] = 0;
                  beforeBoardUpdate.board[4][0] = 0;
                  await redisService.setObjectByKey(`ttt-${tTTGame.id}`, beforeBoardUpdate);
                  const isWin = await ticTacToeService.isWin(tTTGame.id);
                  const afterBoardUpdate = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);

                  expect(afterBoardUpdate.info.status).toBe(TicTacToeStatus.PLAYING);
                  expect(afterBoardUpdate.info.winner).toBe(-1);
                  expect(isWin).toBeFalsy();
            });
            it('Pass diagonal left to right', async () => {
                  const beforeBoardUpdate = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);
                  beforeBoardUpdate.board[0][0] = 0;
                  beforeBoardUpdate.board[1][0] = 0;
                  beforeBoardUpdate.board[2][0] = 0;
                  beforeBoardUpdate.board[3][0] = 0;
                  beforeBoardUpdate.board[4][0] = 0;
                  await redisService.setObjectByKey(`ttt-${tTTGame.id}`, beforeBoardUpdate);
                  const isWin = await ticTacToeService.isWin(tTTGame.id);
                  const afterBoardUpdate = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);

                  expect(afterBoardUpdate.info.status).toBe(TicTacToeStatus.END);
                  expect(afterBoardUpdate.info.winner).toBe(afterBoardUpdate.users[0].flag);
                  expect(isWin).toBeTruthy();
            });

            it('Failed diagonal left to right miss one', async () => {
                  const beforeBoardUpdate = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);
                  beforeBoardUpdate.board[0][0] = 0;
                  beforeBoardUpdate.board[1][0] = -1;
                  beforeBoardUpdate.board[2][0] = 0;
                  beforeBoardUpdate.board[3][0] = 0;
                  beforeBoardUpdate.board[4][0] = 0;
                  await redisService.setObjectByKey(`ttt-${tTTGame.id}`, beforeBoardUpdate);
                  const isWin = await ticTacToeService.isWin(tTTGame.id);
                  const afterBoardUpdate = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);

                  expect(afterBoardUpdate.info.status).toBe(TicTacToeStatus.PLAYING);
                  expect(afterBoardUpdate.info.winner).toBe(-1);
                  expect(isWin).toBeFalsy();
            });

            it('Pass diagonal top to bottom', async () => {
                  const beforeBoardUpdate = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);
                  beforeBoardUpdate.board[0][0] = 0;
                  beforeBoardUpdate.board[0][1] = 0;
                  beforeBoardUpdate.board[0][2] = 0;
                  beforeBoardUpdate.board[0][3] = 0;
                  beforeBoardUpdate.board[0][4] = 0;
                  await redisService.setObjectByKey(`ttt-${tTTGame.id}`, beforeBoardUpdate);
                  const isWin = await ticTacToeService.isWin(tTTGame.id);
                  const afterBoardUpdate = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);

                  expect(afterBoardUpdate.info.status).toBe(TicTacToeStatus.END);
                  expect(afterBoardUpdate.info.winner).toBe(afterBoardUpdate.users[0].flag);
                  expect(isWin).toBeTruthy();
            });

            it('Failed diagonal top to bottom miss one', async () => {
                  const beforeBoardUpdate = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);
                  beforeBoardUpdate.board[0][0] = 0;
                  beforeBoardUpdate.board[0][1] = -1;
                  beforeBoardUpdate.board[0][2] = 0;
                  beforeBoardUpdate.board[0][3] = 0;
                  beforeBoardUpdate.board[0][4] = 0;
                  await redisService.setObjectByKey(`ttt-${tTTGame.id}`, beforeBoardUpdate);
                  const isWin = await ticTacToeService.isWin(tTTGame.id);
                  const afterBoardUpdate = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);

                  expect(afterBoardUpdate.info.status).toBe(TicTacToeStatus.PLAYING);
                  expect(afterBoardUpdate.info.winner).toBe(-1);
                  expect(isWin).toBeFalsy();
            });

            it('Failed Game is not playing yet ', async () => {
                  const ticTicToe = new TicTacToe();
                  ticTicToe.users = [user1, user2];
                  const newTicTac = await ticTacToeRepository.save(ticTicToe);
                  await ticTacToeService.loadGameToCache(newTicTac.id);
                  const isWin = await ticTacToeService.isWin(newTicTac.id);

                  const getBoard = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${newTicTac.id}`);
                  expect(getBoard.info.status).toBe(TicTacToeStatus['NOT-YET']);
                  expect(isWin).toBeFalsy();
            });

            it('Failed not found ', async () => {
                  const isWin = await ticTacToeService.isWin(`ttt-hello-world`);

                  expect(isWin).toBeFalsy();
            });
      });

      describe('updateToDatabase', () => {
            beforeEach(async () => {
                  await ticTacToeService.loadGameToCache(tTTGame.id);
                  await ticTacToeService.joinGame(tTTGame.id, user1);
                  await ticTacToeService.joinGame(tTTGame.id, user2);
                  await ticTacToeService.toggleReadyStatePlayer(tTTGame.id, user1);
                  await ticTacToeService.toggleReadyStatePlayer(tTTGame.id, user2);
                  await ticTacToeService.startGame(tTTGame.id, user2);
                  const beforeBoardUpdate = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);
                  beforeBoardUpdate.board[0][0] = 1;
                  beforeBoardUpdate.board[1][1] = 1;
                  beforeBoardUpdate.board[2][2] = 1;
                  beforeBoardUpdate.board[3][3] = 1;
                  beforeBoardUpdate.board[4][4] = 1;
                  beforeBoardUpdate.board[5][5] = 0;
                  await redisService.setObjectByKey(`ttt-${tTTGame.id}`, beforeBoardUpdate);
                  await ticTacToeService.isWin(tTTGame.id);
            });

            it('Pass', async () => {
                  const isUpdate = await ticTacToeService.updateToDatabase(tTTGame.id);
                  const afterBoardUpdate = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);
                  const getGame = await ticTacToeRepository
                        .createQueryBuilder('tic')
                        .leftJoinAndSelect('tic.users', 'user')
                        .leftJoinAndSelect('tic.moves', 'tic-tac-toe-move')
                        .where('tic.id = :id', { id: tTTGame.id })
                        .getOne();

                  expect(getGame).toBeDefined();
                  expect(getGame.status).toBe(TicTacToeStatus.END);
                  expect(getGame.endDate).toBeDefined();
                  expect(getGame.users).toHaveLength(2);
                  expect(getGame.winner).toBe(1);
                  expect(getGame.moves.length).toBeGreaterThanOrEqual(5);
                  expect(afterBoardUpdate.info.status).toBe(TicTacToeStatus.END);
                  expect(isUpdate).toBeTruthy();
            });

            it('Failed Game is playing ', async () => {
                  const beforeBoardUpdate = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);
                  beforeBoardUpdate.info.status = TicTacToeStatus.PLAYING;
                  await redisService.setObjectByKey(`ttt-${tTTGame.id}`, beforeBoardUpdate);

                  const isUpdate = await ticTacToeService.updateToDatabase(tTTGame.id);

                  const getBoard = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${tTTGame.id}`);
                  expect(getBoard.info.status).toBe(TicTacToeStatus.PLAYING);
                  expect(isUpdate).toBeFalsy();
            });

            it('Failed not found ', async () => {
                  const isUpdate = await ticTacToeService.updateToDatabase(`ttt-hello-world`);

                  expect(isUpdate).toBeFalsy();
            });
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
