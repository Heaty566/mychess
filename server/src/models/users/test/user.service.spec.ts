import { INestApplication } from '@nestjs/common';

import { UserRepository } from '../entities/user.repository';
import { initTestModule } from '../../../../test/initTest';
import { User } from '../entities/user.entity';
import { fakeData } from '../../../../test/fakeData';
import { UserService } from '../user.service';

describe('UserService', () => {
      let app: INestApplication;
      let userRepository: UserRepository;
      let userService: UserService;
      let userDb: User;

      beforeAll(async () => {
            const { getUser, getApp, module } = await initTestModule();
            app = getApp;
            userDb = getUser;
            userRepository = module.get<UserRepository>(UserRepository);
            userService = module.get<UserService>(UserService);
      });

      describe('findOneUserByField', () => {
            it('Pass', async () => {
                  const res = await userService.findOneUserByField('_id', userDb._id);
                  expect(res).toBeDefined();
            });
            it('Failed user does not exist', async () => {
                  const res = await userService.findOneUserByField('_id', '1233213');
                  expect(res).toBeNull();
            });
      });

      describe('getOneUserByField', () => {
            it('Pass', async () => {
                  const res = await userService.getOneUserByField('_id', userDb._id);
                  expect(res).toBeDefined();
            });
            it('Failed user does not exist', async () => {
                  const res = await userService.getOneUserByField('_id', '1233213');
                  expect(res).toBeNull();
            });
      });

      describe('saveUser', () => {
            beforeEach(() => {
                  userDb.username = fakeData(10);
            });

            it('Pass', async () => {
                  const res = await userService.saveUser(userDb);

                  expect(res).toBeDefined();
            });
            it('Pass (the same id)', async () => {
                  await userService.saveUser(userDb);
                  userDb.username = 'update';
                  await userService.saveUser(userDb);
                  const res = await userRepository.findOne({ username: 'update' });

                  expect(res).toBeDefined();
                  expect(res.username).toBe('update');
            });
      });

      afterAll(async () => {
            await userRepository.clear();
            await app.close();
      });
});
