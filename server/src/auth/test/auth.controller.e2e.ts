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
import 'jest-ts-auto-mock';
import { INestApplication } from '@nestjs/common';

//---- Helper
import { initTestModule } from '../../test/initTest';
import { fakeUser } from '../../test/fakeEntity';
import { fakeData, defuse } from '../../test/test.helper';

//---- Repository
import { UserRepository } from '../../user/entities/user.repository';
import { ReTokenRepository } from '../entities/re-token.repository';

//---- Entity
import { User } from '../../user/entities/user.entity';

//---- Service
import { SmailService } from '../../providers/smail/smail.service';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';

//---- DTO
import { LoginUserDTO } from '../dto/loginUser.dto';
import { RegisterUserDTO } from '../dto/registerUser.dto';
import { UpdateEmailDTO } from '../../user/dto/updateEmail.dto';
import { OtpSmsDTO } from '../dto/otpSms.dto';

jest.mock('twilio', () => {
      return {
            Twilio: TwilioMock,
      };
});

describe('AuthController', () => {
      let app: INestApplication;
      let userDB: User;

      let userRepository: UserRepository;

      let authService: AuthService;
      let userService: UserService;
      let mailService: SmailService;
      let reTokenRepository: ReTokenRepository;
      let resetDB: any;

      beforeAll(async () => {
            const { getApp, module, users, resetDatabase } = await initTestModule();
            app = getApp;
            userDB = (await users[0]).user;
            resetDB = resetDatabase;
            userRepository = module.get<UserRepository>(UserRepository);
            reTokenRepository = module.get<ReTokenRepository>(ReTokenRepository);
            authService = module.get<AuthService>(AuthService);
            mailService = module.get<SmailService>(SmailService);
            userService = module.get<UserService>(UserService);
      });

      describe('Common Authentication', () => {
            describe('POST /login', () => {
                  let loginUserData: LoginUserDTO;
                  const reqApi = (input: LoginUserDTO) => supertest(app.getHttpServer()).post('/api/auth/login').send(input);

                  beforeEach(async () => {
                        const getUser = fakeUser();
                        loginUserData = {
                              username: getUser.username,
                              password: getUser.password,
                        };
                        getUser.password = await authService.encryptString(getUser.password);
                        await userService.saveUser(getUser);
                  });

                  it('Pass', async () => {
                        const res = await reqApi(loginUserData);

                        const token = res.headers['set-cookie'].join('');
                        expect(token).toContain('re-token');
                  });

                  it('Failed (username is not correct)', async () => {
                        loginUserData.username = 'updateaaabbbccc';
                        const res = await reqApi(loginUserData);
                        expect(res.status).toBe(400);
                  });

                  it('Failed (password is not correct)', async () => {
                        loginUserData.password = '123AABBDASDaa';
                        const res = await reqApi(loginUserData);
                        expect(res.status).toBe(400);
                  });
            });

            describe('POST /register', () => {
                  let createUserData: RegisterUserDTO;
                  const reqApi = (input: RegisterUserDTO) => supertest(app.getHttpServer()).post('/api/auth/register').send(input);

                  beforeEach(() => {
                        const getUser = fakeUser();
                        createUserData = {
                              name: getUser.name,
                              username: getUser.username,
                              password: getUser.password,
                              confirmPassword: getUser.password,
                        };
                  });

                  it('Pass', async () => {
                        const res = await reqApi(createUserData);

                        const token = res.headers['set-cookie'].join('');
                        expect(token).toContain('re-token');
                  });

                  it('Failed (username is taken)', async () => {
                        await reqApi(createUserData);
                        const res = await reqApi(createUserData);
                        expect(res.status).toBe(400);
                  });

                  it('Failed (confirmPassword does not match)', async () => {
                        createUserData.confirmPassword = '12345678';
                        const res = await reqApi(createUserData);

                        expect(res.status).toBe(400);
                  });
            });

            describe('GET /socket-token', () => {
                  let user: User;
                  let reToken: string;
                  const reqApi = (reToken: string) =>
                        supertest(app.getHttpServer())
                              .get('/api/auth/socket-token')
                              .set({ cookie: `re-token=${reToken};` })
                              .send();

                  beforeEach(async () => {
                        user = await userRepository.save(fakeUser());
                        reToken = await authService.createReToken(user);
                  });

                  it('Pass', async () => {
                        const res = await reqApi(reToken);

                        const token = res.headers['set-cookie'].join('');

                        expect(token).toContain('io-token');
                        expect(res.status).toBe(200);
                  });

                  it('Failed invalid user', async () => {
                        const res = await reqApi('');

                        const token = res.headers['set-cookie'].join('');
                        expect(token).not.toContain('io-token');
                        expect(res.status).toBe(401);
                  });

                  it('Failed user does not exist ', async () => {
                        await userRepository.createQueryBuilder().delete().where('id = :value', { value: user.id }).execute();
                        const res = await reqApi(reToken);

                        const token = res.headers['set-cookie'].join('');
                        expect(token).not.toContain('io-token');
                        expect(res.status).toBe(401);
                  });
            });

            describe('POST /logout', () => {
                  let user: User;
                  let reToken: string;
                  const reqApi = (reToken: string) =>
                        supertest(app.getHttpServer())
                              .post(`/api/auth/logout`)
                              .set({ cookie: `re-token=${reToken};` })
                              .send();

                  beforeEach(async () => {
                        user = await userRepository.save(fakeUser());
                        reToken = await authService.createReToken(user);
                  });

                  it('Pass', async () => {
                        const res = await reqApi(reToken);
                        const checkToken = await reTokenRepository.findOne({ where: { userId: user.id } });

                        expect(checkToken).toBe(undefined);
                        expect(res.status).toBe(201);
                  });
            });
      });

      describe('OTP authentication without guard', () => {
            describe('POST /otp-sms', () => {
                  let otpSmsDTO: OtpSmsDTO;
                  const reqApi = (input: OtpSmsDTO) => supertest(app.getHttpServer()).post('/api/auth/otp-sms').send(input);

                  beforeEach(async () => {
                        otpSmsDTO = {
                              phoneNumber: userDB.phoneNumber,
                        };
                  });

                  it('Pass', async () => {
                        const mySpy = jest.spyOn(authService, 'isRateLimitKey').mockImplementation(() => Promise.resolve(true));
                        const res = await reqApi(otpSmsDTO);
                        expect(res.status).toBe(201);

                        mySpy.mockClear();
                  });

                  it('Failed (error of sms service)', async () => {
                        mockPromise = defuse(new Promise((resolve, reject) => reject(new Error('Oops'))));
                        try {
                              await reqApi(otpSmsDTO);
                        } catch (err) {
                              expect(err.status).toBe(500);
                        }
                  });

                  it('Failed (phone does not exist)', async () => {
                        otpSmsDTO.phoneNumber = '+84904233099';
                        try {
                              await reqApi(otpSmsDTO);
                        } catch (err) {
                              expect(err.status).toBe(400);
                        }
                  });

                  it('Failed (spam ip)', async () => {
                        const mySpy = jest.spyOn(authService, 'isRateLimitKey').mockImplementation(() => Promise.resolve(false));

                        try {
                              await reqApi(otpSmsDTO);
                        } catch (err) {
                              expect(err.status).toBe(400);
                        }

                        mySpy.mockClear();
                  });

                  it('Failed (spam sms)', async () => {
                        const mySpy = jest
                              .spyOn(authService, 'isRateLimitKey')
                              .mockImplementation(jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(false));

                        try {
                              await reqApi(otpSmsDTO);
                        } catch (err) {
                              expect(err.status).toBe(400);
                        }

                        mySpy.mockClear();
                  });

                  it('Failed (phone number is not correct)', async () => {
                        const mySpy = jest.spyOn(authService, 'isRateLimitKey').mockImplementation(() => Promise.resolve(true));

                        otpSmsDTO = {
                              phoneNumber: fakeData(10, 'number'),
                        };
                        const res = await reqApi(otpSmsDTO);

                        expect(res.status).toBe(400);

                        mySpy.mockClear();
                  });
            });

            describe('POST /otp-email', () => {
                  let otpMail: UpdateEmailDTO;
                  const reqApi = (input: UpdateEmailDTO) => supertest(app.getHttpServer()).post('/api/auth/otp-email').send(input);

                  beforeEach(() => {
                        otpMail = {
                              email: userDB.email,
                        };
                  });

                  it('Pass', async () => {
                        const mySpy = jest.spyOn(authService, 'isRateLimitKey').mockImplementation(() => Promise.resolve(true));

                        const res = await reqApi(otpMail);
                        expect(res.status).toBe(201);

                        mySpy.mockClear();
                  });

                  it('Failed (error of smail)', async () => {
                        const mySpy = jest.spyOn(mailService, 'sendOTP').mockImplementation(() => Promise.resolve(false));

                        try {
                              await reqApi(otpMail);
                        } catch (err) {
                              expect(err.status).toBe(500);
                        }
                        mySpy.mockClear();
                  });

                  it('Failed (spam ip)', async () => {
                        const mySpy = jest.spyOn(authService, 'isRateLimitKey').mockImplementation(() => Promise.resolve(false));

                        try {
                              await reqApi(otpMail);
                        } catch (err) {
                              expect(err.status).toBe(400);
                        }

                        mySpy.mockClear();
                  });

                  it('Failed (spam email)', async () => {
                        const mySpy = jest
                              .spyOn(authService, 'isRateLimitKey')
                              .mockImplementation(jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(false));

                        try {
                              await reqApi(otpMail);
                        } catch (err) {
                              expect(err.status).toBe(400);
                        }

                        mySpy.mockClear();
                  });

                  it('Failed (email does not exist)', async () => {
                        const mySpy = jest.spyOn(authService, 'isRateLimitKey').mockImplementation(() => Promise.resolve(true));

                        otpMail = {
                              email: fakeData(10, 'lettersLowerCase') + '@gmail.com',
                        };
                        const res = await reqApi(otpMail);
                        expect(res.status).toBe(400);

                        mySpy.mockClear();
                  });
            });

            describe('POST /check-otp?key=', () => {
                  const reqApi = (input: string) => supertest(app.getHttpServer()).post(`/api/auth/check-otp?key=${input}`).send();

                  it('Pass', async () => {
                        const otp = await authService.createOTP(userDB, 10, 'email');
                        const res = await reqApi(otp);

                        expect(res.status).toBe(201);
                  });

                  it('Failed (otp does not exist)', async () => {
                        try {
                              await reqApi('123456789');
                        } catch (err) {
                              expect(err.status).toBe(403);
                        }
                  });

                  it('Failed (does not have key)', async () => {
                        try {
                              await reqApi('');
                        } catch (err) {
                              expect(err.status).toBe(403);
                        }
                  });
            });
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
