import { INestApplication } from '@nestjs/common';

//---- Helper
import { initTestModule } from '../../test/initTest';

//---- Service
import { TicTacToeCommonService } from '../ticTacToeCommon.service';

//---- Entity
import { User } from '../../users/entities/user.entity';
import { TicTacToe } from '../entity/ticTacToe.entity';
import { TicTacToeRepository } from '../entity/ticTacToe.repository';
import { TicTacToeService } from '../ticTacToe.service';

//---- Repository

describe('ticTacToeCommonService', () => {
      let app: INestApplication;
      let ticTacToeService: TicTacToeService;
      let resetDB: any;
      let ticTacToeRepository: TicTacToeRepository;
      let generateFakeUser: () => Promise<User>;

      let tTTGame: TicTacToe;

      let ticTacToeCommonService: TicTacToeCommonService;
      beforeAll(async () => {
            const { getApp, module, resetDatabase, getFakeUser } = await initTestModule();
            app = getApp;

            resetDB = resetDatabase;
            generateFakeUser = getFakeUser;

            ticTacToeRepository = module.get<TicTacToeRepository>(TicTacToeRepository);
            ticTacToeService = module.get<TicTacToeService>(TicTacToeService);
            ticTacToeRepository = module.get<TicTacToeRepository>(TicTacToeRepository);
            ticTacToeCommonService = module.get<TicTacToeCommonService>(TicTacToeCommonService);
      });

      beforeEach(async () => {
            const user1 = await generateFakeUser();
            const user2 = await generateFakeUser();

            const ticTicToe = new TicTacToe();
            ticTicToe.users = [user1, user2];

            tTTGame = await ticTacToeRepository.save(ticTicToe);
      });

      describe('getMatchByUserId', () => {
            it('getAll', async () => {
                  const user = await generateFakeUser();
                  const newTicTacToe = new TicTacToe();
                  newTicTacToe.users = [user];
                  const saveTicTacToe = await ticTacToeRepository.save(newTicTacToe);

                  const getTicTacToe = await ticTacToeCommonService.getManyMatchByQuery('user.id = :id', { id: user.id });
                  expect(getTicTacToe.length).toBeGreaterThanOrEqual(1);
                  expect(getTicTacToe[0].id).toBe(saveTicTacToe.id);
            });
      });

      describe('getBoard', () => {
            it('Pass get correct', async () => {
                  const res = await ticTacToeService.loadGameToCache(tTTGame.id);
                  const board = await ticTacToeCommonService.getBoard(tTTGame.id);
                  expect(board).toBeDefined();
                  expect(res).toBeTruthy();
                  expect(board.info.id).toBe(tTTGame.id);
            });
            it('Failed no found', async () => {
                  const board = await ticTacToeCommonService.getBoard(`ttt-hello-world`);
                  expect(board).toBeNull();
            });
      });
      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
