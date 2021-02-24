import { INestApplication } from '@nestjs/common';

//* Internal import
import { UserRepository } from '../../user/entities/user.repository';
import { initTestModule } from '../../../test/initTest';
import { AuthService } from '../auth.service';
import { User } from '../../user/entities/user.entity';
import { fakeUser, fakeAuthToken } from '../../../test/fakeEntity';
import { AuthToken } from '../entities/authToken.entity';
import { AuthTokenRepository } from '../entities/authToken.repository';

describe('AuthService', () => {
      let app: INestApplication;
      let userRepository: UserRepository;
      let authTokenRepository: AuthTokenRepository;
      let authService: AuthService;
      beforeAll(async () => {
            const { getApp, module } = await initTestModule();
            app = getApp;

            userRepository = module.get<UserRepository>(UserRepository);
            authService = module.get<AuthService>(AuthService);
            authTokenRepository = module.get<AuthTokenRepository>(AuthTokenRepository);
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

      describe('saveAuthToken', () => {
            let input: AuthToken;

            beforeEach(() => {
                  input = fakeAuthToken();
            });

            it('Pass', async () => {
                  const res = await authService.saveAuthToken(input);

                  expect(res).toBeDefined();
            });
            it('Pass', async () => {
                  await authService.saveAuthToken(input);
                  const res = await authTokenRepository.findOne({ data: input.data });

                  expect(res).toBeDefined();
                  expect(res.data).toBe(input.data);
            });
      });

      afterAll(async () => {
            await authTokenRepository.clear();
            await userRepository.clear();
            await app.close();
      });
});
