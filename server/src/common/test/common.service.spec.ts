import { INestApplication } from '@nestjs/common';

import { UserRepository } from '../../users/entities/user.repository';
import { initTestModule } from '../../../test/initTest';
import { CommonService } from '../common.service';
describe('UserService', () => {
      let app: INestApplication;
      let userRepository: UserRepository;
      let commonService: CommonService;

      beforeAll(async () => {
            const { getApp, module } = await initTestModule();
            app = getApp;
            userRepository = module.get<UserRepository>(UserRepository);
            commonService = module.get<CommonService>(CommonService);
      });

      describe('getAllUsers', () => {
            it('Pass', async () => {
                  const res = await commonService.getAllUsers();
                  expect(res).toBeDefined();
            });
      });

      afterAll(async () => {
            await userRepository.createQueryBuilder().delete().execute();
            await app.close();
      });
});
