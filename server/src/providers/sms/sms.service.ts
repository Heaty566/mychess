import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
export class SmsService {
      constructor(private readonly twilioService: Twilio) {}

      private sendSms(phoneNumber: string, content: string): Promise<boolean> {
            return this.twilioService.messages
                  .create({
                        to: phoneNumber,
                        from: process.env.TWILIO_API_NUMBER,
                        body: content,
                  })
                  .then(() => true)
                  .catch((error) => {
                        if (process.env.NODE_ENV === 'development') {
                              console.log(error);
                        }
                        return false;
                  });
      }
}
