import { Body, Controller, Get, Post, Query, Req, Res, UseGuards, UsePipes } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';

//---- Service
import { SmailService } from '../providers/smail/smail.service';
import { SmsService } from '../providers/sms/sms.service';
import { UserService } from '../users/user.service';
import { AuthService } from './auth.service';
import { RedisService } from '../providers/redis/redis.service';

//---- Entity
import { User } from '../users/entities/user.entity';

//---- Pipe
import { JoiValidatorPipe } from '../utils/validator/validator.pipe';
import { UserGuard } from './auth.guard';

//---- DTO
import { UpdateEmailDTO, vUpdateEmailDTO } from '../users/dto/updateEmail.dto';
import { RegisterUserDTO, vRegisterUserDto } from './dto/registerUser.dto';
import { LoginUserDTO, vLoginUserDto } from './dto/loginUser.dto';
import { OtpSmsDTO, vOtpSmsDTO } from './dto/otpSms.dto';

//---- Common
import { apiResponse } from '../app/interface/ApiResponse';
import { config } from '../config';
import { IAuthController } from './interface/IAuthController';
@Controller('auth')
export class AuthController implements IAuthController {
      constructor(
            private readonly authService: AuthService,
            private readonly userService: UserService,
            private readonly smailService: SmailService,
            private readonly smsService: SmsService,
            private readonly redisService: RedisService,
      ) {}

      //----------------------------------Common authentication-----------------------------------------------------------
      // need to be fixed
      @Post('/login')
      @UsePipes(new JoiValidatorPipe(vLoginUserDto))
      async cLoginUser(@Body() body: LoginUserDTO, @Res() res: Response) {
            //checking user is exist or not
            const isUserExist = await this.userService.findOneUserByField('username', body.username);
            if (!isUserExist)
                  throw apiResponse.sendError({
                        body: { details: { username: { type: 'user.auth-failed' } } },
                  });

            //checking hash password
            const isCorrect = await this.authService.decryptString(body.password, isUserExist.password);
            if (!isCorrect)
                  throw apiResponse.sendError({
                        body: { details: { username: { type: 'user.auth-failed' } } },
                  });

            //return token
            const reToken = await this.authService.createReToken(isUserExist);
            return res.cookie('re-token', reToken, { maxAge: config.authController.loginCookieTime }).send();
      }

      @Post('/register')
      @UsePipes(new JoiValidatorPipe(vRegisterUserDto))
      async cRegisterUser(@Body() body: RegisterUserDTO, @Res() res: Response) {
            //checking user is exist or not
            const isUserExist = await this.userService.findOneUserByField('username', body.username);
            if (isUserExist)
                  throw apiResponse.sendError({
                        body: { details: { username: { type: 'user.field-taken' } } },
                  });

            //create and insert new user
            const newUser = new User();
            newUser.username = body.username;
            newUser.name = body.name;
            newUser.password = await this.authService.encryptString(body.password);
            newUser.avatarUrl = this.userService.randomAvatar();
            const insertedUser = await this.userService.saveUser(newUser);

            //return token
            const reToken = await this.authService.createReToken(insertedUser);
            return res.cookie('re-token', reToken, { maxAge: config.authController.registerCookieTime }).send();
      }

      @Get('/socket-token')
      @UseGuards(UserGuard)
      async cGetSocketToken(@Req() req: Request, @Res() res: Response) {
            //checking user is exist
            const user = await this.userService.findOneUserByField('id', req.user.id);
            if (!user)
                  throw apiResponse.sendError({
                        body: { message: { type: 'user.invalid-input' } },
                        type: 'UnauthorizedException',
                  });

            //create socket io token
            const socketId = await this.authService.getSocketToken(user);

            return res.cookie('io-token', socketId, { maxAge: config.authController.socketCookieTime }).send();
      }

      @Post('/logout')
      @UseGuards(UserGuard)
      async cLogout(@Req() req: Request, @Res() res: Response) {
            // clear all token in database
            await this.authService.clearToken(req.user.id);

            return res.cookie('re-token', '', { maxAge: -999 }).cookie('auth-token', '', { maxAge: -999 }).send();
      }

