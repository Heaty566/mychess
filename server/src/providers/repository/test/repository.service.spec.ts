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

            it('Pass to be defined', async () => {
                  const res = await userRepository.findOneByField('name', user.name);
                  expect(res).toBeDefined();
            });

            it('Pass (_id to be defined)', async () => {
                  const userData = await userRepository.findOneByField('name', user.name);
                  const res = await userRepository.findOneByField('_id', userData._id);
                  expect(res).toBeDefined();
            });

            it('Failed is not valid id', async () => {
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

            it('Pass to be defined', async () => {
                  const res = await userRepository.findManyByField('name', user.name);
                  expect(res[0]).toBeDefined();
            });

            it('Pass (_id to be defined)', async () => {
                  const userData = await userRepository.findOneByField('name', user.name);
                  const res = await userRepository.findManyByField('_id', userData._id);
                  expect(res[0]).toBeDefined();
            });

            it('Failed is not valid id', async () => {
                  const res = await userRepository.findManyByField('_id', fakeData(10, 'lettersAndNumbers'));
                  expect(res).toBeNull();
            });
      });

      afterAll(async () => {
            await userRepository.clear();
            await app.close();
      });
});
