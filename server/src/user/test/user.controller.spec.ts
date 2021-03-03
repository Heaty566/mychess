import * as supertest from 'supertest';
import { INestApplication } from '@nestjs/common';

//* Internal import
import { fakeUser } from '../../../test/fakeEntity';
import { UserRepository } from '../../user/entities/user.repository';
import { initTestModule } from '../../../test/initTest';
import { UserController } from '../user.controller';

describe('UserController', () => {
      let app: INestApplication;
      let userRepository: UserRepository;
      let userController: UserController;
      let cookieData: Array<string>;
      beforeAll(async () => {
            const { getApp, module, cookie } = await initTestModule();
            app = getApp;
            userRepository = module.get<UserRepository>(UserRepository);
            userController = module.get<UserController>(UserController);
            cookieData = cookie;
      });

      describe('GET /', () => {
            const reqApi = () => supertest(app.getHttpServer()).get('/api/user/').set('Cookie', cookieData).send();

            it('Pass', async () => {
                  const res = await reqApi();
                  expect(res.body.data).toBeDefined();
            });
      });

      afterAll(async () => {
            await userRepository.clear();
            await app.close();
      });
});
