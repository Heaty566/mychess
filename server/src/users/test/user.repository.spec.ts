import { INestApplication } from '@nestjs/common';

import { UserRepository } from '../entities/user.repository';
import { initTestModule } from '../../test/initTest';
import { User } from '../entities/user.entity';
import { fakeData } from '../../test/test.helper';

describe('UserRepository', () => {
      let app: INestApplication;
      let userRepository: UserRepository;
      let userDb: User;
      let resetDB: any;
      beforeAll(async () => {
            const { users, getApp, module, resetDatabase } = await initTestModule();
            app = getApp;
            userDb = (await users[0]).user;
            userRepository = module.get<UserRepository>(UserRepository);
            resetDB = resetDatabase;
      });

      describe('getUserByField', () => {
            it('Pass (field is not _id)', async () => {
                  const res = await userRepository.findOneByField('name', userDb.name);
                  expect(res).toBeDefined();
                  expect(res.username).toBe(userDb.username);
            });

            it('Pass (field is _id)', async () => {
                  const userData = await userRepository.findOneByField('name', userDb.name);
                  const res = await userRepository.findOneByField('id', userData.id);
                  expect(res).toBeDefined();
                  expect(res.username).toBe(userDb.username);
            });

            it('Failed (is not valid _id)', async () => {
                  const res = await userRepository.findOneByField('id', fakeData(10, 'lettersAndNumbers'));
                  expect(res).toBeUndefined();
            });
      });

      describe('getAllUsers', () => {
            it('Pass', async () => {
                  const res = await userRepository.getAllUsers();
                  expect(res).toBeDefined();
            });
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
