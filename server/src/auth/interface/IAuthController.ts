import { Response, Request } from 'express';
import { ApiServerResponse } from '../../app/interface/serverResponse';
import { UpdateEmailDTO } from '../../users/dto/updateEmail.dto';
import { LoginUserDTO } from '../dto/loginUser.dto';
import { OtpSmsDTO } from '../dto/otpSms.dto';
import { RegisterUserDTO } from '../dto/registerUser.dto';

export interface IAuthController {
      /**
       *@description Registered users can login to establish their identity with the application using the API below. The login operation requires two properties: username and password.
       */
      cLoginUser(body: LoginUserDTO, res: Response): Promise<Response<any, Record<string, any>>>;

      /**
       *@description The register API can be used to create user accounts in the application. A registration request must provide a user object as a collection of key/value properties.
       */
      cRegisterUser(body: RegisterUserDTO, res: Response): Promise<Response<any, Record<string, any>>>;

      /**
       *@description generate io-token which use to access in socket guard
       */
      cGetSocketToken(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;

      /**
       *@description The remove all authentication cookie of user
       */
      cLogout(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;

      /**
       *@description Create an email is sent with a link to a webpage which contains a form where the user can enter the new password.
       */
      cSendOTPByMail(body: UpdateEmailDTO, req: Request): Promise<ApiServerResponse>;

      /**
       *@description Create an OTP code is sent to the user phone number. Users can use it to access a webpage which contains a form where the user can enter the new password.
       */
      cSendOTPBySms(body: OtpSmsDTO, req: Request): Promise<ApiServerResponse>;

      /**
       *@description Checking is otp key is an valid key
       */
      cCheckOTP(key: string): Promise<ApiServerResponse>;

      /**
       *@description support user authentication and login into application with a Google account.
       */
      cGoogleAuth(): void;
      /**
       *@description support user authentication and login into application with a Google account. redirect to client page
       */
      cGoogleAuthRedirect(req: Request, res: Response): Promise<void>;

      /**
       *@description support user authentication and login into application with a Facebook account.
       */
      cFacebookAuth(): void;
      /**
       *@description support user authentication and login into application with a Facebook account. redirect to client page
       */
      cFacebookAuthRedirect(req: Request, res: Response): Promise<void>;

      /**
       *@description support user authentication and login into application with a Github account.
       */
      cGithubAuth(): Promise<void>;

      /**
       *@description support user authentication and login into application with a Github account. redirect to client page
       */
      cGithubAuthRedirect(req: Request, res: Response): Promise<void>;
}
