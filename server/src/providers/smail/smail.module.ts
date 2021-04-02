import { Module } from '@nestjs/common';
import { SmailService } from './smail.service';
import { MailService } from '@sendgrid/mail';
import * as mail from '@sendgrid/mail';

import { LoggerModule } from '../../utils/logger/logger.module';
@Module({
      imports: [LoggerModule],
      providers: [
            SmailService,
            {
                  provide: MailService,
                  useFactory: () => {
                        mail.setApiKey(process.env.SENDGRID_API_KEY);
                        return mail;
                  },
            },
      ],
      exports: [SmailService, MailService],
})
export class SmailModule {}
