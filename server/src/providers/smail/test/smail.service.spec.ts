import { INestApplication } from '@nestjs/common';

//---- Helper
import { initTestModule } from '../../../test/initTest';

//---- Service
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
                  const res = await smailService.sendOTP('heaty566@gmail.com', 'code test');
                  expect(res).toBeTruthy();
            });

            it('Failed to send', async () => {
                  const res = await smailService.sendOTP('heaty566', 'code test');
                  expect(res).toBeFalsy();
            });
      });

      describe('sendOTPForUpdateEmail', () => {
            it('Pass', async () => {
                  const res = await smailService.sendOTPForUpdateEmail('heaty566@gmail.com', 'code test');
                  expect(res).toBeTruthy();
            });

            it('Failed to send', async () => {
                  const res = await smailService.sendOTPForUpdateEmail('heaty566', 'code test');
                  expect(res).toBeFalsy();
            });
      });

      afterAll(async () => {
            await app.close();
      });
});
