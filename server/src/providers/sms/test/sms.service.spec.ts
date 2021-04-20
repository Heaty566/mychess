let mockPromise = Promise.resolve();
class TwilioMock {
      constructor() {
            //
      }

      public messages = {
            create() {
                  return mockPromise;
            },
      };
}

import { INestApplication } from '@nestjs/common';

//---- Helper
import { fakeData } from '../../../app/Helpers/test/test.helper';
import { initTestModule } from '../../../app/Helpers/test/initTest';

//---- Service
import { SmsService } from '../sms.service';

jest.mock('twilio', () => {
      return {
            Twilio: TwilioMock,
      };
});

describe('TokenService', () => {
      let app: INestApplication;
      let smsService: SmsService;
      beforeAll(async () => {
            const { getApp, module } = await initTestModule();
            app = getApp;
            smsService = module.get<SmsService>(SmsService);
      });

      describe('sendSms', () => {
            it('Pass', async () => {
                  const res = await smsService['sendSms']('+00000000', fakeData(10));
                  expect(res).toBeTruthy();
            });
            it('Pass', async () => {
                  mockPromise = Promise.reject();
                  const res = await smsService['sendSms'](fakeData(11), fakeData(10));
                  expect(res).toBeFalsy();
            });
            it('Debug mode', async () => {
                  process.env.DOC = 'active';
                  const res = await smsService['sendSms'](fakeData(11), fakeData(10));
                  expect(res).toBeTruthy();
            });
      });

      describe('sendOTP', () => {
            it('Pass', async () => {
                  const res = await smsService.sendOTP(fakeData(10), fakeData(6));
                  expect(res).toBeDefined();
            });
      });

      afterAll(async () => {
            await app.close();
      });
});
