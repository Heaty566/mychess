import { INestApplication } from '@nestjs/common';

//* Internal import
import { initTestModule } from '../../../../test/initTest';
import { fakeUser } from '../../../../test/fakeEntity';
import { fakeData } from '../../../../test/fakeData';

import { UserRepository } from '../../../models/users/entities/user.repository';
import { RepositoryService } from '../repository.service';
import { User } from '../../../models/users/entities/user.entity';

describe('RepositoryService', () => {
      let app: INestApplication;
      let userRepository: RepositoryService<User>;

      beforeAll(async () => {
            const { getApp, module } = await initTestModule();
            app = getApp;

            userRepository = module.get<RepositoryService<User>>(UserRepository);
      });

      describe('findOneByField', () => {
            let user: User;

            beforeEach(async () => {
                  user = fakeUser();
                  await userRepository.save(user);
            });

            it('Pass (field is not _id)', async () => {
                  const res = await userRepository.findOneByField('name', user.name);
                  expect(res).toBeDefined();
            });

            it('Pass (field is _id)', async () => {
                  const userData = await userRepository.findOneByField('name', user.name);
                  const res = await userRepository.findOneByField('_id', userData._id.toHexString());
                  expect(res).toBeDefined();
            });

            it('Failed (is not valid _id)', async () => {
                  const res = await userRepository.findOneByField('_id', fakeData(10, 'lettersAndNumbers'));
                  expect(res).toBeNull();
            });
      });

      describe('findManyByField', () => {
            let user: User;

            beforeEach(async () => {
                  user = fakeUser();
                  await userRepository.save(user);
            });

            it('Pass (field is not _id)', async () => {
                  const res = await userRepository.findManyByField('name', user.name);
                  expect(res[0]).toBeDefined();
            });

            it('Pass (field is _id)', async () => {
                  const userData = await userRepository.findOneByField('name', user.name);
                  const res = await userRepository.findManyByField('_id', userData._id.toHexString());
                  expect(res[0]).toBeDefined();
            });

            it('Failed (is not valid _id)', async () => {
                  const res = await userRepository.findManyByField('_id', fakeData(10, 'lettersAndNumbers'));
                  expect(res).toBeNull();
            });
      });

      describe('findManyByField', () => {
            let user: User;

            beforeEach(async () => {
                  user = fakeUser();
                  await userRepository.save(user);
            });

            it('Pass (field is not _id)', async () => {
                  const res = await userRepository.findManyByField('name', user.name);
                  expect(res[0]).toBeDefined();
            });

            it('Pass (field is _id)', async () => {
                  const userData = await userRepository.findOneByField('name', user.name);
                  const res = await userRepository.findManyByField('_id', userData._id.toHexString());
                  expect(res[0]).toBeDefined();
            });

            it('Failed (is not valid _id)', async () => {
                  const res = await userRepository.findManyByField('_id', fakeData(10, 'lettersAndNumbers'));
                  expect(res).toBeNull();
            });
      });

      describe('onlyUnique', () => {
            it('Pass ', () => {
                  const output = userRepository['onlyUnique'](1, 0, [1, 2, 3, 1]);
                  expect(output).toBeTruthy();
            });
            it('Failed Wrong index ', () => {
                  const output = userRepository['onlyUnique'](1, 1, [1, 2, 3, 1]);
                  expect(output).toBeFalsy();
            });
      });

      describe('transformToArrayObjectId', () => {
            let input: Array<any>;
            beforeEach(() => {
                  input = [fakeData(12, 'lettersAndNumbers'), fakeData(12, 'lettersAndNumbers'), '123'];
            });

            it('Pass ', () => {
                  const output = userRepository['transformToArrayObjectId'](input);

                  expect(typeof output[0]).toBe('object');
                  expect(output[2]).toBeNull();
            });
      });

      describe('findManyByArrayValue', () => {
            let user1: User;
            let user2: User;
            let value = [];

            beforeEach(async () => {
                  user1 = fakeUser();
                  user2 = fakeUser();
                  await userRepository.save(user1);
                  await userRepository.save(user2);
            });

            it('Pass (field is not _id)', async () => {
                  value = [user1.name, user2.name];

                  const res = await userRepository.findManyByArrayValue('name', value, null);
                  expect(res[value.length - 1]).toBeDefined();
            });

            it('Pass (isUnique = true)', async () => {
                  value = [user1.name, user2.name, user2.name, user1.name];
                  const res = await userRepository.findManyByArrayValue('name', value, null, true);
                  expect(res[value.filter(userRepository['onlyUnique']).length - 1]).toBeDefined();
            });

            it('Pass (field is _id)', async () => {
                  const userData1 = await userRepository.findOneByField('name', user1.name);
                  const userData2 = await userRepository.findOneByField('name', user2.name);

                  value = [userData1._id.toHexString(), fakeData(9, 'lettersAndNumbers'), userData2._id.toHexString()];

                  const res = await userRepository.findManyByArrayValue('_id', value, null);
                  expect(res[value.length - 2]).toBeDefined();
            });

            it('Failed (value is [])', async () => {
                  value = [];
                  const res = await userRepository.findManyByArrayValue('name', value, null);
                  expect(res[0]).toBeUndefined();
            });
      });

      afterAll(async () => {
            await userRepository.clear();
            await app.close();
      });
});
