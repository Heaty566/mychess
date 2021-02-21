import * as supertest from 'supertest';
import { INestApplication } from '@nestjs/common';

//* Internal import
import { fakeUser } from '../../../test/fakeEntity';
import { UserRepository } from '../../user/entities/user.repository';
import { initTestModule } from '../../../test/initTest';
import { RegisterUserDTO } from '../dto/register.dto';
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

      afterAll(async () => {
            await userRepository.clear();
            await app.close();
      });
});
