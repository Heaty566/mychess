import { Injectable } from '@nestjs/common';
import { MailService, MailDataRequired } from '@sendgrid/mail';

@Injectable()
export class SmailService {
      constructor(private readonly mailService: MailService) {}

      private sendMail(receiver: string, content: string, subject = 'MyGame') {
            const msg: MailDataRequired = {
                  to: receiver,
                  from: 'MyGame<noreply@heaty566.com>',
                  subject: subject,
                  html: `
                        <div>
                          <p>${content}</p>
                          </br>
                          <p>Thanks,</p>
                          <p>MyGame Team</p>
                          <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px;" width="218" alt="" data-proportionally-constrained="true" data-responsive="false" src="http://cdn.mcauto-images-production.sendgrid.net/96bce11efbe6f18b/d9afa6bb-38f3-497f-804d-b7237fbe3683/218x54.png" height="54"/> 
                        </div>`,
                  mailSettings: {
                        sandboxMode: {
                              enable: process.env.NODE_ENV === 'test',
                        },
                  },
            };
            return this.mailService
                  .send(msg)
                  .then(() => {
                        return true;
                  })
                  .catch(() => {
                        return false;
                  });
      }
}
