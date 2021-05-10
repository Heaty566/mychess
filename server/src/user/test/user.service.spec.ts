import { INestApplication } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

//---- Repository
import { UserRepository } from '../entities/user.repository';

//---- Helper
import { initTestModule } from '../../test/initTest';
import { fakeData } from '../../test/test.helper';
import { fakeUser } from '../../test/fakeEntity';

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
      let generateFakeUser: () => Promise<User>;

      beforeAll(async () => {
            const { users, getApp, module, resetDatabase, getFakeUser } = await initTestModule();
            app = getApp;
            userDb = (await users[0]).user;
            userRepository = module.get<UserRepository>(UserRepository);
            userService = module.get<UserService>(UserService);
            resetDB = resetDatabase;
            generateFakeUser = getFakeUser;
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
            let name1: string;
            beforeAll(async () => {
                  const user1 = await generateFakeUser();
                  name1 = user1.name;
            });

            it('Pass get two', async () => {
                  const res = await userService.searchUsersByNameAndCount(name1, 12, 0);

                  expect(res.users).toHaveLength(1);
            });

            it('Pass get zero currentPage 1000', async () => {
                  const res = await userService.searchUsersByNameAndCount('hello', 12, 1000);
                  expect(res.users).toHaveLength(0);
            });

            it('Pass get one pageSize=1', async () => {
                  const res = await userService.searchUsersByNameAndCount(name1, 1, 0);
                  expect(res.users).toHaveLength(1);
            });

            it('Pass get all', async () => {
                  const exampleUser = fakeUser();
                  exampleUser.name = '123hello21cmaclksa';
                  await userRepository.save(exampleUser);
                  const res = await userService.searchUsersByNameAndCount('', 200, 0);

                  expect(res.users.length).toBeGreaterThan(1);
                  expect(res.count).toBeGreaterThan(2);
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
