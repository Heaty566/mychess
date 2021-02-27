import { INestApplication } from '@nestjs/common';
import { AuthService } from '../../auth.service';
import { ReTokenRepository } from '../../entities/re-token.repository';
import { UserRepository } from '../../../user/entities/user.repository';
import { initTestModule } from '../../../../test/initTest';
import { GoogleStrategy } from '../google.strategy';
import { UserService } from '../../../user/user.service';
import { fakeData } from '../../../../test/fakeData';
import { Profile } from 'passport-google-oauth20';
//* Internal import

describe('GoogleStrategy', () => {
      let app: INestApplication;
      let userRepository: UserRepository;
      let authTokenRepository: ReTokenRepository;
      let authService: AuthService;
      let faceBook: GoogleStrategy;
      let userService: UserService;
      beforeAll(async () => {
            const { getApp, module } = await initTestModule();
            app = getApp;

            userRepository = module.get<UserRepository>(UserRepository);
            authTokenRepository = module.get<ReTokenRepository>(ReTokenRepository);
            authService = module.get<AuthService>(AuthService);
            userService = module.get<UserService>(UserService);
            faceBook = new GoogleStrategy(authService, userService);
      });

      describe('GoogleStrategy', () => {
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
                        _raw: '',
                        profileUrl: '',
                        _json: {},
                        provider: 'github',
                  };
            });

            it('Pass', async () => {
                  await faceBook.validate('', '', profile, (_, data) => expect(data).toBeDefined());

                  const user = await userRepository.findOneByField('googleId', profile.id);
                  expect(user.googleId).toBeDefined();
                  expect(user.googleId).toBe(profile.id);
            });

            it('Pass double user', async () => {
                  await faceBook.validate('', '', profile, (_, data) => expect(data).toBeDefined());
                  await faceBook.validate('', '', profile, (_, data) => expect(data).toBeDefined());

                  const user = await userRepository.findManyByField('googleId', profile.id);
                  expect(user.length).toBe(1);
                  expect(user[0].googleId).toBe(profile.id);
            });

            it('Failed ', async () => {
                  delete profile._json;
                  delete profile.displayName;
                  delete profile.photos;

                  await faceBook.validate('', '', profile, (error, data) => {
                        expect(data).toBeNull();
                        expect(error).toBeDefined();
                  });

                  const user = await userRepository.findOneByField('googleId', profile.id);
                  expect(user).toBeUndefined();
            });
      });

      afterAll(async () => {
            await authTokenRepository.clear();
            await userRepository.clear();
            await app.close();
      });
});
