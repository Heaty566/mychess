import { Controller, Get, UseGuards, Req, Param, Body, Put, Post, UsePipes } from '@nestjs/common';

import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { MyAuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { apiResponse } from '../app/interface/ApiResponse';
import User from './entities/user.entity';
import { RedisService } from '../utils/redis/redis.service';
import { JoiValidatorPipe } from '../utils/validator/validator.pipe';
import { ChangePasswordDTO, vChangePasswordDTO } from './dto/changePassword.dto';
import { OtpSmsDTO } from '../auth/dto/otpSms.dto';
import { SmsService } from '../providers/sms/sms.service';

import { UpdateUserDto, vUpdateUserDto } from './dto/updateUser.dto';
import { EmailForChangePasswordDTO, vEmailForChangePasswordDTO } from './dto/emailForChangePassword.dto';
import { SmailService } from '../providers/smail/smail.service';

@Controller('user')
export class UserController {
      constructor(
            private readonly userService: UserService,
            private readonly authService: AuthService,
            private readonly redisService: RedisService,
            private readonly smsService: SmsService,
            private readonly smailService: SmailService,
      ) {}

      @Get('/')
      @UseGuards(MyAuthGuard)
      async getUser(@Req() req: Request) {
            const user = await this.userService.getOneUserByField('_id', req.user._id);

            return apiResponse.send<User>({ body: { data: user } });
      }

      @Put('/password/:otp')
      async resetPassword(@Param('otp') otp: string, @Body(new JoiValidatorPipe(vChangePasswordDTO)) body: ChangePasswordDTO) {
            const redisUser = await this.redisService.getObjectByKey<User>(otp);
            if (!redisUser) throw apiResponse.sendError({ type: 'ForbiddenException', body: { message: 'action is not allowed' } });
            const user = await this.userService.findOneUserByField('username', redisUser.username);

            user.password = await this.authService.hash(body.newPassword);
            await this.userService.saveUser(user);
            this.redisService.deleteByKey(otp);

            return apiResponse.send<void>({ body: { message: 'update user successfully' } });
      }

      @Post('/otp-sms')
      @UseGuards(MyAuthGuard)
      async otpUpdatePhone(@Body() body: OtpSmsDTO, @Req() req: Request) {
            let user = await this.userService.findOneUserByField('phoneNumber', body.phoneNumber);
            if (user) throw apiResponse.sendError({ body: { details: { phoneNumber: 'is already exist' } } });

            user = await this.userService.findOneUserByField('_id', req.user._id);

            user.phoneNumber = body.phoneNumber;

            const otpKey = this.authService.generateKeyForSms(user, 5);

            const res = await this.smsService.sendOtp(user.phoneNumber, otpKey);
            if (!res) throw apiResponse.sendError({ body: { message: 'please, try again later' }, type: 'InternalServerErrorException' });
            return apiResponse.send({ body: { message: 'an OTP has been sent to your phone number' } });
      }

      @Put('/phone/:otp')
      @UseGuards(MyAuthGuard)
      async updatePhone(@Param('otp') otp: string) {
            const redisUser = await this.redisService.getObjectByKey<User>(otp);
            if (!redisUser) throw apiResponse.sendError({ type: 'ForbiddenException', body: { message: 'action is not allowed' } });

            const user = await this.userService.findOneUserByField('username', redisUser.username);
            user.phoneNumber = redisUser.phoneNumber;
            await this.userService.saveUser(user);
            this.redisService.deleteByKey(otp);
      }

      @Post('/otp-email')
      @UseGuards(MyAuthGuard)
      @UsePipes(new JoiValidatorPipe(vEmailForChangePasswordDTO))
      async sendOTPMailUpdateEmail(@Body() body: EmailForChangePasswordDTO, @Req() req: Request) {
            let user = await this.userService.findOneUserByField('email', body.email);
            if (user) throw apiResponse.sendError({ body: { details: { email: 'email is taken' } } });

            user = req.user;
            user.email = body.email;

            const redisKey = await this.authService.createOTPRedisKey(user, 2);
            const isSent = await this.smailService.sendOTPMailUpdateEmail(user.email, redisKey);
            if (!isSent)
                  throw apiResponse.sendError({
                        body: { details: { email: 'problem occurs when sending email' } },
                        type: 'InternalServerErrorException',
                  });

            return apiResponse.send({ body: { message: 'a mail has been sent to you email' } });
      }

      @Put('/email/:otp')
      async updateEmail(@Param('otp') otp: string) {
            const redisUser = await this.redisService.getObjectByKey<User>(otp);
            if (!redisUser) throw apiResponse.sendError({ type: 'ForbiddenException', body: { message: 'action is not allowed' } });

            const user = await this.userService.findOneUserByField('username', redisUser.username);
            user.email = redisUser.email;

            await this.userService.saveUser(user);
            this.redisService.deleteByKey(otp);

            return apiResponse.send<void>({ body: { message: 'update user successfully' } });
      }

      @Put('/')
      @UseGuards(MyAuthGuard)
      async updateUser(@Req() req: Request, @Body(new JoiValidatorPipe(vUpdateUserDto)) body: UpdateUserDto) {
            const user = await this.userService.findOneUserByField('_id', req.user._id);
            user.name = body.name;
            await this.userService.saveUser(user);

            return apiResponse.send<void>({ body: { message: 'update user successfully' } });
      }
}
