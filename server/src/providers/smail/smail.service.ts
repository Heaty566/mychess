import { Injectable } from '@nestjs/common';
import { MailService, MailDataRequired } from '@sendgrid/mail';

//----- Service
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
                              enable: process.env.NODE_ENV === 'test' || process.env.DOC === 'active',
                        },
                  },
            };
            return this.mailService
                  .send(msg)
                  .then((msg) => {
                        return true;
                  })
                  .catch((error) => {
                        this.LoggerService.print(error, 'smail.service.ts', 'error');

                        return false;
                  });
      }

      async sendOTP(receiver: string, OTP: string) {
            return await this.sendMail(
                  receiver,
                  `
            <div>
                  <h2>Hi ${receiver}</h2>
                  <>We're received a request to reset the password for the My game account. No changes have been made to your account yet.</p>
                  </br>
                  <p>You can reset your password by clicking the link: <a href="${process.env.CLIENT_URL}/user/reset-password/${OTP}">Click here</a></p>
                  </br>
                  <p>If you did not request a new password, you can safely ignore this email. Please do not share this email, link, or access code with others</p>
            </div>`,
            );
      }

      async sendOTPForUpdateEmail(receiver: string, OTP: string) {
            return await this.sendMail(
                  receiver,
                  `
            <div>
                  <h2>Hi ${receiver}</h2>
                  <>We're received a request to update the email for the My game account. No changes have been made to your account yet.</p>
                  </br>
                  <p>You can reset your password by clicking the link: <a href="${process.env.CLIENT_URL}/user/update-with-otp/${OTP}">Click here</a></p>
                  </br>
                  <p>If you did not request an updated email, you can safely ignore this email. Please do not share this email, link, or access code with others</p>
            </div>`,
            );
      }
}
