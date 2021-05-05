import { INestApplication } from '@nestjs/common';

//---- Helper
import { initTestModule } from '../../test/initTest';

//---- Service
import { TicTacToeCommonService } from '../ticTacToeCommon.service';

//---- Entity
import { User } from '../../users/entities/user.entity';
import { TicTacToe } from '../entity/ticTacToe.entity';
import { TicTacToeBoard } from '../entity/ticTacToeBoard.entity';

//---- Repository
import { TicTacToeRepository } from '../entity/ticTacToe.repository';
import { TicTacToeStatus } from '../entity/ticTacToe.interface';

describe('ticTacToeCommonService', () => {
      let app: INestApplication;
      let resetDB: any;
      let ticTacToeRepository: TicTacToeRepository;
      let generateFakeUser: () => Promise<User>;
      let user1: User;
      let tttBoard: TicTacToeBoard;

      let ticTacToeCommonService: TicTacToeCommonService;
      beforeAll(async () => {
            const { getApp, module, resetDatabase, getFakeUser } = await initTestModule();
            app = getApp;

            resetDB = resetDatabase;
            generateFakeUser = getFakeUser;

            ticTacToeRepository = module.get<TicTacToeRepository>(TicTacToeRepository);
            ticTacToeCommonService = module.get<TicTacToeCommonService>(TicTacToeCommonService);
      });

      beforeEach(async () => {
            user1 = await generateFakeUser();
            const user2 = await generateFakeUser();

            const ticTicToe = new TicTacToe();
            ticTicToe.users = [user1, user2];

            tttBoard = new TicTacToeBoard(ticTicToe, true);
            await ticTacToeCommonService.setBoard(tttBoard.id, tttBoard);
      });

      describe('getMatchByUserId', () => {
            it('Pass', async () => {
                  const newTicTacToe = new TicTacToe();
                  newTicTacToe.users = [user1];
                  await ticTacToeRepository.save(newTicTacToe);

                  const getTicTacToe = await ticTacToeCommonService.getManyTTTByQuery('user.id = :id', { id: user1.id });
                  expect(getTicTacToe.length).toBeGreaterThanOrEqual(1);
                  expect(getTicTacToe[0].users[0].id).toBe(user1.id);
            });
      });

      describe('getOneTTTByField', () => {
            it('Pass', async () => {
                  const newTicTacToe = new TicTacToe();
                  newTicTacToe.users = [user1];
                  await ticTacToeRepository.save(newTicTacToe);

                  const getTicTacToe = await ticTacToeCommonService.getOneTTTByField('user.id = :id', { id: user1.id });
                  expect(getTicTacToe).toBeDefined();
                  expect(getTicTacToe.users[0].id).toBe(user1.id);
            });
      });

      describe('getBoard', () => {
            it('Pass', async () => {
                  const board = await ticTacToeCommonService.getBoard(tttBoard.id);
                  expect(board).toBeDefined();
                  expect(board.id).toBe(tttBoard.id);
            });
            it('Failed no found', async () => {
                  const board = await ticTacToeCommonService.getBoard(`ttt-hello-world`);
                  expect(board).toBeNull();
            });
      });

      describe('setBoard', () => {
            it('Pass', async () => {
                  tttBoard.id = '123';
                  await ticTacToeCommonService.setBoard(tttBoard.id, tttBoard);
                  const board = await ticTacToeCommonService.getBoard(tttBoard.id);

                  expect(board).toBeDefined();
                  expect(board.id).toBe('123');
            });
      });

      describe('isExistUser', () => {
            it('Pass', async () => {
                  const user = await ticTacToeCommonService.isExistUser(tttBoard, user1.id);

                  expect(user).toBeDefined();
            });
            it('Failed not found', async () => {
                  const fakeUser = await generateFakeUser();
                  const user = await ticTacToeCommonService.isExistUser(tttBoard, fakeUser.id);

                  expect(user).toBeUndefined();
            });
      });

      describe('createNewGame', () => {
            it('Pass', async () => {
                  const newBoard = await ticTacToeCommonService.createNewGame(user1, true);
                  const getBoard = await ticTacToeCommonService.getBoard(newBoard.id);
                  expect(getBoard).toBeDefined();
                  expect(newBoard).toBeDefined();
            });
      });
      describe('createNewGame', () => {
            it('Pass', async () => {
                  tttBoard.info.status = TicTacToeStatus.PLAYING;
                  await ticTacToeRepository.save(tttBoard.info);

                  const isPlaying = await ticTacToeCommonService.isPlaying(user1.id);
                  expect(isPlaying).toBeTruthy();
            });
            it('Failed ', async () => {
                  ticTacToeRepository.save(tttBoard.info);

                  const isPlaying = await ticTacToeCommonService.isPlaying(user1.id);
                  expect(isPlaying).toBeFalsy();
            });
      });

      describe('deleteBoard', () => {
            it('Pass', async () => {
                  const boardBefore = await ticTacToeCommonService.getBoard(tttBoard.id);
                  await ticTacToeCommonService.deleteBoard(tttBoard.id);
                  const boardAfter = await ticTacToeCommonService.getBoard(tttBoard.id);

                  expect(boardBefore).toBeDefined();
                  expect(boardAfter).toBeNull();
            });
      });
      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
