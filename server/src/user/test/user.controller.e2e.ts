let mockPromise = Promise.resolve();
class TwilioMock {
      constructor() {
            //
      }

      public messages = {
            create() {
                  return mockPromise;
            },
      };
}

import * as supertest from 'supertest';
import { INestApplication } from '@nestjs/common';

//---- Helper
import { fakeUser } from '../../test/fakeEntity';
import { initTestModule } from '../../test/initTest';
import { fakeData, defuse, generateCookie } from '../../test/test.helper';

//---- Repository
import { UserRepository } from '../entities/user.repository';

//---- Service
import { AuthService } from '../../auth/auth.service';
import { RedisService } from '../../utils/redis/redis.service';
import { UserService } from '../user.service';
import { SmailService } from '../../providers/smail/smail.service';
import { AwsService } from '../../providers/aws/aws.service';

//---- Entity
import { User } from '../entities/user.entity';

//---- DTO
import { ResetPasswordDTO } from '../dto/resetPassword.dto';
import { ChangePasswordDTO } from '../dto/changePassword.dto';
import { OtpSmsDTO } from '../../auth/dto/otpSms.dto';
import { UpdateUserDto } from '../dto/updateBasicUser.dto';
import { UpdateEmailDTO } from '../dto/updateEmail.dto';

jest.mock('twilio', () => {
      return {
            Twilio: TwilioMock,
      };
});

const mockS3Object = jest.fn();
jest.mock('aws-sdk', () => {
      return {
            ...jest.requireActual('aws-sdk'),
            config: {
                  update: jest.fn(),
            },
            S3: jest.fn(() => ({ putObject: mockS3Object })),
      };
});

