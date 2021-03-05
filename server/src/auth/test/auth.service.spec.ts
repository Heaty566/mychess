import { INestApplication } from '@nestjs/common';

//* Internal import
import { UserRepository } from '../../user/entities/user.repository';
import { initTestModule } from '../../../test/initTest';
import { AuthService } from '../auth.service';
import { User } from '../../user/entities/user.entity';
import { fakeUser } from '../../../test/fakeEntity';
import { ReTokenRepository } from '../entities/re-token.repository';
import { fakeData } from '../../../test/fakeData';
import { RedisService } from '../../utils/redis/redis.service';
import { ObjectId } from 'mongodb';

describe('AuthService', () => {
      let app: INestApplication;
      let userRepository: UserRepository;
      let reTokenRepository: ReTokenRepository;
      let authService: AuthService;
      let userDb: User;
      let redisService: RedisService;
      beforeAll(async () => {
            const { getUser, getApp, module } = await initTestModule();
            app = getApp;
            userDb = getUser;
            userRepository = module.get<UserRepository>(UserRepository);
            authService = module.get<AuthService>(AuthService);
            reTokenRepository = module.get<ReTokenRepository>(ReTokenRepository);
            redisService = module.get<RedisService>(RedisService);
      });
      describe('registerUser', () => {
            let input: User;

            beforeEach(() => {
                  input = fakeUser();
            });

            it('Pass', async () => {
                  const res = await authService.saveUser(input);

                  expect(res).toBeDefined();
            });
            it('Pass', async () => {
                  await authService.saveUser(input);
                  input.username = 'update';
                  await authService.saveUser(input);
                  const res = await userRepository.findOne({ username: 'update' });

                  expect(res).toBeDefined();
                  expect(res.username).toBe('update');
            });
      });

      describe('getDataFromRefreshToken', () => {
            let reToken: string;

            beforeEach(async () => {
                  reToken = await authService.createReToken(userDb);
            });

            it('Pass', async () => {
                  const authTokenId = await authService.getAuthTokenFromReToken(reToken);
                  const encryptedUser = await redisService.getByKey(authTokenId);
                  const userInformation = await authService.decodeToken<User>(encryptedUser);
                  expect(userInformation).toBeDefined();
                  expect(userInformation.username).toBe(userInformation.username);
            });

            it('Failed', async () => {
                  const userInformation = await authService.getAuthTokenFromReToken(fakeData(12));
                  expect(userInformation).toBeNull();
            });
            it('Failed', async () => {
                  const userInformation = await authService.getAuthTokenFromReToken(fakeData(5));
                  expect(userInformation).toBeNull();
            });
      });

      describe('getDataFromAuthToken', () => {
            let authToken: string;

            beforeEach(async () => {
                  authToken = await authService[`createAuthToken`](userDb);
            });

            it('Pass', async () => {
                  const userInformation = await authService.getDataFromAuthToken(authToken);
                  expect(userInformation).toBeDefined();
                  expect(userInformation.username).toBe(userInformation.username);
            });

            it('Failed', async () => {
                  const userInformation = await authService.getDataFromAuthToken(fakeData(12));
                  expect(userInformation).toBeNull();
            });
            it('Failed', async () => {
                  const userInformation = await authService.getDataFromAuthToken(fakeData(5));
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

      describe('getAuthTokenFromReToken', () => {
            it('Pass', async () => {
                  const reToken = await authService.createReToken(userDb);
                  const authToken = await authService.getAuthTokenFromReToken(reToken);
                  const isExist = await redisService.getByKey(authToken);

                  expect(isExist).toBeDefined();
            });
            it('Failed Still get', async () => {
                  const reToken = await authService.createReToken(userDb);
                  let getReToken = await reTokenRepository.findOne({ where: { _id: new ObjectId(reToken) } });
                  getReToken.data = 'hello';
                  getReToken = await reTokenRepository.save(getReToken);
                  const authToken = await authService.getAuthTokenFromReToken(reToken);
                  const isExist = await redisService.getByKey(authToken);
                  const decodeUser = authService.decodeToken<User>(isExist);

                  expect(userDb.username).toBe(decodeUser.username);
                  expect(isExist).toBeDefined();
                  expect(authToken).toBeDefined();
            });
      });

      describe('createRefreshToken', () => {
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

      describe('createOTPRedisKey', () => {
            it('Pass', async () => {
                  const user = fakeUser();
                  const redisKey = authService.createOTPRedisKey(user, 2);
                  expect(redisKey).toBeDefined();
            });
      });

      describe('generateOtp', () => {
            let length: number;

            it('Pass', () => {
                  length = 6;
                  const otp = authService[`generateOtp`](length);
                  expect(otp).toBeDefined();
                  expect(otp.length).toBe(length);
            });
      });

      // describe('generateKeyForSms', () => {
      //       it('Pass', async () => {

      //       })
      // })

      afterAll(async () => {
            await reTokenRepository.clear();
            await userRepository.clear();
            await app.close();
      });
});
