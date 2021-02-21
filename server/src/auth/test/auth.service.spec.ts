import { INestApplication } from '@nestjs/common';

//* Internal import
import { UserRepository } from '../../user/entities/user.repository';
import { initTestModule } from '../../../test/initTest';
import { AuthService } from '../auth.service';
import { RegisterUserDTO } from '../dto/register.dto';
import { fakeData } from 'test/fakeData';
import { User } from '../../user/entities/user.entity';
import { fakeUser } from '../../../test/fakeEntity';

describe('AuthService', () => {
      let app: INestApplication;
      let userRepository: UserRepository;
      let authService: AuthService;
      beforeAll(async () => {
            const { getApp, module } = await initTestModule();
            app = getApp;

            userRepository = module.get<UserRepository>(UserRepository);
            authService = module.get<AuthService>(AuthService);
      });
      describe('registerUser', () => {
            let input: User;

            beforeEach(() => {
                  input = fakeUser();
            });

            it('Pass', async () => {
                  const res = await authService.registerUser(input);

                  expect(res).toBeDefined();
            });
            it('Pass', async () => {
                  await authService.registerUser(input);
                  input.username = 'update';
                  await authService.registerUser(input);
                  const res = await userRepository.findOne({ username: 'update' });

                  expect(res).toBeDefined();
                  expect(res.username).toBe('update');
            });
      });

      afterAll(async () => {
            await userRepository.clear();
            await app.close();
      });
});
