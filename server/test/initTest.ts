import { Test, TestingModule } from '@nestjs/testing';

//* Internal import
import { router } from '../src/router';
import { AppModule } from '../src/app.module';
import { fakeUser } from './fakeEntity';
import { UserRepository } from '../src/models/users/entities/user.repository';
import { AuthService } from '../src/auth/auth.service';
import { UserRole } from '../src/models/users/entities/user.userRole.enum';

export const initTestModule = async () => {
      const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
      }).compile();

      const configModule = module.createNestApplication();
      //apply middleware
      router(configModule);

      const getApp = await configModule.init();

      //create a fake user and token
      let user = fakeUser();
      user.email = 'haicao2805@gmail.com';
      user.phoneNumber = '1313425502';
      let adminUser = fakeUser();
      adminUser.role = UserRole.ADMIN;
      const userRepository = module.get<UserRepository>(UserRepository);
      const authService = module.get<AuthService>(AuthService);

      user = await userRepository.save(user);
      adminUser = await userRepository.save(adminUser);
      const reToken = await authService.createReToken(user);
      const adminReToken = await authService.createReToken(adminUser);

      return { getApp, module, cookie: [`re-token=${reToken} ;`], adminCookie: [`re-token=${adminReToken};`], getUser: user, getReToken: reToken };
};
