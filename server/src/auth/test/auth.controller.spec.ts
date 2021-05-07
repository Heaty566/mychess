import { INestApplication } from '@nestjs/common';
import { createMock } from 'ts-auto-mock';
import { Request, Response } from 'express';

//---- Helper
import { initTestModule } from '../../test/initTest';

//---- Controller
import { AuthController } from '../auth.controller';

//---- Entity
import User from '../../user/entities/user.entity';

describe('AuthController', () => {
      let app: INestApplication;

      let user: User;
      let authController: AuthController;

      let resetDB: any;
      beforeAll(async () => {
            const { getApp, module, users, resetDatabase } = await initTestModule();
            app = getApp;
            user = (await users[0]).user;
            resetDB = resetDatabase;

            authController = module.get<AuthController>(AuthController);
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
            await resetDB();
            await app.close();
      });
});
