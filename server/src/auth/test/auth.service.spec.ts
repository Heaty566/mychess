import { INestApplication } from '@nestjs/common';

//* Internal import
import { initTestModule } from '../../test/initTest';
import { AuthService } from '../auth.service';
import { User } from '../../users/entities/user.entity';
import { ReTokenRepository } from '../entities/re-token.repository';
import { fakeData } from '../../test/fakeData';
import { RedisService } from '../../providers/redis/redis.service';

describe('UserGuard', () => {
      let app: INestApplication;
      let userDb: User;

      let reTokenRepository: ReTokenRepository;

      let authService: AuthService;
      let redisService: RedisService;
      let resetDB: any;
      beforeAll(async () => {
            const { users, getApp, module, resetDatabase } = await initTestModule();
            app = getApp;
            userDb = (await users[0]).user;
            resetDB = resetDatabase;

            reTokenRepository = module.get<ReTokenRepository>(ReTokenRepository);

            authService = module.get<AuthService>(AuthService);
            redisService = module.get<RedisService>(RedisService);
      });

      describe('limitSendingEmailOrSms', () => {
            beforeEach(async () => {
                  await redisService.deleteByKey('email1@gmail.com');
                  await redisService.deleteByKey('email2@gmail.com');

                  await redisService.setByValue('email1@gmail.com', 1);
            });

            it('Pass (first send)', async () => {
                  const result = await authService.limitSendingEmailOrSms('email2@gmail.com', 5, 30);
                  expect(result).toBe(true);
            });

            it('Pass (do not oversend)', async () => {
                  const result = await authService.limitSendingEmailOrSms('email1@gmail.com', 5, 30);
                  expect(result).toBe(true);
            });

            it('Fail (oversend', async () => {
                  await redisService.setByValue('email1@gmail.com', 6);
                  const result = await authService.limitSendingEmailOrSms('email1@gmail.com', 5, 30);
                  expect(result).toBe(false);
            });
      });

      describe('getAuthTokenByReToken', () => {
            let reToken: string;

            beforeEach(async () => {
                  reToken = await authService.createReToken(userDb);
            });

            it('Pass', async () => {
                  const authTokenId = await authService.getAuthTokenByReToken(reToken);
                  const encryptedUser = await redisService.getByKey(authTokenId);
                  const userInformation = await authService.decodeToken<User>(encryptedUser);
                  expect(userInformation).toBeDefined();
                  expect(userInformation.username).toBe(userInformation.username);
            });

            it('Failed', async () => {
                  const userInformation = await authService.getAuthTokenByReToken(fakeData(12));
                  expect(userInformation).toBeNull();
            });
            it('Failed', async () => {
                  const userInformation = await authService.getAuthTokenByReToken(fakeData(5));
                  expect(userInformation).toBeNull();
            });
      });

      describe('getUserByAuthToken', () => {
            let authToken: string;

            beforeEach(async () => {
                  authToken = await authService[`createAuthToken`](userDb);
            });

            it('Pass', async () => {
                  const userInformation = await authService.getUserByAuthToken(authToken);
                  expect(userInformation).toBeDefined();
                  expect(userInformation.username).toBe(userInformation.username);
            });

            it('Failed', async () => {
                  const userInformation = await authService.getUserByAuthToken(fakeData(12));
                  expect(userInformation).toBeNull();
            });
            it('Failed', async () => {
                  const userInformation = await authService.getUserByAuthToken(fakeData(5));
                  expect(userInformation).toBeNull();
            });
      });

      describe('createAuthToken', () => {
            it('Pass', async () => {
                  const authToken = await authService[`createAuthToken`](userDb);
                  const encryptedUser = await redisService.getByKey(authToken);
                  const userInformation = await authService.decodeToken<User>(encryptedUser);

                  expect(userInformation).toBeDefined();
                  expect(userInformation.username).toBe(userInformation.username);
            });
      });
      describe('getSocketToken', () => {
            it('Pass', async () => {
                  const authToken = await authService.getSocketToken(userDb);
                  const user = await redisService.getObjectByKey<User>(authToken);

                  expect(user.username).toBe(userDb.username);
                  expect(user.id).toBe(userDb.id);
            });
      });

      describe('getAuthTokenByReToken', () => {
            it('Pass', async () => {
                  const reToken = await authService.createReToken(userDb);
                  const authToken = await authService.getAuthTokenByReToken(reToken);
                  const isExist = await redisService.getByKey(authToken);

                  expect(isExist).toBeDefined();
            });
            it('Failed Still get', async () => {
                  const reToken = await authService.createReToken(userDb);
                  let getReToken = await reTokenRepository.findOne({ where: { id: reToken } });
                  getReToken.data = 'hello';
                  getReToken = await reTokenRepository.save(getReToken);
                  const authToken = await authService.getAuthTokenByReToken(reToken);
                  const isExist = await redisService.getByKey(authToken);
                  const decodeUser = authService.decodeToken<User>(isExist);

                  expect(userDb.username).toBe(decodeUser.username);
                  expect(isExist).toBeDefined();
                  expect(authToken).toBeDefined();
            });
      });

      describe('createReToken', () => {
            let reToken: string;
            beforeEach(async () => {
                  reToken = await authService.createReToken(userDb);
            });
            it('Pass', async () => {
                  const refreshToken = await reTokenRepository.findOneByField('id', reToken);
                  const encryptedUser = await redisService.getByKey(refreshToken.data);
                  const userInformation = await authService.decodeToken<User>(encryptedUser);

                  expect(userInformation).toBeDefined();
                  expect(userInformation.username).toBe(userInformation.username);
            });
      });

      describe('generateOtpKey', () => {
            let length: number;

            it('Pass by Sms', () => {
                  length = 6;
                  const otp = authService[`generateOtpKey`](length, 'sms');

                  expect(otp).toBeDefined();
                  expect(otp.length).toBe(length);
                  expect(otp).not.toContain('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');
            });

            it('Pass by email', () => {
                  length = 10;
                  const otp = authService[`generateOtpKey`](length, 'email');

                  expect(otp).toBeDefined();
                  expect(otp.length).toBe(length);
            });
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
