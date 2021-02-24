import { INestApplication } from '@nestjs/common';
import { fakeData } from '../../../../test/fakeData';

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

//* Internal import
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

      afterAll(async () => {
            await app.close();
      });
});
