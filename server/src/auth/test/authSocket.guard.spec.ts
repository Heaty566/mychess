import { ExecutionContext, INestApplication } from '@nestjs/common';

//* Internal import
import { UserRepository } from '../../users/entities/user.repository';
import { initTestModule } from '../../../test/initTest';
import { UserSocketGuard } from '../authSocket.guard';
import { ReTokenRepository } from '../entities/re-token.repository';

import { createMock } from 'ts-auto-mock';
import { RedisService } from '../../providers/redis/redis.service';
import * as Cookie from 'cookie';

jest.mock('cookie', () => {
      return {
            parse: jest.fn(),
      };
});

describe('UserSocketGuard', () => {
      let app: INestApplication;

      let userRepository: UserRepository;
      let reTokenRepository: ReTokenRepository;
      let redisService: RedisService;
      let context: () => ExecutionContext;

      beforeAll(async () => {
            const { getApp, module } = await initTestModule();
            app = getApp;

            userRepository = module.get<UserRepository>(UserRepository);
            reTokenRepository = module.get<ReTokenRepository>(ReTokenRepository);

            redisService = module.get<RedisService>(RedisService);

            context = () =>
                  createMock<ExecutionContext>({
                        switchToWs: jest.fn().mockReturnValue({
                              getClient: jest.fn().mockReturnValue({
                                    handshake: {
                                          headers: {
                                                cookies: {},
                                          },
                                    },
                              }),
                        }),
                  });
      });

      describe('canActivate Admin Role', () => {
            let userSocketGuard: UserSocketGuard;

            beforeEach(() => {
                  userSocketGuard = new UserSocketGuard(redisService);
            });

            it('Pass', async () => {
                  redisService.setObjectByKey('1234', { username: '123' });
                  const cookieSpy = jest.spyOn(Cookie, 'parse');
                  cookieSpy.mockReturnValue({ 'io-token': '1234' });

                  const res = await userSocketGuard.canActivate(context());
                  expect(res).toBeTruthy();
            });

            it('Failed redis key does not exist', async () => {
                  const cookieSpy = jest.spyOn(Cookie, 'parse');
                  cookieSpy.mockReturnValue({ 'io-token': '124' });

                  const res = await userSocketGuard.canActivate(context());
                  expect(res).toBeFalsy();
            });

            it('Failed does not have io-token', async () => {
                  const cookieSpy = jest.spyOn(Cookie, 'parse');
                  cookieSpy.mockReturnValue({ 'io-token': '' });

                  const res = await userSocketGuard.canActivate(context());
                  expect(res).toBeFalsy();
            });
      });

      afterAll(async () => {
            await reTokenRepository.createQueryBuilder().delete().execute();
            await userRepository.createQueryBuilder().delete().execute();
            await app.close();
      });
});
