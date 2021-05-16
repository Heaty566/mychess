import { INestApplication } from '@nestjs/common';

//---- Helper
import { initTestModule } from '../../test/initTest';

//---- Service
import { TicTacToeCommonService } from '../ticTacToeCommon.service';

//---- Entity
import { User } from '../../user/entities/user.entity';
import { TicTacToeService } from '../ticTacToe.service';
import { TicTacToePlayer, TicTacToeStatus } from '../entity/ticTacToe.interface';

//---- Repository

describe('ticTacToeService', () => {
      let app: INestApplication;
      let ticTacToeService: TicTacToeService;
      let resetDB: any;
      let generateFakeUser: () => Promise<User>;
      let ticTacToeCommonService: TicTacToeCommonService;
      beforeAll(async () => {
            const { getApp, module, resetDatabase, getFakeUser } = await initTestModule();
            app = getApp;

            resetDB = resetDatabase;
            generateFakeUser = getFakeUser;

            ticTacToeService = module.get<TicTacToeService>(TicTacToeService);

            ticTacToeCommonService = module.get<TicTacToeCommonService>(TicTacToeCommonService);
      });

      describe('isWin', () => {
            let tttId: string;

            beforeEach(async () => {
                  const user = await generateFakeUser();
                  tttId = await ticTacToeCommonService.createNewGame(user, true);
                  const getBoard = await ticTacToeCommonService.getBoard(tttId);
                  await ticTacToeCommonService.toggleReadyStatePlayer(tttId, getBoard.users[0]);
                  await ticTacToeCommonService.toggleReadyStatePlayer(tttId, getBoard.users[1]);
                  await ticTacToeCommonService.startGame(tttId);
            });

            it('Pass diagonal left to right, top to bottom ', async () => {
                  const beforeBoardUpdate = await ticTacToeCommonService.getBoard(tttId);
                  beforeBoardUpdate.board[0][0] = 1;
                  beforeBoardUpdate.board[1][1] = 1;
                  beforeBoardUpdate.board[2][2] = 1;
                  beforeBoardUpdate.board[3][3] = 1;
                  beforeBoardUpdate.board[4][4] = 1;
                  await ticTacToeCommonService.setBoard(beforeBoardUpdate);
                  const isWin = await ticTacToeService.isWin(tttId);
                  const afterBoardUpdate = await ticTacToeCommonService.getBoard(tttId);

                  expect(afterBoardUpdate.status).toBe(TicTacToeStatus.END);
                  expect(afterBoardUpdate.winner).toBe(afterBoardUpdate.users[1].flag);
                  expect(isWin).toBeTruthy();
            });

            it('Failed diagonal left to right, top to bottom  miss one', async () => {
                  const beforeBoardUpdate = await ticTacToeCommonService.getBoard(tttId);
                  beforeBoardUpdate.board[0][0] = 1;
                  beforeBoardUpdate.board[1][1] = 0;
                  beforeBoardUpdate.board[2][2] = 1;
                  beforeBoardUpdate.board[3][3] = 1;
                  beforeBoardUpdate.board[4][4] = 1;
                  await ticTacToeCommonService.setBoard(beforeBoardUpdate);
                  const isWin = await ticTacToeService.isWin(tttId);
                  const afterBoardUpdate = await ticTacToeCommonService.getBoard(tttId);

                  expect(afterBoardUpdate.status).not.toBe(TicTacToeStatus.END);
                  expect(afterBoardUpdate.winner).toBe(-1);
                  expect(isWin).toBeFalsy();
            });
            it('Pass diagonal left to right, bottom to top ', async () => {
                  const beforeBoardUpdate = await ticTacToeCommonService.getBoard(tttId);
                  beforeBoardUpdate.board[0][4] = 0;
                  beforeBoardUpdate.board[1][3] = 0;
                  beforeBoardUpdate.board[2][2] = 0;
                  beforeBoardUpdate.board[3][1] = 0;
                  beforeBoardUpdate.board[4][0] = 0;
                  await ticTacToeCommonService.setBoard(beforeBoardUpdate);
                  const isWin = await ticTacToeService.isWin(tttId);
                  const afterBoardUpdate = await ticTacToeCommonService.getBoard(tttId);

                  expect(afterBoardUpdate.status).toBe(TicTacToeStatus.END);
                  expect(afterBoardUpdate.winner).toBe(afterBoardUpdate.users[0].flag);
                  expect(isWin).toBeTruthy();
            });

            it('Failed diagonal left to right, bottom to top miss one', async () => {
                  const beforeBoardUpdate = await ticTacToeCommonService.getBoard(tttId);
                  beforeBoardUpdate.board[0][4] = 0;
                  beforeBoardUpdate.board[1][3] = -1;
                  beforeBoardUpdate.board[2][2] = 0;
                  beforeBoardUpdate.board[3][1] = 0;
                  beforeBoardUpdate.board[4][0] = 0;
                  await ticTacToeCommonService.setBoard(beforeBoardUpdate);
                  const isWin = await ticTacToeService.isWin(tttId);
                  const afterBoardUpdate = await ticTacToeCommonService.getBoard(tttId);

                  expect(afterBoardUpdate.status).not.toBe(TicTacToeStatus.END);
                  expect(afterBoardUpdate.winner).toBe(-1);
                  expect(isWin).toBeFalsy();
            });
            it('Pass diagonal left to right', async () => {
                  const beforeBoardUpdate = await ticTacToeCommonService.getBoard(tttId);
                  beforeBoardUpdate.board[0][0] = 0;
                  beforeBoardUpdate.board[1][0] = 0;
                  beforeBoardUpdate.board[2][0] = 0;
                  beforeBoardUpdate.board[3][0] = 0;
                  beforeBoardUpdate.board[4][0] = 0;
                  await ticTacToeCommonService.setBoard(beforeBoardUpdate);
                  const isWin = await ticTacToeService.isWin(tttId);
                  const afterBoardUpdate = await ticTacToeCommonService.getBoard(tttId);

                  expect(afterBoardUpdate.status).toBe(TicTacToeStatus.END);
                  expect(afterBoardUpdate.winner).toBe(afterBoardUpdate.users[0].flag);
                  expect(isWin).toBeTruthy();
            });

            it('Failed diagonal left to right miss one', async () => {
                  const beforeBoardUpdate = await ticTacToeCommonService.getBoard(tttId);
                  beforeBoardUpdate.board[0][0] = 0;
                  beforeBoardUpdate.board[1][0] = -1;
                  beforeBoardUpdate.board[2][0] = 0;
                  beforeBoardUpdate.board[3][0] = 0;
                  beforeBoardUpdate.board[4][0] = 0;
                  await ticTacToeCommonService.setBoard(beforeBoardUpdate);
                  const isWin = await ticTacToeService.isWin(tttId);
                  const afterBoardUpdate = await ticTacToeCommonService.getBoard(tttId);

                  expect(afterBoardUpdate.status).not.toBe(TicTacToeStatus.END);
                  expect(afterBoardUpdate.winner).toBe(-1);
                  expect(isWin).toBeFalsy();
            });

            it('Pass diagonal top to bottom', async () => {
                  const beforeBoardUpdate = await ticTacToeCommonService.getBoard(tttId);
                  beforeBoardUpdate.board[0][0] = 0;
                  beforeBoardUpdate.board[0][1] = 0;
                  beforeBoardUpdate.board[0][2] = 0;
                  beforeBoardUpdate.board[0][3] = 0;
                  beforeBoardUpdate.board[0][4] = 0;
                  await ticTacToeCommonService.setBoard(beforeBoardUpdate);
                  const isWin = await ticTacToeService.isWin(tttId);
                  const afterBoardUpdate = await ticTacToeCommonService.getBoard(tttId);

                  expect(afterBoardUpdate.status).toBe(TicTacToeStatus.END);
                  expect(afterBoardUpdate.winner).toBe(afterBoardUpdate.users[0].flag);
                  expect(isWin).toBeTruthy();
            });

            it('Failed diagonal top to bottom miss one', async () => {
                  const beforeBoardUpdate = await ticTacToeCommonService.getBoard(tttId);
                  beforeBoardUpdate.board[0][0] = 0;
                  beforeBoardUpdate.board[0][1] = -1;
                  beforeBoardUpdate.board[0][2] = 0;
                  beforeBoardUpdate.board[0][3] = 0;
                  beforeBoardUpdate.board[0][4] = 0;
                  await ticTacToeCommonService.setBoard(beforeBoardUpdate);
                  const isWin = await ticTacToeService.isWin(tttId);
                  const afterBoardUpdate = await ticTacToeCommonService.getBoard(tttId);

                  expect(afterBoardUpdate.status).not.toBe(TicTacToeStatus.END);
                  expect(afterBoardUpdate.winner).toBe(-1);
                  expect(isWin).toBeFalsy();
            });

            it('Failed wrong board', async () => {
                  const isWin = await ticTacToeService.isWin('hello');

                  expect(isWin).toBeUndefined();
            });
      });

      describe('addMoveToBoard', () => {
            let player1: TicTacToePlayer;
            let player2: TicTacToePlayer;
            let tttId: string;

            beforeEach(async () => {
                  const user = await generateFakeUser();
                  tttId = await ticTacToeCommonService.createNewGame(user, true);
                  const getBoard = await ticTacToeCommonService.getBoard(tttId);
                  await ticTacToeCommonService.toggleReadyStatePlayer(tttId, getBoard.users[0]);
                  await ticTacToeCommonService.toggleReadyStatePlayer(tttId, getBoard.users[1]);
                  await ticTacToeCommonService.startGame(tttId);
                  player1 = getBoard.users[0];
                  player2 = getBoard.users[1];
            });

            it('Pass User1 add ', async () => {
                  const beforeBoardUpdate = await ticTacToeCommonService.getBoard(tttId);
                  beforeBoardUpdate.currentTurn = true;
                  await ticTacToeCommonService.setBoard(beforeBoardUpdate);

                  const isAddMove = await ticTacToeService.addMoveToBoard(tttId, player1, 0, 0);
                  const afterBoardUpdate = await ticTacToeCommonService.getBoard(tttId);

                  expect(afterBoardUpdate.status).toBe(TicTacToeStatus.PLAYING);
                  expect(afterBoardUpdate.board[0][0]).toBe(afterBoardUpdate.users[0].flag);
                  expect(afterBoardUpdate.currentTurn).toBeFalsy();
                  expect(isAddMove).toBeTruthy();
            });
            it('Pass User2 add ', async () => {
                  const beforeBoardUpdate = await ticTacToeCommonService.getBoard(tttId);
                  beforeBoardUpdate.currentTurn = false;
                  await ticTacToeCommonService.setBoard(beforeBoardUpdate);

                  const isAddMove = await ticTacToeService.addMoveToBoard(tttId, player2, 0, 0);
                  const afterBoardUpdate = await ticTacToeCommonService.getBoard(tttId);

                  expect(afterBoardUpdate.status).toBe(TicTacToeStatus.PLAYING);
                  expect(afterBoardUpdate.board[0][0]).toBe(afterBoardUpdate.users[1].flag);
                  expect(afterBoardUpdate.currentTurn).toBeTruthy();
                  expect(isAddMove).toBeTruthy();
            });

            it('Pass User2 wrong turn ', async () => {
                  const beforeBoardUpdate = await ticTacToeCommonService.getBoard(tttId);
                  beforeBoardUpdate.currentTurn = true;
                  await ticTacToeCommonService.setBoard(beforeBoardUpdate);

                  const isAddMove = await ticTacToeService.addMoveToBoard(tttId, player2, 0, 0);
                  const afterBoardUpdate = await ticTacToeCommonService.getBoard(tttId);

                  expect(afterBoardUpdate.status).toBe(TicTacToeStatus.PLAYING);
                  expect(afterBoardUpdate.board[0][0]).toBe(-1);
                  expect(afterBoardUpdate.currentTurn).toBeTruthy();
                  expect(isAddMove).toBeFalsy();
            });

            it('Failed User2 add exist position ', async () => {
                  const beforeBoardUpdate = await ticTacToeCommonService.getBoard(tttId);
                  beforeBoardUpdate.currentTurn = false;
                  beforeBoardUpdate.board[1][1] = 0;
                  await ticTacToeCommonService.setBoard(beforeBoardUpdate);

                  const isAddMove = await ticTacToeService.addMoveToBoard(tttId, player2, 1, 1);
                  const afterBoardUpdate = await ticTacToeCommonService.getBoard(tttId);

                  expect(afterBoardUpdate.status).toBe(TicTacToeStatus.PLAYING);
                  expect(afterBoardUpdate.board[0][0]).not.toBe(afterBoardUpdate.users[1].flag);
                  expect(afterBoardUpdate.currentTurn).toBeFalsy();
                  expect(isAddMove).toBeFalsy();
            });

            it('Failed wrong board ', async () => {
                  const isAddMove = await ticTacToeService.addMoveToBoard('hello', player2, 1, 1);
                  expect(isAddMove).toBeUndefined();
            });
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
