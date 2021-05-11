import { INestApplication } from '@nestjs/common';

//---- Helper
import { initTestModule } from '../../test/initTest';
import { fakeData } from '../../test/test.helper';

//---- Service
import { AuthService } from '../auth.service';
import { RedisService } from '../../utils/redis/redis.service';

//---- Entity
import { User } from '../../user/entities/user.entity';

//---- Repository
import { ReTokenRepository } from '../entities/re-token.repository';

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

      describe('OTP Service', () => {
            describe('createOTP', () => {
                  it('Pass by sms', async () => {
                        const otp = authService.createOTP(userDb, 5, 'sms');
                        const user = await redisService.getObjectByKey<User>(otp);

                        expect(user.username).toBe(userDb.username);
                        expect(user.id).toBe(userDb.id);
                        expect(otp).toBeDefined();
                  });

                  it('Pass by email', async () => {
                        const otp = authService.createOTP(userDb, 5, 'email');
                        const user = await redisService.getObjectByKey<User>(otp);

                        expect(user.username).toBe(userDb.username);
                        expect(user.id).toBe(userDb.id);
                        expect(otp).toBeDefined();
                  });
            });

            describe('isRateLimitKey', () => {
                  beforeEach(async () => {
                        await redisService.deleteByKey('rate-limit-email1@gmail.com');
                        await redisService.deleteByKey('rate-limit-email2@gmail.com');

                        await redisService.setByValue('rate-limit-email1@gmail.com', 1);
                  });

                  it('Pass (first send)', async () => {
                        const result = await authService.isRateLimitKey('email2@gmail.com', 5, 30);
                        expect(result).toBe(true);
                  });

                  it('Pass (do not oversend)', async () => {
                        const result = await authService.isRateLimitKey('email1@gmail.com', 5, 30);
                        expect(result).toBe(true);
                  });

                  it('Fail (oversend', async () => {
                        await redisService.setByValue('rate-limit-email1@gmail.com', 5);
                        const result = await authService.isRateLimitKey('email1@gmail.com', 5, 30);
                        expect(result).toBe(false);
                  });
            });
      });

      describe('Token Service', () => {
            describe('createReToken', () => {
                  let reToken: string;

                  beforeEach(async () => {
                        reToken = await authService.createReToken(userDb);
                  });

                  it('Pass', async () => {
                        const refreshToken = await reTokenRepository.findOneByField('id', reToken);
                        const encryptedUser = await redisService.getByKey(refreshToken.data);
                        const userInformation = await authService.verifyToken<User>(encryptedUser);

                        expect(userInformation).toBeDefined();
                        expect(userInformation.username).toBe(userInformation.username);
                  });
            });

            describe('createAuthToken', () => {
                  it('Pass', async () => {
                        const authToken = await authService[`createAuthToken`](userDb);
                        const encryptedUser = await redisService.getByKey(authToken);
                        const userInformation = await authService.verifyToken<User>(encryptedUser);

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
                        const decodeUser = authService.verifyToken<User>(isExist);

                        expect(userDb.username).toBe(decodeUser.username);
                        expect(isExist).toBeDefined();
                        expect(authToken).toBeDefined();
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

            describe('clearToken', () => {
                  // conntent
            });
      });

      describe('User IP Service', () => {
            describe('parseIp', () => {
                  it('Pass by req.headers[x-forwarded-for]', () => {
                        const result = authService.parseIp({
                              headers: {
                                    'x-forwarded-for': '127.0.0.1',
                              },
                        });

                        expect(result).toBeDefined();
                  });

                  it('Pass by req.connection.remoteAddress', () => {
                        const result = authService.parseIp({
                              headers: {},
                              connection: {
                                    remoteAddress: '127.0.0.1',
                              },
                        });

                        expect(result).toBeDefined();
                  });

                  it('Pass by req.socket.remoteAddress', () => {
                        const result = authService.parseIp({
                              headers: {},
                              socket: {
                                    remoteAddress: '127.0.0.1',
                              },
                        });

                        expect(result).toBeDefined();
                  });

                  it('Pass by req.connection.socket.remoteAddress', () => {
                        const result = authService.parseIp({
                              headers: {},
                              connection: {
                                    socket: {
                                          remoteAddress: '127.0.0.1',
                                    },
                              },
                        });

                        expect(result).toBeDefined();
                  });
            });
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
