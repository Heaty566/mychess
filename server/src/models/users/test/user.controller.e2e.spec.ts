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

//* Internal import
import { fakeUser } from '../../../../test/fakeEntity';
import { UserRepository } from '../entities/user.repository';
import { initTestModule } from '../../../../test/initTest';
import { AuthService } from '../../../auth/auth.service';
import { RedisService } from '../../../providers/redis/redis.service';
import { UserService } from '../user.service';
import { SmailService } from '../../../providers/smail/smail.service';
import { AwsService } from '../../../providers/aws/aws.service';
import { User } from '../entities/user.entity';
import { fakeData } from '../../../../test/fakeData';
import { ChangePasswordDTO } from '../dto/changePassword.dto';
import { OtpSmsDTO } from '../../../auth/dto/otpSms.dto';
import { UpdateUserDto } from '../dto/updateBasicUser.dto';
import { UpdateEmailDTO } from '../dto/updateEmail.dto';
import { defuse } from '../../../../test/testHelper';

jest.mock('twilio', () => {
      return {
            Twilio: TwilioMock,
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
      let user: User;

      beforeAll(async () => {
            const { getApp, module, cookie, getUser } = await initTestModule();
            app = getApp;
            user = getUser;
            user = getUser;
            cookieData = cookie;

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

      describe('create otp by user', () => {
            describe('POST /otp-sms', () => {
                  let otpSmsDTO: OtpSmsDTO;
                  const reqApi = (input: OtpSmsDTO) =>
                        supertest(app.getHttpServer()).post('/api/user/otp-sms').set({ cookie: cookieData }).send(input);

                  beforeEach(async () => {
                        otpSmsDTO = {
                              phoneNumber: user.phoneNumber,
                        };
                  });

                  it('Pass', async () => {
                        otpSmsDTO = {
                              phoneNumber: fakeData(10, 'number'),
                        };
                        const res = await reqApi(otpSmsDTO);
                        expect(res.status).toBe(201);
                  });

                  it('Failed (error of sms service)', async () => {
                        otpSmsDTO = {
                              phoneNumber: fakeData(10, 'number'),
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
            });

            describe('POST /otp-email', () => {
                  let otpMail: UpdateEmailDTO;

                  const reqApi = (input: UpdateEmailDTO) =>
                        supertest(app.getHttpServer()).post('/api/user/otp-email').set({ cookie: cookieData }).send(input);

                  it('Failed (email is taken)', async () => {
                        otpMail = {
                              email: 'haicao2805@gmail.com',
                        };
                        const res = await reqApi(otpMail);
                        expect(res.status).toBe(400);
                  });

                  it('Pass', async () => {
                        otpMail = {
                              email: `${fakeData(10)}@gmail.com`,
                        };
                        const res = await reqApi(otpMail);
                        expect(res.status).toBe(201);
                  });

                  it('Failed (error of smail)', async () => {
                        otpMail = {
                              email: `${fakeData(10)}@gmail.com`,
                        };
                        const mySpy = jest.spyOn(mailService, 'sendOTPForUpdateEmail').mockImplementation(() => Promise.resolve(false));
                        try {
                              await reqApi(otpMail);
                        } catch (err) {
                              expect(err.status).toBe(500);
                        }
                        mySpy.mockClear();
                  });
            });
      });

      describe('update field of user', () => {
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

                        const getUser = await userRepository.findOneByField('_id', user._id);

                        expect(getUser.name.toLocaleLowerCase()).toBe(body.name.toLocaleLowerCase());
                        expect(getUser.username).toBe(user.username);
                        expect(res.status).toBe(200);
                  });
            });

            describe('Put /api/user/avatar', () => {
                  const reqApi = (input) =>
                        supertest(app.getHttpServer())
                              .put(`/api/user/avatar`)
                              .set({ cookie: cookieData })
                              .attach('avatar', `${__dirname}/../../../../test/testFile/${input}`);

                  it('Pass', async () => {
                        const awsSpy = jest.spyOn(awsService, 'uploadFile').mockImplementation(() => Promise.resolve(true));
                        const res = await reqApi('photo.png');
                        awsSpy.mockClear();
                        expect(res.status).toBe(200);
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

            describe('PUT /api/user/phone/:otp', () => {
                  let redisKey: string;
                  const reqApi = (redisKey) => supertest(app.getHttpServer()).put(`/api/user/phone/${redisKey}`).set({ cookie: cookieData }).send();

                  beforeAll(async () => {
                        redisKey = await authService.generateOTP(user, 2, 'sms');
                  });

                  it('Pass', async () => {
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
            });
            describe('PUT /api/user/email/:otp', () => {
                  let redisKey: string;
                  const reqApi = (redisKey) => supertest(app.getHttpServer()).put(`/api/user/email/${redisKey}`).set({ cookie: cookieData }).send();

                  beforeAll(async () => {
                        redisKey = await authService.generateOTP(user, 2, 'email');
                  });

                  it('Pass', async () => {
                        const beforeRedisKey = await redisService.getObjectByKey(redisKey);
                        const res = await reqApi(redisKey);
                        const afterRedisKey = await redisService.getObjectByKey(redisKey);
                        expect(res.status).toBe(200);
                        expect(beforeRedisKey).toBeDefined();
                        expect(afterRedisKey).toBeNull();
                  });

                  it('Failed (redis key is used)', async () => {
                        const res = await reqApi(123456);

                        expect(res.status).toBe(403);
                  });

                  it('Failed (redis expired)', async () => {
                        const res = await reqApi(redisKey);

                        expect(res.status).toBe(403);
                  });
            });
            describe('PUT /api/user/password/:otp', () => {
                  let user: User;
                  let redisKey: string;
                  let body: ChangePasswordDTO;
                  const reqApi = (body, redisKey) => supertest(app.getHttpServer()).put(`/api/user/password/${redisKey}`).send(body);

                  beforeAll(async () => {
                        user = fakeUser();
                        user.email = 'heaty566@gmail.com';
                        await userService.saveUser(user);
                        redisKey = await authService.generateOTP(user, 2, 'email');
                        body = {
                              newPassword: 'Password123',
                              confirmNewPassword: 'Password123',
                        };
                  });

                  it('Pass', async () => {
                        const beforeRedisKey = await redisService.getObjectByKey(redisKey);
                        const res = await reqApi(body, redisKey);
                        const getUser = await userRepository.findOneByField('_id', user._id);
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
                        const res = await reqApi(body, 123456);

                        expect(res.status).toBe(403);
                  });
            });
      });

      afterAll(async () => {
            await userRepository.clear();
            await app.close();
      });
});
