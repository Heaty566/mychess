import { INestApplication } from '@nestjs/common';
import { AuthService } from '../../auth.service';
import { ReTokenRepository } from '../../entities/re-token.repository';
import { UserRepository } from '../../../user/entities/user.repository';
import { initTestModule } from '../../../../test/initTest';
import { FacebookStrategy } from '../facebook.strategy';
import { UserService } from '../../../user/user.service';
import { Profile } from 'passport-facebook';
import { fakeData } from '../../../../test/fakeData';
//* Internal import

describe('FacebookStrategy', () => {
      let app: INestApplication;
      let userRepository: UserRepository;
      let authTokenRepository: ReTokenRepository;
      let authService: AuthService;
      let faceBook: FacebookStrategy;
      let userService: UserService;
      beforeAll(async () => {
            const { getApp, module } = await initTestModule();
            app = getApp;

            userRepository = module.get<UserRepository>(UserRepository);
            authTokenRepository = module.get<ReTokenRepository>(ReTokenRepository);
            authService = module.get<AuthService>(AuthService);
            userService = module.get<UserService>(UserService);
            faceBook = new FacebookStrategy(authService, userService);
      });

      describe('FacebookStrategy', () => {
            let profile: Profile;

            beforeEach(() => {
                  profile = {
                        displayName: 'test',
                        id: fakeData(10),
                        photos: [
                              {
                                    value: 'dsa',
                              },
                        ],
                        _json: '',
                        _raw: '',
                        birthday: '',
                        provider: '',
                  };
            });

            it('Pass', async () => {
                  await faceBook.validate('', '', profile, (_, data) => expect(data).toBeDefined());

                  const user = await userRepository.findOneByField('facebookId', profile.id);
                  expect(user.facebookId).toBeDefined();
                  expect(user.facebookId).toBe(profile.id);
            });

            it('Pass double user', async () => {
                  await faceBook.validate('', '', profile, (_, data) => expect(data).toBeDefined());
                  await faceBook.validate('', '', profile, (_, data) => expect(data).toBeDefined());

                  const user = await userRepository.findManyByField('facebookId', profile.id);
                  expect(user.length).toBe(1);
                  expect(user[0].facebookId).toBe(profile.id);
            });

            it('Failed ', async () => {
                  delete profile._json;
                  delete profile.displayName;
                  delete profile.photos;

                  await faceBook.validate('', '', profile, (error, data) => {
                        expect(data).toBeNull();
                        expect(error).toBeDefined();
                  });

                  const user = await userRepository.findOneByField('facebookId', profile.id);
                  expect(user).toBeUndefined();
            });
      });

      afterAll(async () => {
            await authTokenRepository.clear();
            await userRepository.clear();
            await app.close();
      });
});
