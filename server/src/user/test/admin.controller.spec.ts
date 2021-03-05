import * as supertest from 'supertest';
import { INestApplication } from '@nestjs/common';

//* Internal import
import { fakeUser } from '../../../test/fakeEntity';
import { UserRepository } from '../entities/user.repository';
import { initTestModule } from '../../../test/initTest';
import { UserController } from '../user.controller';
import { ChangePasswordDTO } from '../dto/changePassword.dto';
import { AuthService } from '../../auth/auth.service';
import { RedisService } from '../../utils/redis/redis.service';
import User from '../entities/user.entity';
import { UserRole } from '../entities/user.userRole.enum';
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
            const { getApp, module, adminCookie, getUser } = await initTestModule();
            app = getApp;
            user = getUser;
            userRepository = module.get<UserRepository>(UserRepository);
            authService = module.get<AuthService>(AuthService);
            redisService = module.get<RedisService>(RedisService);
            userController = module.get<UserController>(UserController);
            cookieData = adminCookie;
      });

      describe('GET api/admin/users', () => {
            const reqApi = (cookie) => supertest(app.getHttpServer()).get(`/api/admin/users`).set({ cookie }).send();

            it('Pass get all user', async () => {
                  const res = await reqApi(cookieData);

                  expect(res.body.data.length).toBeGreaterThanOrEqual(1);
            });
      });
      describe('PUT api/admin/user-admin/:id', () => {
            const reqApi = (cookie, userId: string) => supertest(app.getHttpServer()).put(`/api/admin/user-admin/${userId}`).set({ cookie }).send();

            it('Pass to be ADMIN', async () => {
                  await reqApi(cookieData, String(user._id));

                  const getUser = await userRepository.findOneByField('_id', user._id);
                  expect(getUser.role).toBe(UserRole.ADMIN);
            });
            it('Pass to be USER', async () => {
                  await reqApi(cookieData, String(user._id));

                  const getUser = await userRepository.findOneByField('_id', user._id);
                  expect(getUser.role).toBe(UserRole.USER);
            });
            it('Failed not found', async () => {
                  const res = await reqApi(cookieData, fakeData(50));
                  expect(res.status).toBe(400);
            });
      });
      describe('PUT /user-status/:id', () => {
            const reqApi = (cookie, userId: string) => supertest(app.getHttpServer()).put(`/api/admin/user-status/${userId}`).set({ cookie }).send();

            it('Pass to be false', async () => {
                  await reqApi(cookieData, String(user._id));

                  const getUser = await userRepository.findOneByField('_id', user._id);
                  expect(getUser.isDisabled).toBeTruthy();
            });
            it('Pass to be true', async () => {
                  await reqApi(cookieData, String(user._id));

                  const getUser = await userRepository.findOneByField('_id', user._id);
                  expect(getUser.isDisabled).toBeFalsy();
            });

            it('Failed not found', async () => {
                  const res = await reqApi(cookieData, fakeData(50));
                  expect(res.status).toBe(400);
            });
      });

      afterAll(async () => {
            await userRepository.clear();
            await app.close();
      });
});
