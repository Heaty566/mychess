import { INestApplication } from '@nestjs/common';

//* Internal import
import { initTestModule } from '../../../../test/initTest';
import { fakeUser } from '../../../../test/fakeEntity';
import { fakeData } from '../../../../test/fakeData';
import { User } from '../../../user/entities/user.entity';
import { RedisService } from '../redis.service';
import { RedisClient, createClient } from 'redis';

describe('RedisService', () => {
      let app: INestApplication;
      let redisService: RedisService;
      let redisRepository: RedisClient;

      beforeAll(async () => {
            const { getApp, module } = await initTestModule();
            app = getApp;

            const redisPort = Number(process.env.REDIS_PORT) || 7000;
            const redis = createClient({ port: redisPort, host: process.env.REDIS_HOST || '' });
            redis.select(process.env.REDIS_DB_NUMBER || 1);
            redisRepository = redis;

            redisService = module.get<RedisService>(RedisService);
      });

      describe('setObjectByKey', () => {
            let user: User;

            beforeEach(() => {
                  user = fakeUser();
            });

            it('Pass', async () => {
                  redisService.setObjectByKey('user', user);
                  const res = await redisService.getObjectByKey<User>('user');
                  expect(res).toBeDefined();
            });
      });

      describe('deleteByKey', () => {
            let user: User;

            beforeEach(() => {
                  user = fakeUser();
                  redisService.setObjectByKey('user', user);
            });

            it('Pass', async () => {
                  redisService.deleteByKey('user');
                  const res = await redisService.getObjectByKey<User>('user');
                  expect(res).toBeNull();
            });
      });

      describe('getObjectByKey', () => {
            let user: User;

            beforeEach(() => {
                  user = fakeUser();
                  redisService.setObjectByKey('user', user);
            });

            it('Pass', async () => {
                  const res = await redisService.getObjectByKey<User>('user');
                  expect(res).toBeDefined();
            });
      });

      describe('setByValue', () => {
            let value: number;
            let key: string;

            beforeEach(() => {
                  value = parseInt(fakeData(5, 'number'));
                  key = fakeData(8, 'lettersAndNumbers');
            });

            it('Pass (do not have expired)', async () => {
                  redisService.setByValue(key, value);
                  const res = await redisService.getByKey(key);
                  expect(res).toBeDefined();
            });

            // it('Pass (expired = 0.01 minutes)', async () => {
            //       redisService.setByValue(key, value, 1);

            //       redisRepository.TTL(key, (data) => {
            //             console.log(data);
            //       });
            // });
      });

      describe('getByKey', () => {
            let value: number;
            let key: string;

            beforeEach(() => {
                  value = parseInt(fakeData(5, 'number'));
                  key = fakeData(8, 'lettersAndNumbers');
                  redisService.setByValue(key, value);
            });

            it('Pass', async () => {
                  const res = await redisService.getByKey(key);
                  expect(res).toBeDefined();
            });
      });

      afterAll(async () => {
            await app.close();
      });
});
