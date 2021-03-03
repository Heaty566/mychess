//* Internal import
import { INestApplication } from '@nestjs/common';
import { UserRepository } from '../../user/entities/user.repository';
import { initTestModule } from '../../../test/initTest';
import { User } from '../../user/entities/user.entity';
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
      });

      describe('getOneUserByField', () => {
            it('Pass', async () => {
                  const res = await userService.getOneUserByField('_id', userDb._id);
                  expect(res).toBeDefined();
            });
      });

      afterAll(async () => {
            await userRepository.clear();
            await app.close();
      });
});
