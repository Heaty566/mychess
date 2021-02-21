import { Test, TestingModule } from '@nestjs/testing';
//* Internal import
import { router } from '../src/app/router';
import { AppModule } from '../src/app.module';
import { fakeUser } from './fakeEntity';

export const initTestModule = async () => {
      const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
      }).compile();

      const configModule = module.createNestApplication();

      router(configModule);

      const getApp = await configModule.init();

      const user = fakeUser();

      //apply middleware

      return { getApp, module, reToken: [`re-token= Max-Age=15552000; Path=/;`], user };
};
