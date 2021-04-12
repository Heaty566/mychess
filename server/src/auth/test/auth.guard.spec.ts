import { ExecutionContext, INestApplication } from '@nestjs/common';

//* Internal import
import { UserRepository } from '../../users/entities/user.repository';
import { initTestModule } from '../../../test/initTest';
import { AuthService } from '../auth.service';
import { User } from '../../users/entities/user.entity';
import { ReTokenRepository } from '../entities/re-token.repository';
import { Request, Response } from 'express';
import { UserGuard } from '../auth.guard';
import { createMock } from 'ts-auto-mock';
import { RedisService } from '../../providers/redis/redis.service';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/entities/user.userRole.enum';

describe('MyAuthGuard', () => {
      let app: INestApplication;
      let user: User;

      let userRepository: UserRepository;
      let reTokenRepository: ReTokenRepository;

      let authService: AuthService;
      let redisService: RedisService;

      let authGuard: UserGuard;
      let reToken: string;
      let context: (cookies) => ExecutionContext;

      beforeAll(async () => {
            const { getApp, module, getReToken, getUser } = await initTestModule();
            app = getApp;
            user = getUser;
            reToken = getReToken;

            userRepository = module.get<UserRepository>(UserRepository);
            reTokenRepository = module.get<ReTokenRepository>(ReTokenRepository);

            authService = module.get<AuthService>(AuthService);
            redisService = module.get<RedisService>(RedisService);

            const reflector = createMock<Reflector>({ get: jest.fn().mockReturnValue(UserRole.USER) });
            authGuard = new UserGuard(authService, reflector);

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

      describe('canActivate Admin Role', () => {
            let authGuardAdmin: UserGuard;

            beforeAll(async () => {
                  const reflector = createMock<Reflector>({ get: jest.fn().mockReturnValue(UserRole.ADMIN) });
                  authGuardAdmin = new UserGuard(authService, reflector);
            });

            it('Failed with role Admin', async () => {
                  const contextTracker = context({ 're-token': reToken });
                  try {
                        await authGuardAdmin.canActivate(contextTracker);
                  } catch (err) {
                        expect(err).toBeDefined();
                  }
            });
      });

      describe('canActivate common case', () => {
            it('Pass', async () => {
                  const contextTracker = context({ 're-token': reToken });
                  const res = await authGuard.canActivate(contextTracker);
                  const getUser = contextTracker.switchToHttp().getRequest().user;

                  expect(getUser.username).toBe(user.username);
                  expect(res).toBeTruthy();
            });

            it('Pass has re-token but invalid auth-token', async () => {
                  const contextTracker = context({ 're-token': reToken, 'auth-token': '123' });

                  const res = await authGuard.canActivate(contextTracker);
                  const getUser = contextTracker.switchToHttp().getRequest().user;

                  expect(getUser.username).toBe(user.username);
                  expect(res).toBeTruthy();
            });

            it('Pass have auth-token', async () => {
                  const reTokenId = await authService.createReToken(user);
                  const reToken = await reTokenRepository.findOneByField('id', reTokenId);

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
                  const authToken = await authService.getAuthTokenByReToken(reToken);
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
                  const reToken = await reTokenRepository.findOneByField('id', authToken);
                  redisService.setByValue(reToken.data, '123', 0);
                  const contextTracker = context({
                        're-token': reToken.id,
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

            it('Failed (isDisable user)', async () => {
                  user.isDisabled = true;
                  const reToken = await authService.createReToken(user);
                  const contextTracker = context({ 're-token': reToken });
                  try {
                        await authGuard.canActivate(contextTracker);
                  } catch (err) {
                        expect(err).toBeDefined();
                  }
            });
      });

      afterAll(async () => {
            await reTokenRepository.createQueryBuilder().delete().execute();
            await userRepository.createQueryBuilder().delete().execute();
            await app.close();
      });
});