      //----------------------------------OTP authentication without guard-----------------------------------------------------------
      @Post('/otp-email')
      @UsePipes(new JoiValidatorPipe(vUpdateEmailDTO))
      async cSendOTPByMail(@Body() body: UpdateEmailDTO, @Req() req: Request) {
            //checking amount of time which user request before by ip
            const userIp = this.authService.parseIp(req);
            let canSendMore = await this.authService.isRateLimitKey(
                  userIp,
                  config.authController.OTPMailLimitTime * 2,
                  config.authController.OTPMailBlockTime,
            );
            if (!canSendMore)
                  throw apiResponse.sendError({
                        body: { details: { email: { type: 'user.request-many-time-60p' } } },
                  });

            //checking email is exist
            const user = await this.userService.findOneUserByField('email', body.email);
            if (!user)
                  throw apiResponse.sendError({
                        body: { details: { email: { type: 'user.field.not-found' } } },
                  });

            //checking amount of time which user request before by email
            canSendMore = await this.authService.isRateLimitKey(
                  user.email,
                  config.authController.OTPMailLimitTime,
                  config.authController.OTPMailBlockTime,
            );
            if (!canSendMore)
                  throw apiResponse.sendError({
                        body: { details: { email: { type: 'user.request-many-time-30p' } } },
                  });

            //generate otp key
            const redisKey = await this.authService.generateOTP(user, config.authController.OTPMailValidTime, 'email');
            const isSent = await this.smailService.sendOTP(user.email, redisKey);
            if (!isSent)
                  throw apiResponse.sendError({
                        body: { details: { email: { type: 'server.some-wrong' } } },
                        type: 'BadGatewayException',
                  });

            return apiResponse.send({
                  body: { message: { type: 'server.send-email-otp' } },
            });
      }

      @Post('/otp-sms')
      @UsePipes(new JoiValidatorPipe(vOtpSmsDTO))
      async cSendOTPBySms(@Body() body: OtpSmsDTO, @Req() req: Request) {
            //checking amount of time which user request before by ip
            const userIp = this.authService.parseIp(req);
            let canSendMore = await this.authService.isRateLimitKey(
                  userIp,
                  config.authController.OTPPhoneLimitTime * 2,
                  config.authController.OTPPhoneBlockTime,
            );
            if (!canSendMore)
                  throw apiResponse.sendError({
                        body: { details: { phoneNumber: { type: 'user.request-many-time-60p' } } },
                  });

            //checking phone is exist
            const user = await this.userService.findOneUserByField('phoneNumber', body.phoneNumber);
            if (!user)
                  throw apiResponse.sendError({
                        body: { details: { phoneNumber: { type: 'user.field.not-found' } } },
                  });

            //checking amount of time which user request before by phone
            canSendMore = await this.authService.isRateLimitKey(
                  user.phoneNumber,
                  config.authController.OTPPhoneLimitTime,
                  config.authController.OTPPhoneBlockTime,
            );
            if (!canSendMore)
                  throw apiResponse.sendError({
                        body: { details: { phoneNumber: { type: 'user.request-many-time-60p' } } },
                  });

            //generate otp
            const otpKey = this.authService.generateOTP(user, config.authController.OTPPhoneValidTime, 'sms');
            const isSent = await this.smsService.sendOTP(user.phoneNumber, otpKey);
            if (!isSent)
                  throw apiResponse.sendError({
                        body: { details: { phoneNumber: { type: 'server.some-wrong' } } },
                        type: 'InternalServerErrorException',
                  });

            return apiResponse.send({
                  body: { message: { type: 'server.send-phone-otp' } },
            });
      }

      @Post('/check-otp')
      async cCheckOTP(@Query('key') key: string) {
            //checking is valid otp
            if (!key)
                  throw apiResponse.sendError({
                        type: 'ForbiddenException',
                        body: {
                              details: {
                                    otp: { type: 'user.not-allow-action' },
                              },
                        },
                  });

            //checking otp is exist
            const isExist = await this.redisService.getObjectByKey<User>(key);
            if (!isExist)
                  throw apiResponse.sendError({
                        type: 'ForbiddenException',
                        body: {
                              details: {
                                    otp: { type: 'user.not-allow-action' },
                              },
                        },
                  });

            return apiResponse.send<void>({
                  body: {
                        message: { type: 'server.success' },
                  },
            });
      }

      //---------------------------------- 3rd authentication -----------------------------------------------------------
      @Get('/google')
      @UseGuards(AuthGuard('google'))
      cGoogleAuth() {
            //
      }

      @Get('/google/callback')
      @UseGuards(AuthGuard('google'))
      async cGoogleAuthRedirect(@Req() req: Request, @Res() res: Response) {
            const reToken = await this.authService.createReToken(req.user);
            return res.cookie('re-token', reToken, { maxAge: config.authController.googleUserCookieTime }).redirect(process.env.CLIENT_URL);
      }

      @Get('/facebook')
      @UseGuards(AuthGuard('facebook'))
      cFacebookAuth() {
            //
      }

      @Get('/facebook/callback')
      @UseGuards(AuthGuard('facebook'))
      async cFacebookAuthRedirect(@Req() req: Request, @Res() res: Response) {
            const reToken = await this.authService.createReToken(req.user);
            return res.cookie('re-token', reToken, { maxAge: config.authController.facebookUserCookieTime }).redirect(process.env.CLIENT_URL);
      }

      @Get('/github')
      @UseGuards(AuthGuard('github'))
      async cGithubAuth() {
            //
      }

      @Get('/github/callback')
      @UseGuards(AuthGuard('github'))
      async cGithubAuthRedirect(@Req() req: Request, @Res() res: Response) {
            const reToken = await this.authService.createReToken(req.user);
            return res.cookie('re-token', reToken, { maxAge: config.authController.githubUserCookieTime }).redirect(process.env.CLIENT_URL);
      }
}
