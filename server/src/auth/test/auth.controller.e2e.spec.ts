import * as supertest from 'supertest';
import 'jest-ts-auto-mock';
let mockPromise = Promise.resolve();
import { defuse } from '../../../test/testHelper';
import { SmailService } from '../../providers/smail/smail.service';
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

import { INestApplication } from '@nestjs/common';

//* Internal import
import { fakeUser } from '../../../test/fakeEntity';
import { fakeData } from '../../../test/fakeData';
import { initTestModule } from '../../../test/initTest';

import { UserRepository } from '../../models/users/entities/user.repository';

import { AuthService } from '../auth.service';
import { UserService } from '../../models/users/user.service';

import { LoginUserDTO } from '../dto/loginUser.dto';
import { RegisterUserDTO } from '../dto/registerUser.dto';
import { UpdateEmailDTO } from '../../models/users/dto/updateEmail.dto';
import { OtpSmsDTO } from '../dto/otpSms.dto';

import { User } from '../../models/users/entities/user.entity';
import { ReTokenRepository } from '../entities/re-token.repository';

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
      beforeAll(async () => {
            const { getApp, module, getUser } = await initTestModule();
            app = getApp;
            userDB = getUser;
            userRepository = module.get<UserRepository>(UserRepository);

            reTokenRepository = module.get<ReTokenRepository>(ReTokenRepository);

            authService = module.get<AuthService>(AuthService);
            mailService = module.get<SmailService>(SmailService);
            userService = module.get<UserService>(UserService);
      });

      describe('Common Authentication', () => {
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
                        loginUserData.username = 'update';
                        const res = await reqApi(loginUserData);
                        expect(res.status).toBe(400);
                  });

                  it('Failed (password is not correct)', async () => {
                        loginUserData.password = '123AABBDASDaa';
                        const res = await reqApi(loginUserData);
                        expect(res.status).toBe(400);
                  });
            });
      });

      describe('OTP sms and email', () => {
            describe('POST /otp-sms', () => {
                  let otpSmsDTO: OtpSmsDTO;
                  const reqApi = (input: OtpSmsDTO) => supertest(app.getHttpServer()).post('/api/auth/otp-sms').send(input);

                  beforeEach(async () => {
                        otpSmsDTO = {
                              phoneNumber: userDB.phoneNumber,
                        };
                  });

                  it('Pass', async () => {
                        const res = await reqApi(otpSmsDTO);

                        expect(res.status).toBe(201);
                  });

                  it('Failed (error of sms service)', async () => {
                        mockPromise = defuse(new Promise((resolve, reject) => reject(new Error('Oops'))));
                        try {
                              await reqApi(otpSmsDTO);
                        } catch (err) {
                              expect(err.status).toBe(500);
                        }
                  });

                  it('Failed (phone number is not correct)', async () => {
                        otpSmsDTO = {
                              phoneNumber: fakeData(10, 'number'),
                        };
                        const res = await reqApi(otpSmsDTO);

                        expect(res.status).toBe(400);
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
                        const res = await reqApi(otpMail);
                        expect(res.status).toBe(201);
                  });

                  it('Failed (error of smail)', async () => {
                        otpMail = {
                              email: userDB.email,
                        };

                        const mySpy = jest.spyOn(mailService, 'sendOTP').mockImplementation(() => Promise.resolve(false));

                        try {
                              await reqApi(otpMail);
                        } catch (err) {
                              expect(err.status).toBe(500);
                        }
                        mySpy.mockClear();
                  });

                  it('Failed (email does not exist)', async () => {
                        otpMail = {
                              email: fakeData(10, 'lettersLowerCase') + '@gmail.com',
                        };
                        const res = await reqApi(otpMail);
                        expect(res.status).toBe(400);
                  });
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
                  const checkToken = await reTokenRepository.findOne({ where: { userId: new Object(user._id) } });

                  expect(checkToken).toBe(undefined);
                  expect(res.status).toBe(201);
            });
      });

      afterAll(async () => {
            await reTokenRepository.clear();
            await userRepository.clear();
            await app.close();
      });
});
