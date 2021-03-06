import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';

import { LoggerService } from '../../utils/logger/logger.service';

@Injectable()
export class SmsService {
      constructor(private readonly twilioService: Twilio, private readonly LoggerService: LoggerService) {}

      private sendSms(phoneNumber: string, content: string): Promise<boolean> {
            return this.twilioService.messages
                  .create({
                        to: phoneNumber,
                        from: process.env.TWILIO_API_NUMBER,
                        body: content,
                  })
                  .then(() => true)
                  .catch((error) => {
                        this.LoggerService.print(error, 'error');
                        return false;
                  });
      }

      public async sendOTP(phoneNumber: string, otpKey: string) {
            const content = `Your verification code is : ${otpKey}, this code will be invalid in 5 minutes.`;

            return await this.sendSms(phoneNumber, content);
      }
}
