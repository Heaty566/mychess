import { INestApplication } from '@nestjs/common';

//* Internal import
import { UserRepository } from '../../user/entities/user.repository';
import { initTestModule } from '../../../test/initTest';
import { AuthService } from '../auth.service';
import { User } from '../../user/entities/user.entity';
import { fakeUser, fakeAuthToken } from '../../../test/fakeEntity';
import { AuthToken } from '../entities/authToken.entity';
import { AuthTokenRepository } from '../entities/authToken.repository';
import { fakeData } from '../../../test/fakeData';

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

      describe('hash', () => {
            let data: string;

            beforeEach(() => {
                  data = fakeData(10);
            });

            it('Pass', async () => {
                  const hash = await authService.hash(data);
                  expect(hash.length).toBeGreaterThan(10);
            });
      });

      describe('comparePassword', () => {
            let data: string, hash: string;

            beforeEach(async () => {
                  data = fakeData(10);
                  hash = await authService.hash(data);
            });

            it('Pass', async () => {
                  const isCorrect = await authService.comparePassword(data, hash);
                  expect(isCorrect).toBe(true);
            });
      });

      describe('createToken', () => {
            let user: Record<any, any>;
            let token: string;

            beforeEach(() => {
                  user = fakeUser;
            });

            it('Pass', () => {
                  token = authService.createToken({ user });
                  expect(token.length).toBeGreaterThan(20);
            });
      });

      describe('decodeToken', () => {
            let user: Record<any, any>;
            let token: string;

            beforeEach(() => {
                  user = fakeUser();
                  token = authService.createToken({ user });
            });

            it('Pass', () => {
                  const decodeToken = authService.decodeToken(token);
                  expect(decodeToken['user'].username).toEqual(user.username);
            });
      });

      describe('getDataFromRefreshToken', () => {
            let authToken = new AuthToken();
            const user = fakeUser();
            let refreshToken: string;

            beforeEach(async () => {
                  authToken.data = authService.createToken({ user });
                  authToken = await authService.saveAuthToken(authToken);
                  refreshToken = authService.createToken({
                        authTokenId: authToken._id,
                  });
            });

            it('Pass', async () => {
                  const data = await authService.getDataFromRefreshToken(refreshToken);
                  expect(data.data).toEqual(authToken.data);
            });
      });

      describe('getDataFromAuthToken', () => {
            let authToken = new AuthToken();
            const user = fakeUser();

            beforeEach(async () => {
                  authToken.data = authService.createToken({ user });
                  authToken = await authService.saveAuthToken(authToken);
            });

            it('Pass', async () => {
                  const data = await authService.getDataFromAuthToken(String(authToken._id));
                  expect(data.data).toEqual(authToken.data);
            });
      });

      afterAll(async () => {
            await authTokenRepository.clear();
            await userRepository.clear();
            await app.close();
      });
});
