import { Body, Controller, Get, Param, Post, Req, Res, UseGuards, UsePipes } from '@nestjs/common';
import { Response, Request } from 'express';
import { apiResponse } from '../app/interface/ApiResponse';
import { RegisterUserDTO, vRegisterUserDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { JoiValidatorPipe } from '../utils/validator/validator.pipe';
import { LoginUserDTO, vLoginUserDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { SmailService } from '../providers/smail/smail.service';
import { EmailForChangePasswordDTO } from './dto/emailForChangePassword.dto';
import { RedisService } from '../utils/redis/redis.service';
import { OtpSmsDTO } from './dto/otpSms.dto';
import { SmsService } from '../providers/sms/sms.service';

@Controller('auth')
export class AuthController {
      constructor(
            private readonly authService: AuthService,
            private readonly userService: UserService,
            private readonly smailService: SmailService,
            private readonly redisService: RedisService,
            private readonly smsService: SmsService,
      ) {}

      @Post('/otp-email')
      async sendOTPMail(@Body() body: EmailForChangePasswordDTO) {
            const user = await this.userService.findOneUserByField('email', body.email);
            if (!user) {
                  throw apiResponse.sendError({ body: { details: { email: 'email is not found' } } });
            }
            const redisKey = await this.authService.createOTPRedisKey(user, 2);
            const isSent = await this.smailService.sendOTPMail(user.email, redisKey);
            if (!isSent) throw apiResponse.sendError({ body: { details: { email: 'problem occurs when sending email' } } });
            return { redisKey: redisKey, isSent: isSent };
      }

      @Get('/google')
      @UseGuards(AuthGuard('google'))
      googleAuth() {
            //
      }

      @Get('/google/callback')
      @UseGuards(AuthGuard('google'))
      async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
            const refreshToken = await this.authService.createReToken(req.user);
            return res.cookie('re-token', refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 30 }).redirect(process.env.CLIENT_URL);
      }

      @Get('/facebook')
      @UseGuards(AuthGuard('facebook'))
      facebookAuth() {
            //
      }

      @Get('/facebook/callback')
      @UseGuards(AuthGuard('facebook'))
      async facebookAuthRedirect(@Req() req: Request, @Res() res: Response) {
            const refreshToken = await this.authService.createReToken(req.user);
            return res.cookie('re-token', refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 30 }).redirect(process.env.CLIENT_URL);
      }

      @Get('/github')
      @UseGuards(AuthGuard('github'))
      async githubAuth() {
            //
      }

      @Get('/github/callback')
      @UseGuards(AuthGuard('github'))
      async githubAuthRedirect(@Req() req: Request, @Res() res: Response) {
            const refreshToken = await this.authService.createReToken(req.user);
            return res.cookie('re-token', refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 30 }).redirect(process.env.CLIENT_URL);
      }

      @Post('/register')
      @UsePipes(new JoiValidatorPipe(vRegisterUserDto))
      async registerUser(@Body() body: RegisterUserDTO, @Res() res: Response) {
            const user = await this.userService.findOneUserByField('username', body.username);
            if (user) throw apiResponse.sendError({ body: { details: { username: 'username is already exist' } } });

            const newUser = new User();
            newUser.username = body.username;
            newUser.name = body.name;
            newUser.password = await this.authService.hash(body.password);
            const insertedUser = await this.authService.saveUser(newUser);

            const refreshToken = await this.authService.createReToken(insertedUser);
            return res.cookie('re-token', refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 30 }).send({ message: 'Register success' });
      }

      @Post('/login')
      @UsePipes(new JoiValidatorPipe(vLoginUserDto))
      async loginUser(@Body() body: LoginUserDTO, @Res() res: Response) {
            const user = await this.userService.findOneUserByField('username', body.username);
            if (!user) throw apiResponse.sendError({ body: { details: { username: 'username or password is not correct' } } });

            const isCorrect = await this.authService.comparePassword(body.password, user.password);
            if (!isCorrect) throw apiResponse.sendError({ body: { details: { username: 'username or password is not correct' } } });

            const refreshToken = await this.authService.createReToken(user);
            return res.cookie('re-token', refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 30 }).send({ message: 'Login success' });
      }

      @Post('/otp-sms')
      async sepSms(@Body() body: OtpSmsDTO) {
            const user = await this.userService.findOneUserByField('phoneNumber', body.phoneNumber);
            if (!user) throw apiResponse.sendError({ body: { details: { phoneNumber: 'is not correct' } } });

            const otpKey = this.authService.generateKeyForSms(user, 5);

            const res = await this.smsService.sendOtp(user.phoneNumber, otpKey);
            if (!res) throw apiResponse.sendError({ body: { message: 'please, try again later' }, type: 'InternalServerErrorException' });
            return apiResponse.send({ body: { message: 'an OTP has been sent to your phone number' } });
      }
}
