import { INestApplication } from '@nestjs/common';

//---- Helper
import { initTestModule } from '../../test/initTest';

//---- Service
// import { TicTacToeCommonService } from '../ticTacToeCommon.service';

//---- Entity
import { User } from '../../users/entities/user.entity';
import { TicTacToeService } from '../ticTacToe.service';
import { TicTacToeBoard } from '../entity/ticTacToeBoard.entity';
import { TicTacToeStatus } from '../entity/ticTacToe.interface';

import { TicTacToeCommonService } from '../ticTacToeCommon.service';
//---- Repository

describe('ticTacToeService', () => {
      let app: INestApplication;
      let user1: User;
      let user2: User;
      let ticTacToeService: TicTacToeService;
      let resetDB: any;

      let generateFakeUser: () => Promise<User>;

      let tttBoard: TicTacToeBoard;

      let ticTacToeCommonService: TicTacToeCommonService;
      beforeAll(async () => {
            const { getApp, module, resetDatabase, getFakeUser } = await initTestModule();
            app = getApp;

            resetDB = resetDatabase;
            generateFakeUser = getFakeUser;

            ticTacToeService = module.get<TicTacToeService>(TicTacToeService);

            ticTacToeCommonService = module.get<TicTacToeCommonService>(TicTacToeCommonService);
      });

      beforeEach(async () => {
            user1 = await generateFakeUser();
            user2 = await generateFakeUser();
            tttBoard = await ticTacToeCommonService.createNewGame(user1, false);
      });

      describe('leaveGame', () => {
            beforeEach(async () => {
                  tttBoard.info.users.push(user2);
                  await ticTacToeCommonService.setBoard(tttBoard.id, tttBoard);
            });

            it('Pass user1 leave', async () => {
                  await ticTacToeService.leaveGame(tttBoard, user1);
                  const getBoard = await ticTacToeCommonService.getBoard(tttBoard.id);

                  expect(getBoard.info.users[0].id).toBe(user2.id);
                  expect(getBoard.info.users[1]).toBeUndefined();
            });

            it('Pass user2 leave', async () => {
                  await ticTacToeService.leaveGame(tttBoard, user2);
                  const getBoard = await ticTacToeCommonService.getBoard(tttBoard.id);

                  expect(getBoard.info.users[0].id).toBe(user1.id);
                  expect(getBoard.info.users[1]).toBeUndefined();
            });
            it('Pass user2 user1 leave', async () => {
                  await ticTacToeService.leaveGame(tttBoard, user1);
                  await ticTacToeService.leaveGame(tttBoard, user2);
                  const getBoard = await ticTacToeCommonService.getBoard(tttBoard.id);

                  expect(getBoard).toBeNull();
            });

            it('Failed user1 leave and user2 is ready', async () => {
                  await ticTacToeService.loadUser(tttBoard);
                  const isReadyUser2 = await ticTacToeService.toggleReadyStatePlayer(tttBoard, user2);
                  const getBoardBefore = await ticTacToeCommonService.getBoard(tttBoard.id);
                  await ticTacToeService.leaveGame(tttBoard, user1);
                  const getBoardAfter = await ticTacToeCommonService.getBoard(tttBoard.id);

                  expect(getBoardAfter).toBeDefined();
                  expect(getBoardBefore.users[1].ready).toBeTruthy();
                  expect(getBoardAfter.users[0].ready).toBeFalsy();
                  expect(getBoardAfter.users[1].ready).toBeFalsy();
                  expect(isReadyUser2).toBeTruthy();
            });

            it('Failed user3 leave', async () => {
                  const user3 = await generateFakeUser();
                  await ticTacToeService.loadUser(tttBoard);
                  const isReadyUser2 = await ticTacToeService.toggleReadyStatePlayer(tttBoard, user2);
                  const getBoardBefore = await ticTacToeCommonService.getBoard(tttBoard.id);
                  await ticTacToeService.leaveGame(tttBoard, user3);
                  const getBoardAfter = await ticTacToeCommonService.getBoard(tttBoard.id);

                  expect(getBoardAfter).toBeDefined();
                  expect(getBoardBefore.users[1].ready).toBeTruthy();
                  expect(getBoardAfter.users[0].ready).toBeFalsy();
                  expect(getBoardAfter.users[1].ready).toBeFalsy();
                  expect(isReadyUser2).toBeTruthy();
            });
      });

      describe('toggleReadyStatePlayer', () => {
            beforeEach(async () => {
                  tttBoard.info.users.push(user2);
                  await ticTacToeCommonService.setBoard(tttBoard.id, tttBoard);
                  await ticTacToeService.loadUser(tttBoard);
            });

            it('Pass ready user1 user2', async () => {
                  const isReadyUser1 = await ticTacToeService.toggleReadyStatePlayer(tttBoard, user1);
                  const isReadyUser2 = await ticTacToeService.toggleReadyStatePlayer(tttBoard, user2);

                  const getBoard = await ticTacToeCommonService.getBoard(tttBoard.id);

                  expect(isReadyUser1).toBeTruthy();
                  expect(isReadyUser2).toBeTruthy();
                  expect(getBoard.users[0].ready).toBeTruthy();
                  expect(getBoard.users[1].ready).toBeTruthy();
            });

            it('Pass ready user2 ', async () => {
                  const isReadyUser2 = await ticTacToeService.toggleReadyStatePlayer(tttBoard, user2);
                  const getBoard = await ticTacToeCommonService.getBoard(tttBoard.id);

                  expect(isReadyUser2).toBeTruthy();
                  expect(getBoard.users[0].ready).toBeFalsy();
                  expect(getBoard.users[1].ready).toBeTruthy();
            });
            it('Pass ready user2 and turn not ready after ', async () => {
                  const isReadyUser2_1th = await ticTacToeService.toggleReadyStatePlayer(tttBoard, user2);
                  const getBoardBeFore = await ticTacToeCommonService.getBoard(tttBoard.id);
                  const isReadyUser2_2nd = await ticTacToeService.toggleReadyStatePlayer(tttBoard, user2);
                  const getBoardAfter = await ticTacToeCommonService.getBoard(tttBoard.id);

                  expect(isReadyUser2_1th).toBeTruthy();
                  expect(isReadyUser2_2nd).toBeTruthy();
                  expect(getBoardBeFore.users[1].ready).toBeTruthy();
                  expect(getBoardAfter.users[1].ready).toBeFalsy();
            });

            it('Failed only one user ', async () => {
                  await ticTacToeService.leaveGame(tttBoard, user1);
                  const isReadyUser2 = await ticTacToeService.toggleReadyStatePlayer(tttBoard, user2);
                  const getBoard = await ticTacToeCommonService.getBoard(tttBoard.id);

                  expect(isReadyUser2).toBeFalsy();
                  expect(getBoard.users[0].ready).toBeFalsy();
                  expect(getBoard.users[1].ready).toBeFalsy();
            });
      });

      describe('isWin', () => {
            beforeEach(async () => {
                  tttBoard.info.users.push(user2);
                  await ticTacToeCommonService.setBoard(tttBoard.id, tttBoard);
                  await ticTacToeService.loadUser(tttBoard);
            });

            it('Pass diagonal left to right, top to bottom ', async () => {
                  const beforeBoardUpdate = await ticTacToeCommonService.getBoard(tttBoard.id);
                  beforeBoardUpdate.board[0][0] = 1;
                  beforeBoardUpdate.board[1][1] = 1;
                  beforeBoardUpdate.board[2][2] = 1;
                  beforeBoardUpdate.board[3][3] = 1;
                  beforeBoardUpdate.board[4][4] = 1;
                  await ticTacToeCommonService.setBoard(tttBoard.id, beforeBoardUpdate);
                  const updatedGame = await ticTacToeCommonService.getBoard(tttBoard.id);
                  const isWin = await ticTacToeService.isWin(updatedGame);
                  const afterBoardUpdate = await ticTacToeCommonService.getBoard(tttBoard.id);

                  expect(afterBoardUpdate.info.status).toBe(TicTacToeStatus.END);
                  expect(afterBoardUpdate.info.winner).toBe(afterBoardUpdate.users[1].flag);
                  expect(isWin).toBeTruthy();
            });

            it('Failed diagonal left to right, top to bottom  miss one', async () => {
                  const beforeBoardUpdate = await ticTacToeCommonService.getBoard(tttBoard.id);
                  beforeBoardUpdate.board[0][0] = 1;
                  beforeBoardUpdate.board[1][1] = 0;
                  beforeBoardUpdate.board[2][2] = 1;
                  beforeBoardUpdate.board[3][3] = 1;
                  beforeBoardUpdate.board[4][4] = 1;
                  await ticTacToeCommonService.setBoard(tttBoard.id, beforeBoardUpdate);
                  const updatedGame = await ticTacToeCommonService.getBoard(tttBoard.id);
                  const isWin = await ticTacToeService.isWin(updatedGame);
                  const afterBoardUpdate = await ticTacToeCommonService.getBoard(tttBoard.id);

                  expect(afterBoardUpdate.info.status).not.toBe(TicTacToeStatus.END);
                  expect(afterBoardUpdate.info.winner).toBe(-1);
                  expect(isWin).toBeFalsy();
            });
            it('Pass diagonal left to right, bottom to top ', async () => {
                  const beforeBoardUpdate = await ticTacToeCommonService.getBoard(tttBoard.id);
                  beforeBoardUpdate.board[0][4] = 0;
                  beforeBoardUpdate.board[1][3] = 0;
                  beforeBoardUpdate.board[2][2] = 0;
                  beforeBoardUpdate.board[3][1] = 0;
                  beforeBoardUpdate.board[4][0] = 0;
                  await ticTacToeCommonService.setBoard(tttBoard.id, beforeBoardUpdate);
                  const updatedGame = await ticTacToeCommonService.getBoard(tttBoard.id);
                  const isWin = await ticTacToeService.isWin(updatedGame);
                  const afterBoardUpdate = await ticTacToeCommonService.getBoard(tttBoard.id);

                  expect(afterBoardUpdate.info.status).toBe(TicTacToeStatus.END);
                  expect(afterBoardUpdate.info.winner).toBe(afterBoardUpdate.users[0].flag);
                  expect(isWin).toBeTruthy();
            });

            it('Failed diagonal left to right, bottom to top miss one', async () => {
                  const beforeBoardUpdate = await ticTacToeCommonService.getBoard(tttBoard.id);
                  beforeBoardUpdate.board[0][4] = 0;
                  beforeBoardUpdate.board[1][3] = -1;
                  beforeBoardUpdate.board[2][2] = 0;
                  beforeBoardUpdate.board[3][1] = 0;
                  beforeBoardUpdate.board[4][0] = 0;
                  await ticTacToeCommonService.setBoard(tttBoard.id, beforeBoardUpdate);
                  const updatedGame = await ticTacToeCommonService.getBoard(tttBoard.id);
                  const isWin = await ticTacToeService.isWin(updatedGame);
                  const afterBoardUpdate = await ticTacToeCommonService.getBoard(tttBoard.id);

                  expect(afterBoardUpdate.info.status).not.toBe(TicTacToeStatus.END);
                  expect(afterBoardUpdate.info.winner).toBe(-1);
                  expect(isWin).toBeFalsy();
            });
            it('Pass diagonal left to right', async () => {
                  const beforeBoardUpdate = await ticTacToeCommonService.getBoard(tttBoard.id);
                  beforeBoardUpdate.board[0][0] = 0;
                  beforeBoardUpdate.board[1][0] = 0;
                  beforeBoardUpdate.board[2][0] = 0;
                  beforeBoardUpdate.board[3][0] = 0;
                  beforeBoardUpdate.board[4][0] = 0;
                  await ticTacToeCommonService.setBoard(tttBoard.id, beforeBoardUpdate);
                  const updatedGame = await ticTacToeCommonService.getBoard(tttBoard.id);
                  const isWin = await ticTacToeService.isWin(updatedGame);
                  const afterBoardUpdate = await ticTacToeCommonService.getBoard(tttBoard.id);

                  expect(afterBoardUpdate.info.status).toBe(TicTacToeStatus.END);
                  expect(afterBoardUpdate.info.winner).toBe(afterBoardUpdate.users[0].flag);
                  expect(isWin).toBeTruthy();
            });

            it('Failed diagonal left to right miss one', async () => {
                  const beforeBoardUpdate = await ticTacToeCommonService.getBoard(tttBoard.id);
                  beforeBoardUpdate.board[0][0] = 0;
                  beforeBoardUpdate.board[1][0] = -1;
                  beforeBoardUpdate.board[2][0] = 0;
                  beforeBoardUpdate.board[3][0] = 0;
                  beforeBoardUpdate.board[4][0] = 0;
                  await ticTacToeCommonService.setBoard(tttBoard.id, beforeBoardUpdate);
                  const updatedGame = await ticTacToeCommonService.getBoard(tttBoard.id);
                  const isWin = await ticTacToeService.isWin(updatedGame);
                  const afterBoardUpdate = await ticTacToeCommonService.getBoard(tttBoard.id);
                  expect(afterBoardUpdate.info.status).not.toBe(TicTacToeStatus.END);
                  expect(afterBoardUpdate.info.winner).toBe(-1);
                  expect(isWin).toBeFalsy();
            });

            it('Pass diagonal top to bottom', async () => {
                  const beforeBoardUpdate = await ticTacToeCommonService.getBoard(tttBoard.id);
                  beforeBoardUpdate.board[0][0] = 0;
                  beforeBoardUpdate.board[0][1] = 0;
                  beforeBoardUpdate.board[0][2] = 0;
                  beforeBoardUpdate.board[0][3] = 0;
                  beforeBoardUpdate.board[0][4] = 0;
                  await ticTacToeCommonService.setBoard(tttBoard.id, beforeBoardUpdate);
                  const updatedGame = await ticTacToeCommonService.getBoard(tttBoard.id);
                  const isWin = await ticTacToeService.isWin(updatedGame);
                  const afterBoardUpdate = await ticTacToeCommonService.getBoard(tttBoard.id);
                  expect(afterBoardUpdate.info.status).toBe(TicTacToeStatus.END);
                  expect(afterBoardUpdate.info.winner).toBe(afterBoardUpdate.users[0].flag);
                  expect(isWin).toBeTruthy();
            });

            it('Failed diagonal top to bottom miss one', async () => {
                  const beforeBoardUpdate = await ticTacToeCommonService.getBoard(tttBoard.id);
                  beforeBoardUpdate.board[0][0] = 0;
                  beforeBoardUpdate.board[0][1] = -1;
                  beforeBoardUpdate.board[0][2] = 0;
                  beforeBoardUpdate.board[0][3] = 0;
                  beforeBoardUpdate.board[0][4] = 0;
                  await ticTacToeCommonService.setBoard(tttBoard.id, beforeBoardUpdate);
                  const updatedGame = await ticTacToeCommonService.getBoard(tttBoard.id);
                  const isWin = await ticTacToeService.isWin(updatedGame);
                  const afterBoardUpdate = await ticTacToeCommonService.getBoard(tttBoard.id);

                  expect(afterBoardUpdate.info.status).not.toBe(TicTacToeStatus.END);
                  expect(afterBoardUpdate.info.winner).toBe(-1);
                  expect(isWin).toBeFalsy();
            });
      });

      describe('startGame', () => {
            beforeEach(async () => {
                  tttBoard.info.users.push(user2);
                  await ticTacToeCommonService.setBoard(tttBoard.id, tttBoard);
                  await ticTacToeService.loadUser(tttBoard);
                  const updateTTT = await ticTacToeCommonService.getBoard(tttBoard.id);

                  await ticTacToeService.toggleReadyStatePlayer(updateTTT, user1);
                  await ticTacToeService.toggleReadyStatePlayer(updateTTT, user2);
            });

            it('Pass ', async () => {
                  const getBoardBefore = await ticTacToeCommonService.getBoard(tttBoard.id);
                  const isPlay = await ticTacToeService.startGame(getBoardBefore);
                  const getBoardAfter = await ticTacToeCommonService.getBoard(tttBoard.id);

                  expect(getBoardAfter.info.status).toBe(TicTacToeStatus.PLAYING);
                  expect(getBoardBefore.users[0].ready).toBeTruthy();
                  expect(getBoardBefore.users[1].ready).toBeTruthy();
                  expect(isPlay).toBeTruthy();
            });

            it('Failed only one ready ', async () => {
                  const getBoardBefore = await ticTacToeCommonService.getBoard(tttBoard.id);
                  await ticTacToeService.toggleReadyStatePlayer(getBoardBefore, user1);
                  const getBoardAfter = await ticTacToeCommonService.getBoard(tttBoard.id);
                  const isPlay = await ticTacToeService.startGame(getBoardAfter);

                  const getBoard = await ticTacToeCommonService.getBoard(tttBoard.id);

                  expect(getBoard.info.status).toBe(TicTacToeStatus['NOT-YET']);
                  expect(getBoard.users[0].ready).toBeFalsy();
                  expect(getBoard.users[1].ready).toBeTruthy();
                  expect(isPlay).toBeFalsy();
            });
      });

      describe('addMoveToBoard', () => {
            beforeEach(async () => {
                  tttBoard.info.users.push(user2);
                  await ticTacToeCommonService.setBoard(tttBoard.id, tttBoard);
                  await ticTacToeService.loadUser(tttBoard);
                  const updateTTT = await ticTacToeCommonService.getBoard(tttBoard.id);
                  await ticTacToeService.toggleReadyStatePlayer(updateTTT, user1);
                  await ticTacToeService.toggleReadyStatePlayer(updateTTT, user2);
                  const updateTTT2 = await ticTacToeCommonService.getBoard(tttBoard.id);
                  await ticTacToeService.startGame(updateTTT2);
            });

            it('Pass User1 add ', async () => {
                  const beforeBoardUpdate = await ticTacToeCommonService.getBoard(tttBoard.id);
                  beforeBoardUpdate.currentTurn = true;
                  await ticTacToeCommonService.setBoard(beforeBoardUpdate.id, beforeBoardUpdate);
                  const getBoard = await ticTacToeCommonService.getBoard(tttBoard.id);
                  const isAddMove = await ticTacToeService.addMoveToBoard(getBoard, user1, 0, 0);
                  const afterBoardUpdate = await ticTacToeCommonService.getBoard(tttBoard.id);

                  expect(afterBoardUpdate.info.status).toBe(TicTacToeStatus.PLAYING);
                  expect(afterBoardUpdate.board[0][0]).toBe(afterBoardUpdate.users[0].flag);
                  expect(afterBoardUpdate.currentTurn).toBeFalsy();
                  expect(isAddMove).toBeTruthy();
            });
            it('Pass User2 add ', async () => {
                  const beforeBoardUpdate = await ticTacToeCommonService.getBoard(tttBoard.id);
                  beforeBoardUpdate.currentTurn = false;
                  await ticTacToeCommonService.setBoard(beforeBoardUpdate.id, beforeBoardUpdate);
                  const getBoard = await ticTacToeCommonService.getBoard(tttBoard.id);
                  const isAddMove = await ticTacToeService.addMoveToBoard(getBoard, user2, 0, 0);
                  const afterBoardUpdate = await ticTacToeCommonService.getBoard(tttBoard.id);

                  expect(afterBoardUpdate.info.status).toBe(TicTacToeStatus.PLAYING);
                  expect(afterBoardUpdate.board[0][0]).toBe(afterBoardUpdate.users[1].flag);
                  expect(afterBoardUpdate.currentTurn).toBeTruthy();
                  expect(isAddMove).toBeTruthy();
            });

            it('Pass User2 wrong turn ', async () => {
                  const beforeBoardUpdate = await ticTacToeCommonService.getBoard(tttBoard.id);
                  beforeBoardUpdate.currentTurn = true;
                  await ticTacToeCommonService.setBoard(beforeBoardUpdate.id, beforeBoardUpdate);
                  const getBoard = await ticTacToeCommonService.getBoard(tttBoard.id);
                  const isAddMove = await ticTacToeService.addMoveToBoard(getBoard, user2, 0, 0);
                  const afterBoardUpdate = await ticTacToeCommonService.getBoard(tttBoard.id);

                  expect(afterBoardUpdate.info.status).toBe(TicTacToeStatus.PLAYING);
                  expect(afterBoardUpdate.board[0][0]).toBe(-1);
                  expect(afterBoardUpdate.currentTurn).toBeTruthy();
                  expect(isAddMove).toBeFalsy();
            });

            it('Failed User2 add exist position ', async () => {
                  const beforeBoardUpdate = await ticTacToeCommonService.getBoard(tttBoard.id);
                  beforeBoardUpdate.currentTurn = false;
                  beforeBoardUpdate.board[1][1] = 0;
                  await ticTacToeCommonService.setBoard(beforeBoardUpdate.id, beforeBoardUpdate);
                  const getBoard = await ticTacToeCommonService.getBoard(tttBoard.id);
                  const isAddMove = await ticTacToeService.addMoveToBoard(getBoard, user2, 1, 1);
                  const afterBoardUpdate = await ticTacToeCommonService.getBoard(tttBoard.id);

                  expect(afterBoardUpdate.info.status).toBe(TicTacToeStatus.PLAYING);
                  expect(afterBoardUpdate.board[0][0]).not.toBe(afterBoardUpdate.users[1].flag);
                  expect(afterBoardUpdate.currentTurn).toBeFalsy();
                  expect(isAddMove).toBeFalsy();
            });

            it('Failed User is not a player ', async () => {
                  const user3 = await generateFakeUser();
                  const beforeBoardUpdate = await ticTacToeCommonService.getBoard(tttBoard.id);
                  const isAddMove = await ticTacToeService.addMoveToBoard(beforeBoardUpdate, user3, 0, 0);

                  const getBoard = await ticTacToeCommonService.getBoard(tttBoard.id);
                  expect(getBoard.info.status).toBe(TicTacToeStatus.PLAYING);
                  expect(getBoard.board[0][0]).toBe(-1);
                  expect(isAddMove).toBeFalsy();
            });
      });

      describe('addMoveToBoard', () => {
            beforeEach(async () => {
                  tttBoard.info.users.push(user2);
                  await ticTacToeCommonService.setBoard(tttBoard.id, tttBoard);
                  await ticTacToeService.loadUser(tttBoard);
                  const updateTTT = await ticTacToeCommonService.getBoard(tttBoard.id);
                  await ticTacToeService.toggleReadyStatePlayer(updateTTT, user1);
                  await ticTacToeService.toggleReadyStatePlayer(updateTTT, user2);
                  const updateTTT2 = await ticTacToeCommonService.getBoard(tttBoard.id);
                  await ticTacToeService.startGame(updateTTT2);
            });

            it('Pass User1 surrender ', async () => {
                  const beforeBoardUpdate = await ticTacToeCommonService.getBoard(tttBoard.id);

                  await ticTacToeService.surrender(beforeBoardUpdate, user1);
                  const afterBoardUpdate = await ticTacToeCommonService.getBoard(tttBoard.id);

                  expect(afterBoardUpdate.info.status).toBe(TicTacToeStatus.END);
                  expect(afterBoardUpdate.info.winner).toBe(1);
            });
            it('Pass User2 surrender ', async () => {
                  const beforeBoardUpdate = await ticTacToeCommonService.getBoard(tttBoard.id);

                  await ticTacToeService.surrender(beforeBoardUpdate, user2);
                  const afterBoardUpdate = await ticTacToeCommonService.getBoard(tttBoard.id);

                  expect(afterBoardUpdate.info.status).toBe(TicTacToeStatus.END);
                  expect(afterBoardUpdate.info.winner).toBe(0);
            });
            it('Failed wrong user ', async () => {
                  const user3 = await generateFakeUser();
                  const beforeBoardUpdate = await ticTacToeCommonService.getBoard(tttBoard.id);

                  await ticTacToeService.surrender(beforeBoardUpdate, user3);
                  const afterBoardUpdate = await ticTacToeCommonService.getBoard(tttBoard.id);

                  expect(afterBoardUpdate.info.status).toBe(TicTacToeStatus.PLAYING);
                  expect(afterBoardUpdate.info.winner).toBe(-1);
            });
      });

      describe('loadUser', () => {
            it('Pass  ', async () => {
                  tttBoard.info.users.push(user2);
                  await ticTacToeCommonService.setBoard(tttBoard.id, tttBoard);
                  const isLoad = await ticTacToeService.loadUser(tttBoard);
                  const getBoard = await ticTacToeCommonService.getBoard(tttBoard.id);

                  expect(getBoard.users[0].id).toBeDefined();
                  expect(getBoard.users[1].id).toBeDefined();
                  expect(isLoad).toBeTruthy();
            });
            it('Failed  ', async () => {
                  await ticTacToeCommonService.setBoard(tttBoard.id, tttBoard);
                  const isLoad = await ticTacToeService.loadUser(tttBoard);
                  const getBoard = await ticTacToeCommonService.getBoard(tttBoard.id);

                  expect(getBoard.users[0].id).toBeNull();
                  expect(getBoard.users[1].id).toBeNull();
                  expect(isLoad).toBeFalsy();
            });
      });

      describe('updateToDatabase', () => {
            beforeEach(async () => {
                  tttBoard.info.users.push(user2);
                  tttBoard.board[0][0] = 1;
                  tttBoard.board[1][1] = 1;
                  tttBoard.board[2][2] = 1;
                  tttBoard.board[3][3] = 1;
                  tttBoard.board[4][4] = 1;
                  tttBoard.board[5][5] = 0;
                  await ticTacToeCommonService.setBoard(tttBoard.id, tttBoard);
                  await ticTacToeService.loadUser(tttBoard);
                  const updateTTT = await ticTacToeCommonService.getBoard(tttBoard.id);
                  await ticTacToeService.toggleReadyStatePlayer(updateTTT, user1);
                  await ticTacToeService.toggleReadyStatePlayer(updateTTT, user2);
                  const updateTTT2 = await ticTacToeCommonService.getBoard(tttBoard.id);
                  await ticTacToeService.startGame(updateTTT2);
                  const updateTTT3 = await ticTacToeCommonService.getBoard(tttBoard.id);
                  await ticTacToeService.isWin(updateTTT3);
            });

            it('Pass', async () => {
                  const beforeBoardUpdate = await ticTacToeCommonService.getBoard(tttBoard.id);
                  const isUpdate = await ticTacToeService.updateToDatabase(beforeBoardUpdate);
                  const afterBoardUpdate = await ticTacToeCommonService.getBoard(tttBoard.id);
                  const getGame = await ticTacToeCommonService.getOneTTTByFiled('tic.id = :id', { id: isUpdate.id });

                  expect(getGame).toBeDefined();
                  expect(getGame.status).toBe(TicTacToeStatus.END);
                  expect(getGame.endDate).toBeDefined();
                  expect(getGame.users).toHaveLength(2);
                  expect(getGame.winner).toBe(1);
                  expect(getGame.moves.length).toBeGreaterThanOrEqual(5);
                  expect(afterBoardUpdate.info.status).toBe(TicTacToeStatus.END);
                  expect(isUpdate).toBeTruthy();
            });
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
