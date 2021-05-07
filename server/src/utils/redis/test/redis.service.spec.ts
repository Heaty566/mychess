import { INestApplication } from '@nestjs/common';
import { createClient, RedisClient } from 'redis';

//---- Helper
import { initTestModule } from '../../../test/initTest';
import { fakeUser } from '../../../test/fakeEntity';
import { fakeData } from '../../../test/test.helper';

//---- Entity
import { User } from '../../../user/entities/user.entity';

//---- Service
import { RedisService } from '../redis.service';

import { LoggerService } from '../../logger/logger.service';

describe('RedisService', () => {
      let app: INestApplication;
      let redisService: RedisService;
      let redis: RedisClient;

      beforeAll(async () => {
            process.env.REDIS_PORT = null;
            process.env.REDIS_DB_NUMBER = '';
            const { getApp, module } = await initTestModule();
            app = getApp;

            const redisPort = Number(process.env.REDIS_PORT) || 7000;
            redis = createClient({ port: redisPort, host: process.env.REDIS_HOST || '' });
            redis.select(process.env.REDIS_DB_NUMBER || 1);
            const logger = module.get<LoggerService>(LoggerService);
            redisService = new RedisService(redis, logger);
      });

      describe('setObjectByKey', () => {
            let user: User;

            beforeEach(() => {
                  user = fakeUser();
            });

            it('Pass', async () => {
                  await redisService.setObjectByKey('user', user);
                  const res = await redisService.getObjectByKey<User>('user');
                  expect(res).toBeDefined();
            });

            it('Pass with time', async () => {
                  await redisService.setObjectByKey('user', user, 10);
                  const res = await redisService.getObjectByKey<User>('user');
                  expect(res).toBeDefined();
            });
      });

      describe('deleteByKey', () => {
            let user: User;

            beforeEach(async () => {
                  user = fakeUser();
                  await redisService.setObjectByKey('user', user);
            });

            it('Pass', async () => {
                  await redisService.deleteByKey('user');
                  const res = await redisService.getObjectByKey<User>('user');
                  expect(res).toBeNull();
            });
      });

      describe('getObjectByKey', () => {
            let user: User;

            beforeEach(async () => {
                  user = fakeUser();
                  await redisService.setObjectByKey('user', user);
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
                  await redisService.setByValue(key, value);
                  const res = await redisService.getByKey(key);
                  expect(res).toBeDefined();
            });

            it('Pass (expired = 0.01 minutes)', async () => {
                  await redisService.setByValue(key, value, 60);
                  const output = await redisService.getByKey(key);
                  expect(output).toBeDefined();
            });
      });

      describe('getByKey', () => {
            let value: number;
            let key: string;

            beforeEach(async () => {
                  value = parseInt(fakeData(5, 'number'));
                  key = fakeData(8, 'lettersAndNumbers');
                  await redisService.setByValue(key, value);
            });

            it('Pass', async () => {
                  const res = await redisService.getByKey(key);
                  expect(res).toBeDefined();
            });
      });

      afterAll(async () => {
            await redis.quit();
            await app.close();
      });
});
