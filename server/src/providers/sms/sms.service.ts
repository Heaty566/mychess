import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';

//----- Service
import { LoggerService } from '../../utils/logger/logger.service';

@Injectable()
export class SmsService {
      constructor(private readonly twilioService: Twilio, private readonly LoggerService: LoggerService) {}

      private sendSms(phoneNumber: string, content: string): Promise<boolean> {
            if (process.env.DOC === 'active') return Promise.resolve(true);

            return this.twilioService.messages
                  .create({
                        to: phoneNumber,
                        from: process.env.TWILIO_API_NUMBER,
                        body: content,
                  })
                  .then(() => true)
                  .catch((error) => {
                        this.LoggerService.print(error, 'sms.service.ts', 'error');
                        return false;
                  });
      }

      public async sendOTP(phoneNumber: string, otpKey: string) {
            const content = `Your verification code is : ${otpKey}, this code will be invalid in 5 minutes. Please do not share this code with others`;

            return await this.sendSms(phoneNumber, content);
      }
}
