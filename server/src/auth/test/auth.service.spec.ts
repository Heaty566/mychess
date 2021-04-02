import { INestApplication } from '@nestjs/common';

//* Internal import
import { UserRepository } from '../../models/users/entities/user.repository';
import { initTestModule } from '../../../test/initTest';
import { AuthService } from '../auth.service';
import { User } from '../../models/users/entities/user.entity';
import { ReTokenRepository } from '../entities/re-token.repository';
import { fakeData } from '../../../test/fakeData';
import { RedisService } from '../../providers/redis/redis.service';
import { ObjectId } from 'mongodb';

describe('AuthService', () => {
      let app: INestApplication;
      let userDb: User;

      let userRepository: UserRepository;
      let reTokenRepository: ReTokenRepository;

      let authService: AuthService;
      let redisService: RedisService;
      beforeAll(async () => {
            const { getUser, getApp, module } = await initTestModule();
            app = getApp;
            userDb = getUser;

            userRepository = module.get<UserRepository>(UserRepository);
            reTokenRepository = module.get<ReTokenRepository>(ReTokenRepository);

            authService = module.get<AuthService>(AuthService);
            redisService = module.get<RedisService>(RedisService);
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

      describe('getAuthTokenByReToken', () => {
            it('Pass', async () => {
                  const reToken = await authService.createReToken(userDb);
                  const authToken = await authService.getAuthTokenByReToken(reToken);
                  const isExist = await redisService.getByKey(authToken);

                  expect(isExist).toBeDefined();
            });
            it('Failed Still get', async () => {
                  const reToken = await authService.createReToken(userDb);
                  let getReToken = await reTokenRepository.findOne({ where: { _id: new ObjectId(reToken) } });
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
                  const refreshToken = await reTokenRepository.findOneByField('_id', reToken);
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
            await reTokenRepository.clear();
            await userRepository.clear();
            await app.close();
      });
});
