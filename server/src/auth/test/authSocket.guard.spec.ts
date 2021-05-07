import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as Cookie from 'cookie';
import { createMock } from 'ts-auto-mock';

//---- Service
import { RedisService } from '../../utils/redis/redis.service';

//---- Pipe
import { UserSocketGuard } from '../authSocket.guard';

//---- Helper
import { initTestModule } from '../../test/initTest';

jest.mock('cookie', () => {
      return {
            parse: jest.fn(),
      };
});

describe('UserSocketGuard', () => {
      let app: INestApplication;
      let redisService: RedisService;
      let context: () => ExecutionContext;
      let headerCookieMock = '';
      const cookieSpy = jest.spyOn(Cookie, 'parse');
      let resetDB: any;

      beforeAll(async () => {
            const { getApp, module, resetDatabase } = await initTestModule();
            app = getApp;
            resetDB = resetDatabase;

            redisService = module.get<RedisService>(RedisService);

            context = () =>
                  createMock<ExecutionContext>({
                        switchToWs: jest.fn().mockReturnValue({
                              getClient: jest.fn().mockReturnValue({
                                    handshake: {
                                          headers: {
                                                cookie: headerCookieMock,
                                          },
                                    },
                              }),
                        }),
                  });
      });

      describe('canActivate', () => {
            describe('canActivate Admin Role', () => {
                  let userSocketGuard: UserSocketGuard;

                  beforeEach(() => {
                        userSocketGuard = new UserSocketGuard(redisService);
                  });

                  it('Pass', async () => {
                        redisService.setObjectByKey('1234', { username: '123' });
                        cookieSpy.mockReturnValue({ 'io-token': '1234' });
                        headerCookieMock = 'io=1;';

                        const res = await userSocketGuard.canActivate(context());
                        expect(res).toBeTruthy();
                        cookieSpy.mockClear();
                  });
                  it('Failed wrong token', async () => {
                        redisService.setObjectByKey('1234', { username: '123' });
                        cookieSpy.mockReturnValue({ 'io-token': '1234' });
                        headerCookieMock = '';

                        try {
                              await userSocketGuard.canActivate(context());
                        } catch ({ error }) {
                              expect(error.statusCode).toBe(401);
                        }

                        cookieSpy.mockClear();
                  });

                  it('Failed redis key does not exist', async () => {
                        headerCookieMock = 'io=1;';
                        cookieSpy.mockReturnValue({ 'io-token': '124' });
                        try {
                              await userSocketGuard.canActivate(context());
                        } catch ({ error }) {
                              expect(error.statusCode).toBe(401);
                        }

                        cookieSpy.mockClear();
                  });

                  it('Failed does not have io-token', async () => {
                        headerCookieMock = 'io=1;';
                        cookieSpy.mockReturnValue({ 'io-token': '' });

                        try {
                              await userSocketGuard.canActivate(context());
                        } catch ({ error }) {
                              expect(error.statusCode).toBe(401);
                        }

                        cookieSpy.mockClear();
                  });
            });
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
