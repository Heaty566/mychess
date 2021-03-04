import { INestApplication } from '@nestjs/common';

//* Internal import
import { UserRepository } from '../entities/user.repository';
import { initTestModule } from '../../../test/initTest';
import { AuthService } from '../../auth/auth.service';
import { User } from '../entities/user.entity';
import { fakeUser } from '../../../test/fakeEntity';
import { ReTokenRepository } from '../../auth/entities/re-token.repository';
import { fakeData } from '../../../test/fakeData';
import { RedisService } from '../../utils/redis/redis.service';
import { ObjectId } from 'mongodb';
import { UserRole } from '../entities/user.userRole.enum';
import { AdminService } from '../admin.service';

describe('AdminService', () => {
      let app: INestApplication;
      let userRepository: UserRepository;
      let reTokenRepository: ReTokenRepository;
      let adminService: AdminService;
      let authService: AuthService;
      let userDb: User;
      let redisService: RedisService;
      let token: string;
      beforeAll(async () => {
            const { getUser, getApp, module } = await initTestModule();
            app = getApp;
            getUser.role = UserRole.ADMIN;
            userRepository = module.get<UserRepository>(UserRepository);
            userDb = await userRepository.save(getUser);
            adminService = module.get<AdminService>(AdminService);
            authService = module.get<AuthService>(AuthService);

            reTokenRepository = module.get<ReTokenRepository>(ReTokenRepository);
      });

      describe('changeUserRole', () => {
            let testUser: User;
            beforeAll(async () => {
                  testUser = fakeUser();
                  testUser = await userRepository.save(testUser);
            });

            it('Pass Change to Admin', async () => {
                  const user = await adminService.toggleUserRole(testUser);
                  const getUser = await userRepository.findOneByField('_id', user._id);

                  expect(getUser.username).toBe(testUser.username);
                  expect(user.role).toBe(UserRole.ADMIN);
                  expect(getUser.role).toBe(UserRole.ADMIN);
            });
            it('Pass Change to User', async () => {
                  const user = await adminService.toggleUserRole(testUser);
                  const getUser = await userRepository.findOneByField('_id', testUser._id);

                  expect(getUser.username).toBe(testUser.username);
                  expect(user.role).toBe(UserRole.USER);
                  expect(getUser.role).toBe(UserRole.USER);
            });
      });

      describe('toggleUserStatus', () => {
            let testUser: User;
            beforeAll(async () => {
                  testUser = fakeUser();
                  testUser = await userRepository.save(testUser);
            });
            it('Pass Change to true', async () => {
                  const user = await adminService.toggleUserStatus(testUser);
                  const getUser = await userRepository.findOneByField('_id', testUser._id);

                  expect(getUser.username).toBe(testUser.username);
                  expect(user.role).toBeTruthy();
                  expect(getUser.role).toBeTruthy();
            });

            it('Pass Change to false', async () => {
                  const user = await adminService.toggleUserStatus(testUser);
                  const getUser = await userRepository.findOneByField('_id', user._id);

                  expect(getUser.username).toBe(testUser.username);
                  expect(user.isDisabled).toBeFalsy();
                  expect(getUser.isDisabled).toBeFalsy();
            });
      });

      describe('getAllUsers', () => {
            it('Pass Change to Admin', async () => {
                  const users = await adminService.getAllUsers();
                  const getUsers = await userRepository.find();

                  expect(users).toBeDefined();
                  expect(users.length).toBe(getUsers.length);
            });
      });

      afterAll(async () => {
            await reTokenRepository.clear();
            await userRepository.clear();
            await app.close();
      });
});
