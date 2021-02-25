import { INestApplication } from '@nestjs/common';

//* Internal import
import { UserRepository } from '../../../user/entities/user.repository';
import { initTestModule } from '../../../../test/initTest';
import { User } from '../../../user/entities/user.entity';
import { fakeUser } from '../../../../test/fakeEntity';
import { fakeData } from '../../../../test/fakeData';

describe('RepositoryService', () => {
      let app: INestApplication;
      let userRepository: UserRepository;

      beforeAll(async () => {
            const { getApp, module } = await initTestModule();
            app = getApp;

            userRepository = module.get<UserRepository>(UserRepository);
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
                  const res = await userRepository.findOneByField('_id', userData._id);
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
                  const res = await userRepository.findManyByField('_id', userData._id);
                  expect(res[0]).toBeDefined();
            });

            it('Failed (is not valid _id)', async () => {
                  const res = await userRepository.findManyByField('_id', fakeData(10, 'lettersAndNumbers'));
                  expect(res).toBeNull();
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

            it('Pass (field is _id)', async () => {
                  const userData1 = await userRepository.findOneByField('name', user1.name);
                  const userData2 = await userRepository.findOneByField('name', user2.name);

                  value = [userData1._id, userData2._id];

                  const res = await userRepository.findManyByArrayValue('_id', value, null);
                  expect(res[value.length - 1]).toBeDefined();
            });

            it('Failed (value is [])', async () => {
                  const res = await userRepository.findManyByArrayValue('name', value, null);
                  expect(res[0]).toBeUndefined();
            });
      });

      afterAll(async () => {
            await userRepository.clear();
            await app.close();
      });
});
