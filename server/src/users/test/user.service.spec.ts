import { INestApplication } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

//---- Repository
import { UserRepository } from '../entities/user.repository';

//---- Helper
import { initTestModule } from '../../app/Helpers/test/initTest';
import { fakeData } from '../../app/Helpers/test/test.helper';
import { fakeUser } from '../../app/Helpers/test/fakeEntity';

//---- Entity
import { User } from '../entities/user.entity';

//---- Service
import { UserService } from '../user.service';

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

      describe('findOneUserWithoutSomeSensitiveFields', () => {
            it('Pass', async () => {
                  const res = await userService.findOneUserWithoutSomeSensitiveFields('id', userDb.id);
                  expect(res).toBeDefined();
            });
            it('Failed user does not exist', async () => {
                  const id = uuidv4();
                  const res = await userService.findOneUserWithoutSomeSensitiveFields('id', id);

                  expect(res).toBeUndefined();
            });
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

      describe('randomAvatar', () => {
            //
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
