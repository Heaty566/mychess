import { Controller, Get, UseGuards, Req, Param, Body, Put, Post } from '@nestjs/common';
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

@Controller('user')
export class UserController {
      constructor(
            private readonly userService: UserService,
            private readonly authService: AuthService,
            private readonly redisService: RedisService,
            private readonly smsService: SmsService,
      ) {}

      @Get('/')
      @UseGuards(MyAuthGuard)
      async getUser(@Req() req: Request) {
            const user = await this.userService.getOneUserByField('_id', req.user._id);

            return apiResponse.send<User>({ body: { data: user } });
      }

      @Put('/reset-password/:otp')
      async resetPassword(@Param('otp') otp: string, @Body(new JoiValidatorPipe(vChangePasswordDTO)) body: ChangePasswordDTO) {
            const redisUser = await this.redisService.getObjectByKey<User>(otp);
            if (!redisUser) throw apiResponse.sendError({ type: 'ForbiddenException', body: { message: 'action is not allowed' } });

            const user = await this.userService.findOneUserByField('username', redisUser.username);
            user.password = await this.authService.hash(body.newPassword);
            await this.authService.saveUser(user);
            this.redisService.deleteByKey(otp);

            return apiResponse.send<void>({ body: { message: 'update user success' } });
      }

      @Post('/otp-update-phone')
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

      @Put('/update-phone/:otp')
      @UseGuards(MyAuthGuard)
      async updatePhone(@Param('otp') otp: string) {
            const redisUser = await this.redisService.getObjectByKey<User>(otp);
            if (!redisUser) throw apiResponse.sendError({ type: 'ForbiddenException', body: { message: 'action is not allowed' } });

            const user = await this.userService.findOneUserByField('username', redisUser.username);
            user.phoneNumber = redisUser.phoneNumber;
            await this.authService.saveUser(user);
            this.redisService.deleteByKey(otp);

            return apiResponse.send<void>({ body: { message: 'update user success' } });
      }
}
