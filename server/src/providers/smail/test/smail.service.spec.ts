import { INestApplication } from '@nestjs/common';

//* Internal import
import { initTestModule } from '../../../../test/initTest';
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

      describe('sendOTPMail', () => {
            it('Pass', async () => {
                  const res = await smailService.sendOTPMail('heaty566@gmail.com', 'code test');
                  expect(res).toBeTruthy();
            });

            it('Failed to send', async () => {
                  const res = await smailService.sendOTPMail('heaty566', 'code test');
                  expect(res).toBeFalsy();
            });
      });

      afterAll(async (done) => {
            await app.close();
            done();
      });
});
