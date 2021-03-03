import { Test, TestingModule } from '@nestjs/testing';

//* Internal import
import { router } from '../src/router';
import { AppModule } from '../src/app.module';
import { fakeUser } from './fakeEntity';
import { UserRepository } from '../src/user/entities/user.repository';
import { AuthService } from '../src/auth/auth.service';

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
      const userRepository = module.get<UserRepository>(UserRepository);
      const authService = module.get<AuthService>(AuthService);

      user = await userRepository.save(user);
      const reToken = await authService.createReToken(user);

      return { getApp, module, cookie: [`re-token=${reToken} ;`], getUser: user, getReToken: reToken };
};
