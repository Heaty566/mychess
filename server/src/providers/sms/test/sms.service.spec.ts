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

import { fakeData } from '../../../../test/fakeData';
import { initTestModule } from '../../../../test/initTest';
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
      });

      describe('sendOtp', () => {
            it('Pass', async () => {
                  const res = await smsService.sendOTP(fakeData(10), fakeData(6));
                  expect(res).toBeDefined();
            });
      });

      afterAll(async () => {
            await app.close();
      });
});
