import { Injectable } from '@nestjs/common';
import { MailService, MailDataRequired } from '@sendgrid/mail';

import { LoggerService } from '../../utils/logger/logger.service';
@Injectable()
export class SmailService {
      constructor(private readonly mailService: MailService, private readonly LoggerService: LoggerService) {}

      private sendMail(receiver: string, content: string, subject = 'MyGame') {
            const msg: MailDataRequired = {
                  to: receiver,
                  from: process.env.SENDGIRD_MAIL,
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
                  .catch((error) => {
                        this.LoggerService.print(error, 'error');

                        return false;
                  });
      }

      async sendOTP(receiver: string, OTP: string) {
            return await this.sendMail(
                  receiver,
                  `
            <div>
                  <h2>Hello</h2>
                  <p>You receiving this email because we received a password request for your account.</p>
                  </br>
                  <p>Please click this link:<a href="${process.env.CLIENT_URL}/user/reset-password/${OTP}">Click here</a>
                  </p>
                  </br>
            </div>`,
            );
      }

      async sendOTPForUpdateEmail(receiver: string, OTP: string) {
            return await this.sendMail(
                  receiver,
                  `
            <div>
                  <h2>Hello</h2>
                  <p>You receiving this email because we received update email request for your account.</p>
                  </br>
                  <p>Please click this link:</p><a href="${process.env.CLIENT_URL}/user/update-email/${OTP}">Click here</a>
                  </br>
            </div>`,
            );
      }
}
