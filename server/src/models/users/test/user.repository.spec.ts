import { INestApplication } from '@nestjs/common';

import { UserRepository } from '../entities/user.repository';
import { initTestModule } from '../../../../test/initTest';
import { User } from '../entities/user.entity';
import { fakeData } from '../../../../test/fakeData';

describe('UserRepository', () => {
      let app: INestApplication;
      let userRepository: UserRepository;
      let userDb: User;

      beforeAll(async () => {
            const { getUser, getApp, module } = await initTestModule();
            app = getApp;
            userDb = getUser;
            userRepository = module.get<UserRepository>(UserRepository);
      });

      describe('getUserByField', () => {
            it('Pass (field is not _id)', async () => {
                  const res = await userRepository.findOneByField('name', userDb.name);
                  expect(res).toBeDefined();
                  expect(res.username).toBe(userDb.username);
            });

            it('Pass (field is _id)', async () => {
                  const userData = await userRepository.findOneByField('name', userDb.name);
                  const res = await userRepository.findOneByField('_id', userData._id.toHexString());
                  expect(res).toBeDefined();
                  expect(res.username).toBe(userDb.username);
            });

            it('Failed (is not valid _id)', async () => {
                  const res = await userRepository.findOneByField('_id', fakeData(10, 'lettersAndNumbers'));
                  expect(res).toBeNull();
            });
      });

      afterAll(async () => {
            await userRepository.clear();
            await app.close();
      });
});
