import { INestApplication } from '@nestjs/common';
import { Profile as FaceBookProfile } from 'passport-facebook';
import { Profile as GitHubProfile } from 'passport-github';
import { Profile as GoogleProfile } from 'passport-google-oauth20';

//---- Helper
import { fakeData } from '../../test/test.helper';
import { initTestModule } from '../../test/initTest';

//---- Passport Strategy
import { GithubStrategy } from '../passport/github.strategy';
import { GoogleStrategy } from '../passport/google.strategy';
import { FacebookStrategy } from '../passport/facebook.strategy';

//---- Repository
import { UserRepository } from '../../user/entities/user.repository';

//---- Service
import { UserService } from '../../user/user.service';

describe('FacebookStrategy', () => {
      let app: INestApplication;
      let userRepository: UserRepository;

      let userService: UserService;

      let faceBookStrategy: FacebookStrategy;
      let githubStrategy: GithubStrategy;
      let googleStrategy: GoogleStrategy;
      let resetDb: any;
      beforeAll(async () => {
            const { getApp, module, resetDatabase } = await initTestModule();
            app = getApp;
            resetDb = resetDatabase;

            userRepository = module.get<UserRepository>(UserRepository);
            userService = module.get<UserService>(UserService);

            faceBookStrategy = new FacebookStrategy(userService);
            githubStrategy = new GithubStrategy(userService);
            googleStrategy = new GoogleStrategy(userService);
      });

      describe('FacebookStrategy', () => {
            let profile: FaceBookProfile;

            beforeEach(() => {
                  profile = {
                        displayName: 'hellouser',
                        id: fakeData(10),
                        photos: [
                              {
                                    value: '/url/img.png',
                              },
                        ],
                        _json: '',
                        _raw: '',
                        birthday: '',
                        provider: '',
                  };
            });

            it('Pass', async () => {
                  await faceBookStrategy.validate('', '', profile, (_, data) => expect(data).toBeDefined());

                  const user = await userRepository.findOneByField('facebookId', profile.id);
                  expect(user.facebookId).toBeDefined();
                  expect(user.facebookId).toBe(profile.id);
            });

            it('Pass (user validate 2 times but only exist one in database)', async () => {
                  await faceBookStrategy.validate('', '', profile, (_, data) => expect(data).toBeDefined());
                  await faceBookStrategy.validate('', '', profile, (_, data) => expect(data).toBeDefined());

                  const user = await userRepository.findManyByField('facebookId', profile.id);
                  expect(user.length).toBe(1);
                  expect(user[0].facebookId).toBe(profile.id);
            });

            it('Failed (missing some properties in profile)', async () => {
                  delete profile._json;
                  delete profile.displayName;
                  delete profile.photos;

                  await faceBookStrategy.validate('', '', profile, (error, data) => {
                        expect(data).toBeNull();
                        expect(error).toBeDefined();
                  });

                  const user = await userRepository.findOneByField('facebookId', profile.id);
                  expect(user).toBeUndefined();
            });
      });

      describe('GoogleStrategy', () => {
            let profile: GoogleProfile;

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
                  await googleStrategy.validate('', '', profile, (_, data) => expect(data).toBeDefined());

                  const user = await userRepository.findOneByField('googleId', profile.id);
                  expect(user.googleId).toBeDefined();
                  expect(user.googleId).toBe(profile.id);
            });

            it('Pass (user validate 2 times but only exist one in database)', async () => {
                  await googleStrategy.validate('', '', profile, (_, data) => expect(data).toBeDefined());
                  await googleStrategy.validate('', '', profile, (_, data) => expect(data).toBeDefined());

                  const user = await userRepository.findManyByField('googleId', profile.id);
                  expect(user.length).toBe(1);
                  expect(user[0].googleId).toBe(profile.id);
            });

            it('Failed (missing some properties in profile)', async () => {
                  delete profile._json;
                  delete profile.displayName;
                  delete profile.photos;

                  await googleStrategy.validate('', '', profile, (error, data) => {
                        expect(data).toBeNull();
                        expect(error).toBeDefined();
                  });

                  const user = await userRepository.findOneByField('googleId', profile.id);
                  expect(user).toBeUndefined();
            });
      });

      describe('GithubStrategy', () => {
            let profile: GitHubProfile;

            beforeEach(() => {
                  profile = {
                        displayName: 'helloUser',
                        id: fakeData(10),
                        photos: [
                              {
                                    value: '/some/avatar.png',
                              },
                        ],
                        _raw: '',
                        profileUrl: '',
                        _json: {},
                        provider: 'github',
                  };
            });

            it('Pass', async () => {
                  await githubStrategy.validate('', '', profile, (_, data) => expect(data).toBeDefined());

                  const user = await userRepository.findOneByField('githubId', profile.id);
                  expect(user.githubId).toBeDefined();
                  expect(user.githubId).toBe(profile.id);
            });

            it('Pass (user validate 2 times but only exist one in database)', async () => {
                  await githubStrategy.validate('', '', profile, (_, data) => expect(data).toBeDefined());
                  await githubStrategy.validate('', '', profile, (_, data) => expect(data).toBeDefined());

                  const user = await userRepository.findManyByField('githubId', profile.id);
                  expect(user.length).toBe(1);
                  expect(user[0].githubId).toBe(profile.id);
            });

            it('Failed (missing some properties in profile)', async () => {
                  delete profile._json;
                  delete profile.displayName;
                  delete profile.photos;

                  await githubStrategy.validate('', '', profile, (error, data) => {
                        expect(data).toBeNull();
                        expect(error).toBeDefined();
                  });

                  const user = await userRepository.findOneByField('githubId', profile.id);
                  expect(user).toBeUndefined();
            });
      });

      afterAll(async () => {
            await resetDb();
            await app.close();
      });
});
