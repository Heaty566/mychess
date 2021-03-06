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
import { createMock } from 'ts-auto-mock';
import { Request, Response } from 'express';

//* Internal import
import { fakeUser } from '../../../test/fakeEntity';
import { fakeData } from '../../../test/fakeData';
import { initTestModule } from '../../../test/initTest';

import { UserRepository } from '../../user/entities/user.repository';

import { AuthController } from '../auth.controller';

import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';

import { LoginUserDTO } from '../dto/loginUser.dto';
import { RegisterUserDTO } from '../dto/registerUser.dto';
import { UpdateEmailDTO } from '../../user/dto/updateEmail.dto';
import { OtpSmsDTO } from '../dto/otpSms.dto';

import { User } from '../../user/entities/user.entity';

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
      let authController: AuthController;
      beforeAll(async () => {
            const { getApp, module, getUser } = await initTestModule();
            app = getApp;
            userDB = getUser;
            userRepository = module.get<UserRepository>(UserRepository);

            authController = module.get<AuthController>(AuthController);

            authService = module.get<AuthService>(AuthService);
            mailService = module.get<SmailService>(SmailService);
            userService = module.get<UserService>(UserService);
      });

      describe('3rd Authentication', () => {
            describe('googleAuth | facebookAuth | githubAuth', () => {
                  it('googleAuth', async () => {
                        const res = await authController.cGoogleAuth();
                        expect(res).toBeUndefined();
                  });
                  it('facebookAuth', async () => {
                        const res = await authController.cFacebookAuth();
                        expect(res).toBeUndefined();
                  });
                  it('githubAuth', async () => {
                        const res = await authController.cGithubAuth();
                        expect(res).toBeUndefined();
                  });
            });

            describe('googleAuthRedirect | facebookAuthRedirect | githubAuthRedirect', () => {
                  let req: Request;
                  let res: Response;

                  beforeEach(() => {
                        req = createMock<Request>();
                        req.user = fakeUser();
                        res = createMock<Response>();
                        res.cookie = jest.fn().mockReturnValue({
                              redirect: (url) => url,
                        });
                  });

                  it('googleAuthRedirect', async () => {
                        const output = await authController.cGoogleAuthRedirect(req, res);

                        expect(output).toBe(process.env.CLIENT_URL);
                  });
                  it('facebookAuthRedirect', async () => {
                        const output = await authController.cFacebookAuthRedirect(req, res);

                        expect(output).toBe(process.env.CLIENT_URL);
                  });
                  it('githubAuthRedirect', async () => {
                        const output = await authController.cGithubAuthRedirect(req, res);

                        expect(output).toBe(process.env.CLIENT_URL);
                  });
            });
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

      afterAll(async () => {
            await userRepository.clear();
            await app.close();
      });
});
