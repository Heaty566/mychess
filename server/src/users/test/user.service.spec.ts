import { INestApplication } from '@nestjs/common';

import { UserRepository } from '../entities/user.repository';
import { initTestModule } from '../../test/initTest';
import { User } from '../entities/user.entity';
import { fakeData } from '../../test/test.helper';
import { UserService } from '../user.service';
import { v4 as uuidv4 } from 'uuid';
import { fakeUser } from '../../test/fakeEntity';

describe('UserService', () => {
      let app: INestApplication;
      let userRepository: UserRepository;
      let userService: UserService;
      let userDb: User;
      let resetDB: any;

      beforeAll(async () => {
            const { users, getApp, module, resetDatabase } = await initTestModule();
            app = getApp;
            userDb = (await users[0]).user;
            userRepository = module.get<UserRepository>(UserRepository);
            userService = module.get<UserService>(UserService);
            resetDB = resetDatabase;
      });

      describe('findOneUserByField', () => {
            it('Pass', async () => {
                  const res = await userService.findOneUserByField('id', userDb.id);

                  expect(res).toBeDefined();
            });
            it('Failed user does not exist', async () => {
                  const res = await userService.findOneUserByField('id', uuidv4());
                  expect(res).toBeUndefined();
            });
      });

      describe('getOneUserByField', () => {
            it('Pass', async () => {
                  const res = await userService.getOneUserByField('id', userDb.id);

                  expect(res).toBeDefined();
            });
            it('Failed user does not exist', async () => {
                  const id = uuidv4();
                  const res = await userService.getOneUserByField('id', id);

                  expect(res).toBeUndefined();
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

      describe('searchUsersByName', () => {
            beforeAll(async () => {
                  let exampleUser = fakeUser();
                  exampleUser.name = '132hello1321';
                  await userRepository.save(exampleUser);
                  exampleUser = fakeUser();

                  exampleUser.name = '123hello21cmaclksa';
                  await userRepository.save(exampleUser);
            });

            it('Pass get two', async () => {
                  const res = await userService.searchUsersByName('hello', 12, 0);
                  expect(res).toHaveLength(2);
            });

            it('Pass get zero currentPage 1000', async () => {
                  const res = await userService.searchUsersByName('hello', 12, 1000);
                  expect(res).toHaveLength(0);
            });

            it('Pass get two default currentPage and pageSize', async () => {
                  const res = await userService.searchUsersByName('hello');
                  expect(res).toHaveLength(2);
            });

            it('Pass get one pageSize=1', async () => {
                  const res = await userService.searchUsersByName('hello', 1, 0);
                  expect(res).toHaveLength(1);
            });

            it('Pass get all', async () => {
                  const exampleUser = fakeUser();
                  exampleUser.name = '123hello21cmaclksa';
                  await userRepository.save(exampleUser);
                  const res = await userService.searchUsersByName('', 200, 0);

                  expect(res.length).toBeGreaterThan(2);
            });
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