describe('UserController E2E', () => {
      let app: INestApplication;

      let userRepository: UserRepository;
      let authService: AuthService;
      let redisService: RedisService;
      let userService: UserService;
      let mailService: SmailService;
      let awsService: AwsService;

      let cookieData: Array<string>;
      let userDb: User;
      let userDb2: User;
      let resetDb: any;

      beforeAll(async () => {
            const { getApp, module, users, resetDatabase } = await initTestModule();
            app = getApp;
            userDb = (await users[0]).user;
            userDb2 = (await users[1]).user;
            cookieData = generateCookie((await users[0]).reToken);
            resetDb = resetDatabase;

            userRepository = module.get<UserRepository>(UserRepository);
            authService = module.get<AuthService>(AuthService);
            redisService = module.get<RedisService>(RedisService);
            userService = module.get<UserService>(UserService);
            mailService = module.get<SmailService>(SmailService);
            awsService = module.get<AwsService>(AwsService);
      });

      describe('GET /', () => {
            const reqApi = () => supertest(app.getHttpServer()).get('/api/user/').set({ cookie: cookieData }).send();

            it('Pass', async () => {
                  const res = await reqApi();
                  expect(res.body.data).toBeDefined();
            });
      });

      describe('GET /user/search?name=&currentPage=&pageSize', () => {
            const reqApi = (name: string, currentPage: string, pageSize: string) =>
                  supertest(app.getHttpServer()).get(`/api/user/search?name=${name}&currentPage=${currentPage}&pageSize=${pageSize}`);

            it('Pass get two', async () => {
                  const res = await reqApi(userDb.name, '0', '12');

                  expect(res.body.data.users).toHaveLength(1);
                  expect(res.status).toBe(200);
            });

            it('Pass get zero currentPage 1000', async () => {
                  const res = await reqApi(userDb.name, '10000', '12');

                  expect(res.body.data.users).toHaveLength(0);
                  expect(res.status).toBe(200);
            });

            it('Pass get two currentPage -10', async () => {
                  const res = await reqApi(userDb.name, '-10', '12');

                  expect(res.body.data.users).toHaveLength(1);
                  expect(res.status).toBe(200);
            });

            it('Pass get two currentPage=dksakdmksamk', async () => {
                  const res = await reqApi(userDb.name, 'dksakdmksamk', '12');

                  expect(res.body.data.users).toHaveLength(1);
                  expect(res.status).toBe(200);
            });

            it('Pass get one pageSize=1', async () => {
                  const res = await reqApi(userDb.name, '0', '1');

                  expect(res.body.data.users).toHaveLength(1);
                  expect(res.status).toBe(200);
            });

            it('Pass get all', async () => {
                  const exampleUser = fakeUser();
                  exampleUser.name = userDb.name;
                  await userRepository.save(exampleUser);
                  const res = await reqApi(userDb.name, '0', '200');

                  expect(res.body.data.users.length).toBeGreaterThan(1);
                  expect(res.status).toBe(200);
            });
      });

      describe('GET /:id', () => {
            const reqApi = (id: string) => supertest(app.getHttpServer()).get(`/api/user/${id}`).set({ cookie: cookieData }).send();

            it('Pass', async () => {
                  const res = await reqApi(userDb.id);
                  expect(res.body.data).toBeDefined();
            });

            it('Id not correct', async () => {
                  const res = await reqApi(fakeData(10, 'lettersAndNumbers'));
                  expect(res.status).toBe(400);
            });
      });

      describe('Update user information', () => {
            describe('Put /api/user', () => {
                  let body: UpdateUserDto;
                  const reqApi = (body: UpdateUserDto) => supertest(app.getHttpServer()).put(`/api/user`).set({ cookie: cookieData }).send(body);

                  beforeEach(() => {
                        body = {
                              name: fakeData(10, 'letters'),
                        };
                  });

                  it('Pass', async () => {
                        const res = await reqApi(body);

                        const getUser = await userRepository.findOneByField('id', userDb.id);

                        expect(getUser.name.toLocaleLowerCase()).toBe(body.name.toLocaleLowerCase());
                        expect(getUser.username).toBe(userDb.username);
                        expect(res.status).toBe(200);
                  });
            });

            describe('Put /api/user/avatar', () => {
                  const reqApi = (input) =>
                        supertest(app.getHttpServer())
                              .put(`/api/user/avatar`)
                              .set({ cookie: cookieData })
                              .attach('avatar', `${__dirname}/../../../src/test/testFile/${input}`);

                  it('Pass', async () => {
                        const awsSpy = jest.spyOn(awsService, 'uploadFile');
                        awsSpy.mockImplementation(() => Promise.resolve(true));
                        const res = await reqApi('photo.png');
                        expect(res.status).toBe(200);
                        awsSpy.mockClear();
                  });

                  it('Failed file too large', async () => {
                        const res = await reqApi('4mb.png');

                        expect(res.status).toBe(400);
                  });

                  it('Failed miss avatar property', async () => {
                        const res = await supertest(app.getHttpServer()).put(`/api/user/avatar`).set({ cookie: cookieData }).send();

                        expect(res.status).toBe(400);
                  });

                  it('Failed wrong file extension', async () => {
                        const res = await reqApi('text.txt');

                        expect(res.status).toBe(400);
                  });

                  it('Failed wrong file extension', async () => {
                        const awsSpy = jest.spyOn(awsService, 'uploadFile').mockImplementation(() => Promise.resolve(false));
                        const res = await reqApi('photo.png');
                        awsSpy.mockClear();

                        expect(res.status).toBe(500);
                  });
            });

            describe('PUT /api/user/password', () => {
                  let currentPassword: string;
                  let user: User;
                  let body: ChangePasswordDTO;
                  let newToken: string;
                  const reqApi = (body, cookie) =>
                        supertest(app.getHttpServer())
                              .put('/api/user/password')
                              .set({ cookie: `re-token=${cookie} ;` })
                              .send(body);

                  beforeAll(async () => {
                        user = fakeUser();
                        user.email = 'heaty126@gmail.com';
                        currentPassword = user.password;
                        user.password = await authService.encryptString(user.password);
                        const getCurrentUser = await userService.saveUser(user);
                        newToken = await authService.createReToken(getCurrentUser);

                        body = {
                              newPassword: 'Password123',
                              confirmNewPassword: 'Password123',
                              currentPassword: currentPassword,
                        };
                  });

                  it('Pass', async () => {
                        const res = await reqApi(body, newToken);
                        const getUser = await userRepository.findOneByField('username', user.username);
                        const isMatch = await authService.decryptString(body.newPassword, getUser.password);
                        expect(res.status).toBe(200);
                        expect(isMatch).toBeTruthy();
                  });

                  it('Failed currentPassword is not correct', async () => {
                        body.currentPassword = fakeData(10, 'lettersAndNumbers');
                        const res = await reqApi(body, newToken);

                        expect(res.status).toBe(400);
                  });
            });

            describe('PUT /api/user/reset-password?key=', () => {
                  let user: User;
                  let redisKey: string;
                  let body: ResetPasswordDTO;
                  const reqApi = (body, redisKey) => supertest(app.getHttpServer()).put(`/api/user/reset-password?key=${redisKey}`).send(body);

                  beforeAll(async () => {
                        user = fakeUser();
                        user.email = 'heaty126@gmail.com';
                        await userService.saveUser(user);
                        redisKey = await authService.createOTP(user, 2, 'email');
                        body = {
                              newPassword: 'Password123',
                              confirmNewPassword: 'Password123',
                        };
                  });

                  it('Pass', async () => {
                        const beforeRedisKey = await redisService.getObjectByKey(redisKey);
                        const res = await reqApi(body, redisKey);
                        const getUser = await userRepository.findOneByField('id', user.id);
                        const isMatch = await authService.decryptString(body.newPassword, getUser.password);
                        const afterRedisKey = await redisService.getObjectByKey(redisKey);
                        expect(res.status).toBe(200);
                        expect(beforeRedisKey).toBeDefined();
                        expect(afterRedisKey).toBeNull();
                        expect(isMatch).toBeTruthy();
                  });

                  it('Failed redis key is used', async () => {
                        const res = await reqApi(body, redisKey);

                        expect(res.status).toBe(403);
                  });

                  it('Failed redis expired', async () => {
                        const res = await reqApi(body, '123456');
                        expect(res.status).toBe(403);
                  });

                  it('Failed url does not provide key', async () => {
                        const customApi = (body) =>
                              supertest(app.getHttpServer()).put(`/api/user/reset-password`).set({ cookie: cookieData }).send(body);
                        const res = await customApi(body);

                        expect(res.status).toBe(403);
                  });
            });

            describe('PUT /api/user/update-with-otp?key=', () => {
                  let redisKey: string;
                  const reqApi = (redisKey) =>
                        supertest(app.getHttpServer()).put(`/api/user/update-with-otp?key=${redisKey}`).set({ cookie: cookieData }).send();

                  beforeAll(async () => {
                        redisKey = await authService.createOTP(userDb, 2, 'sms');
                  });

                  it('Pass', async () => {
                        const beforeRedisKey = await redisService.getObjectByKey(redisKey);
                        const res = await reqApi(redisKey);
                        const afterRedisKey = await redisService.getObjectByKey(redisKey);
                        expect(res.status).toBe(200);
                        expect(beforeRedisKey).toBeDefined();
                        expect(afterRedisKey).toBeNull();
                  });

                  it('Pass Email', async () => {
                        userDb.email = 'helloworld@gmail.com';
                        redisKey = await authService.createOTP(userDb, 2, 'email');
                        const beforeRedisKey = await redisService.getObjectByKey(redisKey);
                        const res = await reqApi(redisKey);
                        const afterRedisKey = await redisService.getObjectByKey(redisKey);
                        expect(res.status).toBe(200);
                        expect(beforeRedisKey).toBeDefined();
                        expect(afterRedisKey).toBeNull();
                  });

                  it('Pass Phone', async () => {
                        userDb.phoneNumber = '+84901345099';
                        redisKey = await authService.createOTP(userDb, 2, 'email');
                        const beforeRedisKey = await redisService.getObjectByKey(redisKey);
                        const res = await reqApi(redisKey);
                        const afterRedisKey = await redisService.getObjectByKey(redisKey);
                        expect(res.status).toBe(200);
                        expect(beforeRedisKey).toBeDefined();
                        expect(afterRedisKey).toBeNull();
                  });

                  it('Failed redis key is used', async () => {
                        const res = await reqApi(redisKey);

                        expect(res.status).toBe(403);
                  });

                  it('Failed redis expired', async () => {
                        const res = await reqApi(123456);

                        expect(res.status).toBe(403);
                  });

                  it('Failed url does not provide key', async () => {
                        const customApi = () => supertest(app.getHttpServer()).put(`/api/user/update-with-otp`).set({ cookie: cookieData }).send();
                        const res = await customApi();

                        expect(res.status).toBe(403);
                  });
            });
      });

      describe('Create-OTP--WITH GUARD', () => {
            describe('POST /otp-sms', () => {
                  let otpSmsDTO: OtpSmsDTO;
                  const reqApi = (input: OtpSmsDTO) =>
                        supertest(app.getHttpServer()).post('/api/user/otp-sms').set({ cookie: cookieData }).send(input);

                  beforeEach(async () => {
                        otpSmsDTO = {
                              phoneNumber: userDb.phoneNumber,
                        };
                  });

                  it('Pass', async () => {
                        const mySpy = jest.spyOn(authService, 'isRateLimitKey').mockImplementation(() => Promise.resolve(true));
                        const res = await reqApi({ phoneNumber: '0904563877' });

                        expect(res.status).toBe(201);

                        mySpy.mockClear();
                  });

                  it('Failed (error of sms service)', async () => {
                        otpSmsDTO = {
                              phoneNumber: `098${fakeData(7, 'number')}`,
                        };
                        mockPromise = defuse(new Promise((resolve, reject) => reject(new Error('Oops'))));
                        try {
                              await reqApi(otpSmsDTO);
                        } catch (err) {
                              expect(err.status).toBe(500);
                        }
                  });

                  it('Failed (phone number is already exist)', async () => {
                        const res = await reqApi(otpSmsDTO);
                        expect(res.status).toBe(400);
                  });

                  it('Failed (user ip request many time)', async () => {
                        otpSmsDTO = {
                              phoneNumber: '0862334006',
                        };
                        const mySpy = jest.spyOn(authService, 'isRateLimitKey').mockImplementation(() => Promise.resolve(false));
                        const res = await reqApi(otpSmsDTO);
                        expect(res.status).toBe(400);
                        mySpy.mockClear();
                  });

                  it('Failed (phone number request many time)', async () => {
                        otpSmsDTO = {
                              phoneNumber: '0862334006',
                        };
                        const mySpy = jest
                              .spyOn(authService, 'isRateLimitKey')
                              .mockImplementation(jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(false));

                        const res = await reqApi(otpSmsDTO);
                        expect(res.status).toBe(400);
                        mySpy.mockClear();
                  });
            });

            describe('POST /otp-email', () => {
                  let otpMail: UpdateEmailDTO;

                  const reqApi = (input: UpdateEmailDTO) =>
                        supertest(app.getHttpServer()).post('/api/user/otp-email').set({ cookie: cookieData }).send(input);

                  it('Pass', async () => {
                        const mySpy = jest.spyOn(authService, 'isRateLimitKey').mockImplementation(() => Promise.resolve(true));
                        otpMail = {
                              email: `heaty566ex@gmail.com`,
                        };
                        const res = await reqApi(otpMail);
                        expect(res.status).toBe(201);
                        mySpy.mockClear();
                  });

                  it('Failed (email is taken)', async () => {
                        userDb2.email = 'helloworld@gmail.com';
                        await userRepository.save(userDb2);

                        otpMail = {
                              email: 'helloworld@gmail.com',
                        };
                        const res = await reqApi(otpMail);
                        expect(res.status).toBe(400);
                  });

                  it('Failed (error of smail)', async () => {
                        otpMail = {
                              email: `heaty566ex@gmail.com`,
                        };
                        const mySpy = jest.spyOn(mailService, 'sendOTPForUpdateEmail').mockImplementation(() => Promise.resolve(false));
                        try {
                              await reqApi(otpMail);
                        } catch (err) {
                              expect(err.status).toBe(500);
                        }
                        mySpy.mockClear();
                  });

                  it('Failed (user ip request many time)', async () => {
                        otpMail = {
                              email: `heaty566ex@gmail.com`,
                        };
                        const mySpy = jest.spyOn(authService, 'isRateLimitKey').mockImplementation(() => Promise.resolve(false));
                        const res = await reqApi(otpMail);
                        expect(res.status).toBe(400);
                        mySpy.mockClear();
                  });

                  it('Failed (email request many time)', async () => {
                        otpMail = {
                              email: `heaty566ex@gmail.com`,
                        };
                        const mySpy = jest
                              .spyOn(authService, 'isRateLimitKey')
                              .mockImplementation(jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(false));
                        const res = await reqApi(otpMail);
                        expect(res.status).toBe(400);
                        mySpy.mockClear();
                  });
            });
      });

      afterAll(async () => {
            await resetDb();
            await app.close();
      });
});
