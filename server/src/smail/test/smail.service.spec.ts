import { INestApplication } from '@nestjs/common';

//* Internal import
import { initTestModule } from '../../../test/initTest';
import { SmailService } from '../smail.service';

describe('SmailService', () => {
      let app: INestApplication;
      let smailService: SmailService;

      beforeAll(async () => {
            const { getApp, module } = await initTestModule();
            app = getApp;

            smailService = module.get<SmailService>(SmailService);
      });
      describe('sendMail', () => {
            it('Pass', async () => {
                  const res = await smailService['sendMail']('heaty566@gmail.com', '123');
                  expect(res).toBeTruthy();
            });

            it('Failed wrong email', async () => {
                  const res = await smailService['sendMail']('heaty566', '123');
                  expect(res).toBeFalsy();
            });
      });

      afterAll(async () => {
            await app.close();
      });
});
