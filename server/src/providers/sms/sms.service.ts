import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../utils/logger/logger.service';
import { Twilio } from 'twilio';

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
}
