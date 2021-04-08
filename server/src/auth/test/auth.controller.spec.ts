import { INestApplication } from '@nestjs/common';
import { createMock } from 'ts-auto-mock';
import { Request, Response } from 'express';

//* Internal import
import { initTestModule } from '../../../test/initTest';

import { UserRepository } from '../../models/users/entities/user.repository';

import { AuthController } from '../auth.controller';
import { ReTokenRepository } from '../entities/re-token.repository';
import User from '../../models/users/entities/user.entity';

describe('AuthController', () => {
      let app: INestApplication;

      let userRepository: UserRepository;
      let user: User;
      let authController: AuthController;
      let reTokenRepository: ReTokenRepository;
      beforeAll(async () => {
            const { getApp, module, getUser } = await initTestModule();
            app = getApp;
            user = getUser;
            userRepository = module.get<UserRepository>(UserRepository);
            authController = module.get<AuthController>(AuthController);
            reTokenRepository = module.get<ReTokenRepository>(ReTokenRepository);
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
                        req.user = user;
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

      afterAll(async () => {
            await reTokenRepository.clear();
            await userRepository.clear();
            await app.close();
      });
});
