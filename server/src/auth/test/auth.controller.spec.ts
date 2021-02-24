import * as supertest from 'supertest';
import { INestApplication } from '@nestjs/common';

//* Internal import
import { fakeUser } from '../../../test/fakeEntity';
import { UserRepository } from '../../user/entities/user.repository';
import { initTestModule } from '../../../test/initTest';
import { RegisterUserDTO } from '../dto/register.dto';
import { LoginUserDTO } from '../dto/login.dto';
import { User } from '../../user/entities/user.entity';

import { AuthService } from '../auth.service';

describe('AuthController', () => {
      let app: INestApplication;
      let userRepository: UserRepository;
      let authService: AuthService;

      beforeAll(async () => {
            const { getApp, module } = await initTestModule();
            app = getApp;

            userRepository = module.get<UserRepository>(UserRepository);
            authService = module.get<AuthService>(AuthService);
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

                  expect(res.headers['set-cookie']).toBeDefined();
                  expect(res.status).toBe(201);
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
                  await authService.registerUser(getUser);
                  loginUserData = {
                        username: getUser.username,
                        password: getUser.password,
                  };
            });

            it('Pass', async () => {
                  const res = await reqApi(loginUserData);

                  const token = res.headers['set-cookie'].join('');
                  expect(token).toContain('refresh-token');
            });

            it('Failed (username is not correct)', async () => {
                  loginUserData.username = 'update';
                  const res = await reqApi(loginUserData);
                  expect(res.status).toBe(400);
            });

            it('Failed (password is not correct)', async () => {
                  loginUserData.password = 'update';
                  const res = await reqApi(loginUserData);
                  expect(res.status).toBe(400);
            });
      });

      afterAll(async () => {
            await userRepository.clear();
            await app.close();
      });
});
