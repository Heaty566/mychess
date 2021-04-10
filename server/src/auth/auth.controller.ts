import { Body, Controller, Get, Param, Post, Req, Res, UseGuards, UsePipes } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';

import { UpdateEmailDTO, vUpdateEmailDTO } from '../models/users/dto/updateEmail.dto';
import { RegisterUserDTO, vRegisterUserDto } from './dto/registerUser.dto';
import { LoginUserDTO, vLoginUserDto } from './dto/loginUser.dto';
import { OtpSmsDTO, vOtpSmsDTO } from './dto/otpSms.dto';
import { SmailService } from '../providers/smail/smail.service';
import { SmsService } from '../providers/sms/sms.service';
import { JoiValidatorPipe } from '../utils/validator/validator.pipe';
import { User } from '../models/users/entities/user.entity';
import { apiResponse } from '../app/interface/ApiResponse';
import { AuthService } from './auth.service';
import { UserService } from '../models/users/user.service';
import { MyAuthGuard } from './auth.guard';
import { RedisService } from '../providers/redis/redis.service';

@Controller('auth')
export class AuthController {
      constructor(
            private readonly authService: AuthService,
            private readonly userService: UserService,
            private readonly smailService: SmailService,
            private readonly smsService: SmsService,
            private readonly redisService: RedisService,
      ) {}

      //----------------------------------Common authentication-----------------------------------------------------------
      @Post('/login')
      @UsePipes(new JoiValidatorPipe(vLoginUserDto))
      async cLoginUser(@Body() body: LoginUserDTO, @Res() res: Response) {
            //checking user is exist or not
            const isUserExist = await this.userService.findOneUserByField('username', body.username);
            if (!isUserExist) throw apiResponse.sendError({ body: { details: { username: 'user.auth-failed' } } });

            //checking hash password
            const isCorrect = await this.authService.decryptString(body.password, isUserExist.password);
            if (!isCorrect) throw apiResponse.sendError({ body: { details: { username: 'user.auth-failed' } } });

            //return token
            const reToken = await this.authService.createReToken(isUserExist);
            return res.cookie('re-token', reToken, { maxAge: 1000 * 60 * 60 * 24 * 30 }).send();
      }

      @Post('/register')
      @UsePipes(new JoiValidatorPipe(vRegisterUserDto))
      async cRegisterUser(@Body() body: RegisterUserDTO, @Res() res: Response) {
            //checking user is exist or not
            const isUserExist = await this.userService.findOneUserByField('username', body.username);
            if (isUserExist) throw apiResponse.sendError({ body: { details: { username: 'user.field-taken' } } });

            const newUser = new User();
            newUser.username = body.username;
            newUser.name = body.name;
            newUser.password = await this.authService.encryptString(body.password);
            const insertedUser = await this.userService.saveUser(newUser);

            //return token
            const reToken = await this.authService.createReToken(insertedUser);
            return res.cookie('re-token', reToken, { maxAge: 1000 * 60 * 60 * 24 * 30 }).send();
      }

      @Post('/logout')
      @UseGuards(MyAuthGuard)
      async cLogout(@Req() req: Request, @Res() res: Response) {
            await this.authService.clearToken(req.user.id);

            return res.cookie('re-token', '', { maxAge: -999 }).cookie('auth-token', '', { maxAge: -999 }).send();
      }

      //----------------------------------OTP authentication without guard-----------------------------------------------------------
      @Post('/otp-email')
      @UsePipes(new JoiValidatorPipe(vUpdateEmailDTO))
      async cSendOTPByMail(@Body() body: UpdateEmailDTO) {
            const user = await this.userService.findOneUserByField('email', body.email);
            if (!user) throw apiResponse.sendError({ body: { details: { email: 'user.field.not-found' } } });

            const canSendMore = await this.authService.limitSendingEmailOrSms(user.email, 5, 30);
            if (!canSendMore) throw apiResponse.sendError({ body: { details: { email: 'user.request-many-time-30p' } } });

            const redisKey = await this.authService.generateOTP(user, 30, 'email');
            const isSent = await this.smailService.sendOTP(user.email, redisKey);
            if (!isSent) throw apiResponse.sendError({ body: { details: { email: 'server.some-wrong' } }, type: 'InternalServerErrorException' });

            return apiResponse.send({ body: { message: 'server.send-email-otp' } });
      }

      @Post('/otp-sms')
      @UsePipes(new JoiValidatorPipe(vOtpSmsDTO))
      async cSendOTPBySms(@Body() body: OtpSmsDTO) {
            const user = await this.userService.findOneUserByField('phoneNumber', body.phoneNumber);
            if (!user) throw apiResponse.sendError({ body: { details: { phoneNumber: 'user.field.not-found' } } });

            const canSendMore = await this.authService.limitSendingEmailOrSms(user.phoneNumber, 5, 60);
            if (!canSendMore) throw apiResponse.sendError({ body: { details: { phoneNumber: 'user.request-many-time-60p' } } });

            const otpKey = this.authService.generateOTP(user, 5, 'sms');
            const isSent = await this.smsService.sendOTP(user.phoneNumber, otpKey);
            if (!isSent)
                  throw apiResponse.sendError({ body: { details: { phoneNumber: 'server.some-wrong' } }, type: 'InternalServerErrorException' });

            return apiResponse.send({ body: { message: 'server.send-phone-otp' } });
      }

      @Post('/check-otp/:otp')
      async cCheckOTP(@Param('otp') otp: string) {
            const isExist = await this.redisService.getObjectByKey<User>(otp);
            if (!isExist) throw apiResponse.sendError({ type: 'ForbiddenException', body: { message: 'user.not-allow-action' } });

            return apiResponse.send<void>({ body: { message: 'server.success' } });
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
            return res.cookie('re-token', reToken, { maxAge: 1000 * 60 * 60 * 24 * 30 }).redirect(process.env.CLIENT_URL);
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
            return res.cookie('re-token', reToken, { maxAge: 1000 * 60 * 60 * 24 * 30 }).redirect(process.env.CLIENT_URL);
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
            return res.cookie('re-token', reToken, { maxAge: 1000 * 60 * 60 * 24 * 30 }).redirect(process.env.CLIENT_URL);
      }
}
