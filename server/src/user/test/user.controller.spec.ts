import * as supertest from 'supertest';
import { INestApplication } from '@nestjs/common';

//* Internal import
import { fakeUser } from '../../../test/fakeEntity';
import { UserRepository } from '../../user/entities/user.repository';
import { initTestModule } from '../../../test/initTest';
import { UserController } from '../user.controller';
import { ChangePasswordDTO } from '../dto/changePassword.dto';
import { AuthService } from '../../auth/auth.service';
import { RedisService } from '../../utils/redis/redis.service';
import { User } from '../entities/user.entity';
import { OtpSmsDTO } from '../../auth/dto/otpSms.dto';
import { fakeData } from '../../../test/fakeData';

describe('UserController', () => {
      let app: INestApplication;
      let userRepository: UserRepository;
      let userController: UserController;
      let authService: AuthService;
      let redisService: RedisService;
      let cookieData: Array<string>;
      let user: User;

      beforeAll(async () => {
            const { getApp, module, cookie, getUser } = await initTestModule();
            app = getApp;
            userRepository = module.get<UserRepository>(UserRepository);
            authService = module.get<AuthService>(AuthService);
            redisService = module.get<RedisService>(RedisService);
            userController = module.get<UserController>(UserController);
            cookieData = cookie;
            user = getUser;
      });

      describe('POST /otp-update-phone', () => {
            let otpSmsDTO: OtpSmsDTO;
            const reqApi = (input: OtpSmsDTO) =>
                  supertest(app.getHttpServer()).post('/api/user/otp-update-phone').set({ cookie: cookieData }).send(input);

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
                  console.log(res.body);
                  expect(res.status).toBe(201);
            });

            // it('Failed (error of sms service)', async () => {
            //       mockPromise = defuse(new Promise((resolve, reject) => reject(new Error('Oops'))));
            //       try {
            //             await reqApi(otpSmsDTO);
            //       } catch (err) {
            //             expect(err.status).toBe(500);
            //       }
            // });

            it('Failed (phone number is already exist)', async () => {
                  const res = await reqApi(otpSmsDTO);
                  expect(res.status).toBe(400);
            });
      });

      describe('PUT /api/user/update-phone/:otp', () => {
            let redisKey: string;
            const reqApi = (redisKey) => supertest(app.getHttpServer()).put(`/api/user/update-phone/${redisKey}`).set({ cookie: cookieData }).send();

            beforeAll(async () => {
                  redisKey = await authService.generateKeyForSms(user, 2);
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

      describe('PUT /api/user/reset-password/:otp', () => {
            let user: User;
            let redisKey: string;
            let body: ChangePasswordDTO;
            const reqApi = (body, redisKey) => supertest(app.getHttpServer()).put(`/api/user/reset-password/${redisKey}`).send(body);

            beforeAll(async () => {
                  user = fakeUser();
                  user.email = 'heaty566@gmail.com';
                  await authService.saveUser(user);
                  redisKey = await authService.createOTPRedisKey(user, 2);
                  body = {
                        newPassword: 'Password123',
                        confirmNewPassword: 'Password123',
                  };
            });

            it('Pass', async () => {
                  const beforeRedisKey = await redisService.getObjectByKey(redisKey);
                  const res = await reqApi(body, redisKey);
                  const getUser = await userRepository.findOneByField('_id', user._id);
                  const isMatch = await authService.comparePassword(body.newPassword, getUser.password);
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

      describe('GET /', () => {
            const reqApi = () => supertest(app.getHttpServer()).get('/api/user/').set({ cookie: cookieData }).send();

            it('Pass', async () => {
                  const res = await reqApi();
                  expect(res.body.data).toBeDefined();
            });
      });

      afterAll(async () => {
            await userRepository.clear();
            await app.close();
      });
});
