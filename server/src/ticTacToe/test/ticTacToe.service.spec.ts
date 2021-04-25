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
//---- Repository

describe('ticTacToeService', () => {
      let app: INestApplication;
      let userDb: User;
      let ticTacToeService: TicTacToeService;
      let resetDB: any;
      let ticTacToeRepository: TicTacToeRepository;
      let generateFakeUser: () => Promise<User>;
      let redisService: RedisService;

      beforeAll(async () => {
            const { users, getApp, module, resetDatabase, getFakeUser } = await initTestModule();
            app = getApp;
            userDb = (await users[0]).user;
            resetDB = resetDatabase;
            generateFakeUser = getFakeUser;

            ticTacToeService = module.get<TicTacToeService>(TicTacToeService);
            ticTacToeRepository = module.get<TicTacToeRepository>(TicTacToeRepository);
            redisService = module.get<RedisService>(RedisService);
      });

      describe('getMatchByUserId', () => {
            it('getAll', async () => {
                  const user1 = await generateFakeUser();
                  const user2 = await generateFakeUser();
                  const ticTicToe = new TicTacToe();
                  ticTicToe.users = [user1, user2];
                  const insertedTTT = await ticTacToeRepository.save(ticTicToe);

                  await ticTacToeService.loadGameToCache(insertedTTT.id);
                  const board = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${insertedTTT.id}`);
            });
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
