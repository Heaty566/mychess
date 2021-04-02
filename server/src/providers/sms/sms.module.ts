import { Module } from '@nestjs/common';
import { Twilio } from 'twilio';

import { SmsService } from './sms.service';
import { LoggerModule } from '../../utils/logger/logger.module';
@Module({
      imports: [LoggerModule],
      providers: [SmsService, { provide: Twilio, useFactory: () => new Twilio(process.env.TWILIO_API_ID, process.env.TWILIO_API_SECRET) }],
      exports: [SmsService, Twilio],
})
export class SmsModule {}
