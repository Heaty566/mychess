import { ExecutionContext, INestApplication } from '@nestjs/common';

//* Internal import
import { UserRepository } from '../../user/entities/user.repository';
import { initTestModule } from '../../../test/initTest';
import { AuthService } from '../auth.service';
import { User } from '../../user/entities/user.entity';
import { ReTokenRepository } from '../entities/re-token.repository';
import { Request, Response } from 'express';
import { MyAuthGuard } from '../auth.guard';
import { createMock } from 'ts-auto-mock';
import { RedisService } from '../../utils/redis/redis.service';
import { Reflector } from '@nestjs/core';

describe('AuthService', () => {
      let app: INestApplication;
      let userRepository: UserRepository;
      let reTokenRepository: ReTokenRepository;
      let authService: AuthService;
      let authGuard: MyAuthGuard;
      let reToken: string;
      let user: User;
      let context: (cookies) => ExecutionContext;
      let redisService: RedisService;
      beforeAll(async () => {
            const { getApp, module, getReToken, getUser } = await initTestModule();
            app = getApp;
            reToken = getReToken;
            user = getUser;
            userRepository = module.get<UserRepository>(UserRepository);
            authService = module.get<AuthService>(AuthService);
            reTokenRepository = module.get<ReTokenRepository>(ReTokenRepository);
            reTokenRepository = module.get<ReTokenRepository>(ReTokenRepository);
            redisService = module.get<RedisService>(RedisService);
            authGuard = new MyAuthGuard(authService, new Reflector());

            context = (cookies) =>
                  createMock<ExecutionContext>({
                        switchToHttp: jest.fn().mockReturnValue({
                              getRequest: jest.fn().mockReturnValue(
                                    createMock<Request>({ cookies: { ...cookies }, user: null }),
                              ),
                              getResponse: jest.fn().mockReturnValue(createMock<Response>()),
                        }),
                  });
      });

      describe('canActivate', () => {
            it('Pass', async () => {
                  const contextTracker = context({ 're-token': reToken });

                  const res = await authGuard.canActivate(contextTracker);
                  const getUser = contextTracker.switchToHttp().getRequest().user;

                  expect(getUser.username).toBe(user.username);
                  expect(res).toBeTruthy();
            });

            it('Pass have auth-token', async () => {
                  const reTokenId = await authService.createReToken(user);
                  const reToken = await reTokenRepository.findOneByField('_id', reTokenId);

                  const contextTracker = context({
                        're-token': '132',
                        'auth-token': reToken.data,
                  });
                  const res = await authGuard.canActivate(contextTracker);
                  const getUser = contextTracker.switchToHttp().getRequest().user;
                  expect(getUser.username).toBe(user.username);
                  expect(res).toBeTruthy();
            });

            it('Failed invalid auth-token', async () => {
                  const contextTracker = context({
                        're-token': '132',
                        'auth-token': '123',
                  });

                  try {
                        await authGuard.canActivate(contextTracker);
                  } catch (err) {
                        expect(err).toBeDefined();
                  } finally {
                        const getUser = contextTracker.switchToHttp().getRequest().user;
                        expect(getUser).toBeNull();
                  }
            });

            it('Failed not token provide', async () => {
                  const contextTracker = context({});
                  try {
                        await authGuard.canActivate(contextTracker);
                  } catch (err) {
                        expect(err).toBeDefined();
                  } finally {
                        const getUser = contextTracker.switchToHttp().getRequest().user;
                        expect(getUser).toBeNull();
                  }
            });

            it('Failed re-token no provide', async () => {
                  const authToken = await authService.getAuthTokenFromReToken(reToken);
                  const contextTracker = context({
                        'auth-token': authToken,
                  });
                  try {
                        await authGuard.canActivate(contextTracker);
                  } catch (err) {
                        expect(err).toBeDefined();
                  } finally {
                        const getUser = contextTracker.switchToHttp().getRequest().user;
                        expect(getUser).toBeNull();
                  }
            });

            it('Failed invalid re-token', async () => {
                  const contextTracker = context({
                        're-token': '123',
                  });

                  try {
                        await authGuard.canActivate(contextTracker);
                  } catch (err) {
                        expect(err).toBeDefined();
                  } finally {
                        const getUser = contextTracker.switchToHttp().getRequest().user;
                        expect(getUser).toBeNull();
                  }
            });

            it('Failed invalid re-token (invalid)', async () => {
                  const authToken = await authService.createReToken(user);
                  const reToken = await reTokenRepository.findOneByField('_id', authToken);
                  redisService.setByValue(reToken.data, '123', 0);
                  const contextTracker = context({
                        're-token': reToken._id,
                  });

                  try {
                        await authGuard.canActivate(contextTracker);
                  } catch (err) {
                        expect(err).toBeDefined();
                  } finally {
                        const getUser = contextTracker.switchToHttp().getRequest().user;
                        expect(getUser).toBeNull();
                  }
            });
      });

      afterAll(async () => {
            await reTokenRepository.clear();
            await userRepository.clear();
            await app.close();
      });
});
