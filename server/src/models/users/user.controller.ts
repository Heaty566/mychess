import { Controller, Get, UseGuards, Req, Param, Body, Put, Post, UsePipes, UseInterceptors, UploadedFile } from '@nestjs/common';
import { Request } from 'express';

import { SmailService } from '../../providers/smail/smail.service';
import { AuthService } from '../../auth/auth.service';
import { UserService } from './user.service';
import { RedisService } from '../../providers/redis/redis.service';
import { SmsService } from '../../providers/sms/sms.service';
import { JoiValidatorPipe } from '../../utils/validator/validator.pipe';
import { MyAuthGuard } from '../../auth/auth.guard';
import { apiResponse } from '../../app/interface/ApiResponse';
import { User } from './entities/user.entity';

import { OtpSmsDTO, vOtpSmsDTO } from '../../auth/dto/otpSms.dto';
import { ChangePasswordDTO, vChangePasswordDTO } from './dto/changePassword.dto';
import { UpdateUserDto, vUpdateUserDto } from './dto/updateBasicUser.dto';
import { UpdateEmailDTO, vUpdateEmailDTO } from './dto/updateEmail.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from '../../providers/aws/aws.service';

@Controller('user')
export class UserController {
      constructor(
            private readonly userService: UserService,
            private readonly authService: AuthService,
            private readonly redisService: RedisService,
            private readonly smsService: SmsService,
            private readonly smailService: SmailService,
            private readonly awsService: AwsService,
      ) {}

      @Get('/')
      @UseGuards(MyAuthGuard)
      async cGetUser(@Req() req: Request) {
            const user = await this.userService.getOneUserByField('_id', req.user._id);

            return apiResponse.send<User>({ body: { data: user } });
      }

      //------------------Update user information------------------------------------------
      @Put('/')
      @UseGuards(MyAuthGuard)
      async cUpdateUserBasicInformation(@Req() req: Request, @Body(new JoiValidatorPipe(vUpdateUserDto)) body: UpdateUserDto) {
            const user = await this.userService.findOneUserByField('_id', req.user._id);
            user.name = body.name;
            await this.userService.saveUser(user);

            return apiResponse.send<void>({ body: { message: 'update user successfully' } });
      }

      @Put('/avatar')
      @UseGuards(MyAuthGuard)
      @UseInterceptors(FileInterceptor('avatar'))
      async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
            if (!file) throw apiResponse.sendError({ body: { details: { avatar: 'any.required' } }, isTranslateDetails: true });

            const isCorrectSize = this.awsService.checkFileSize(file, 1);
            if (!isCorrectSize)
                  throw apiResponse.sendError({
                        body: { details: { avatar: "couldn't be uploaded. Photos should be smaller than {{size}} MB" } },
                        context: { size: '1' },
                        isTranslateDetails: true,
                  });

            const isCorrectFileExtension = this.awsService.checkFileExtension(file);
            if (!isCorrectFileExtension)
                  throw apiResponse.sendError({
                        body: { details: { avatar: "couldn't be uploaded. Photos should be saved as JPEG, JPG, PNG, BMP files" } },
                        isTranslateDetails: true,
                  });

            const fileLocation = await this.awsService.uploadFile(file, String(req.user._id), 'user');
            if (!fileLocation) throw apiResponse.sendError({ body: { message: 'please, try again later' }, type: 'InternalServerErrorException' });

            const user = await this.userService.getOneUserByField('_id', req.user._id);
            user.avatarUrl = '/' + fileLocation;
            await this.userService.saveUser(user);

            return apiResponse.send<void>({ body: { message: 'update user successfully' } });
      }

      @Put('/password/:otp')
      async cUpdatePasswordByOtp(@Param('otp') otp: string, @Body(new JoiValidatorPipe(vChangePasswordDTO)) body: ChangePasswordDTO) {
            const redisUser = await this.redisService.getObjectByKey<User>(otp);
            if (!redisUser) throw apiResponse.sendError({ type: 'ForbiddenException', body: { message: 'action is not allowed' } });
            const user = await this.userService.findOneUserByField('username', redisUser.username);

            user.password = await this.authService.encryptString(body.newPassword);
            await this.userService.saveUser(user);
            this.redisService.deleteByKey(otp);

            return apiResponse.send<void>({ body: { message: 'update user successfully' } });
      }

      @Put('/email/:otp')
      @UseGuards(MyAuthGuard)
      async cUpdateEmailByOTP(@Param('otp') otp: string) {
            const redisUser = await this.redisService.getObjectByKey<User>(otp);
            if (!redisUser) throw apiResponse.sendError({ type: 'ForbiddenException', body: { message: 'action is not allowed' } });

            const user = await this.userService.findOneUserByField('username', redisUser.username);
            user.email = redisUser.email;

            await this.userService.saveUser(user);
            this.redisService.deleteByKey(otp);

            return apiResponse.send<void>({ body: { message: 'update user successfully' } });
      }

      @Put('/phone/:otp')
      @UseGuards(MyAuthGuard)
      async cUpdatePhoneByOTP(@Param('otp') otp: string) {
            const redisUser = await this.redisService.getObjectByKey<User>(otp);
            if (!redisUser) throw apiResponse.sendError({ type: 'ForbiddenException', body: { message: 'action is not allowed' } });

            const user = await this.userService.findOneUserByField('username', redisUser.username);
            user.phoneNumber = redisUser.phoneNumber;
            await this.userService.saveUser(user);
            this.redisService.deleteByKey(otp);
      }

      //-----------------------------------Create-OTP--WITH GUARD-------------------------------
      @Post('/otp-sms')
      @UseGuards(MyAuthGuard)
      @UsePipes(new JoiValidatorPipe(vOtpSmsDTO))
      async cCreateOTPBySmsWithGuard(@Body() body: OtpSmsDTO, @Req() req: Request) {
            let user = await this.userService.findOneUserByField('phoneNumber', body.phoneNumber);
            if (user) throw apiResponse.sendError({ body: { details: { phoneNumber: 'is already exist' } } });

            user = await this.userService.findOneUserByField('_id', req.user._id);

            user.phoneNumber = body.phoneNumber;

            const otpKey = this.authService.generateOTP(user, 10, 'sms');
            const res = await this.smsService.sendOTP(user.phoneNumber, otpKey);

            if (!res) throw apiResponse.sendError({ body: { message: 'please, try again later' }, type: 'InternalServerErrorException' });
            return apiResponse.send({ body: { message: 'an OTP has been sent to your phone number' } });
      }

      @Post('/otp-email')
      @UseGuards(MyAuthGuard)
      @UsePipes(new JoiValidatorPipe(vUpdateEmailDTO))
      async cCreateOtpByEmailWithGuard(@Body() body: UpdateEmailDTO, @Req() req: Request) {
            let user = await this.userService.findOneUserByField('email', body.email);
            if (user) throw apiResponse.sendError({ body: { details: { email: 'email is taken' } } });

            user = req.user;
            user.email = body.email;

            const redisKey = await this.authService.generateOTP(user, 30, 'email');
            const isSent = await this.smailService.sendOTPForUpdateEmail(user.email, redisKey);
            if (!isSent)
                  throw apiResponse.sendError({
                        body: { details: { email: 'problem occurs when sending email' } },
                        type: 'InternalServerErrorException',
                  });

            return apiResponse.send({ body: { message: 'a mail has been sent to you email' } });
      }
}
