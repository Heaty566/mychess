import { Controller, Get, UseGuards, Req, Param, Body, Put, Post, UsePipes, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

//---- Service
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { SmailService } from '../providers/smail/smail.service';
import { SmsService } from '../providers/sms/sms.service';
import { AwsService } from '../providers/aws/aws.service';
import { RedisService } from '../utils/redis/redis.service';

//---- Entity
import { User } from './entities/user.entity';

//---- Pipe
import { UserGuard } from '../auth/auth.guard';

import { JoiValidatorPipe } from '../utils/validator/validator.pipe';

//---- DTO
import { OtpSmsDTO, vOtpSmsDTO } from '../auth/dto/otpSms.dto';
import { ResetPasswordDTO, vResetPasswordDTO } from './dto/resetPassword.dto';
import { ChangePasswordDTO, vChangePasswordDTO } from './dto/changePassword.dto';
import { UpdateUserDto, vUpdateUserDto } from './dto/updateBasicUser.dto';
import { UpdateEmailDTO, vUpdateEmailDTO } from './dto/updateEmail.dto';
import { SearchUsersDTO, vSearchUsersDTO } from './dto/searchUsers';
import { UserCustomDTO } from './dto/userCustom.dto';

//---- Common
import { apiResponse } from '../app/interface/apiResponse';
import { config } from '../config';

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
      @UseGuards(UserGuard)
      async cGetUser(@Req() req: Request) {
            //get user
            const user = await this.userService.findOneUserByField('id', req.user.id);

            return apiResponse.send<UserCustomDTO>({ data: user });
      }

      @Get('/search')
      async cSearchUsers(@Query() queries: SearchUsersDTO) {
            //validate query
            const { value } = <{ value: SearchUsersDTO }>vSearchUsersDTO.validate(queries, { convert: true, stripUnknown: true });

            //get user
            const result = await this.userService.searchUsersByNameAndCount(value.name, value.pageSize, value.currentPage);
            return apiResponse.send<{ users: Array<User>; count: number }>({ data: result });
      }

      @Get('/:id')
      async cGetUserById(@Param('id') id: string) {
            //get user
            const user = await this.userService.findOneUserWithoutSomeSensitiveFields('id', id);
            if (!user) throw apiResponse.sendError({ details: { errorMessage: { type: 'error.invalid-input' } } }, 'BadRequestException');

            return apiResponse.send<UserCustomDTO>({ data: user });
      }

      //------------------Update user information------------------------------------------
      @Put('/')
      @UseGuards(UserGuard)
      async cUpdateUserBasicInformation(@Req() req: Request, @Body(new JoiValidatorPipe(vUpdateUserDto)) body: UpdateUserDto) {
            //get user
            const user = await this.userService.findOneUserByField('id', req.user.id);

            //update user
            user.name = body.name;
            await this.userService.saveUser(user);

            return apiResponse.send<void>({ details: { message: { type: 'message.update-success' } } });
      }

      @Put('/avatar')
      @UseGuards(UserGuard)
      @UseInterceptors(FileInterceptor('avatar'))
      async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
            //checking file is exist
            if (!file) throw apiResponse.sendError({ details: { avatar: { type: 'any.required' } } }, 'BadRequestException');

            //checking size
            const isCorrectSize = this.awsService.checkFileSize(file, config.userController.avatarLimitSize);
            if (!isCorrectSize)
                  throw apiResponse.sendError(
                        {
                              details: { avatar: { type: 'field.file-too-big', context: { size: String(config.userController.avatarLimitSize) } } },
                        },
                        'BadRequestException',
                  );

            //checking extension
            const isCorrectFileExtension = this.awsService.checkFileExtension(file, config.userController.avatarAllowExtension);
            if (!isCorrectFileExtension)
                  throw apiResponse.sendError({ details: { avatar: { type: 'field.file-wrong-extension' } } }, 'BadRequestException');

            //upload file to aws
            const fileLocation = await this.awsService.uploadFile(file, String(req.user.id), 'user');
            if (!fileLocation)
                  throw apiResponse.sendError({ details: { errorMessage: { type: 'error.some-wrong' } } }, 'InternalServerErrorException');

            //update user information
            const user = await this.userService.findOneUserByField('id', req.user.id);
            user.avatarUrl = fileLocation;
            await this.userService.saveUser(user);

            return apiResponse.send<void>({ details: { message: { type: 'message.update-success' } } });
      }

      @Put('/password')
      @UseGuards(UserGuard)
      async cUpdatePasswordByUser(@Body(new JoiValidatorPipe(vChangePasswordDTO)) body: ChangePasswordDTO, @Req() req: Request) {
            //checking old password is correct
            const user = await this.userService.findOneUserByField('username', req.user.username);
            const isCorrectPassword = await this.authService.decryptString(body.currentPassword, user.password);
            if (!isCorrectPassword)
                  throw apiResponse.sendError({ details: { currentPassword: { type: 'field.not-correct' } } }, 'BadRequestException');

            //update user
            user.password = await this.authService.encryptString(body.newPassword);
            await this.userService.saveUser(user);

            return apiResponse.send<void>({ details: { message: { type: 'message.update-success' } } });
      }

      @Put('/reset-password')
      async cUpdatePasswordByOtp(@Query('key') key: string, @Body(new JoiValidatorPipe(vResetPasswordDTO)) body: ResetPasswordDTO) {
            //checking otp key
            if (!key) throw apiResponse.sendError({ details: { otp: { type: 'error.not-allow-action' } } }, 'ForbiddenException');

            //checking otp key is exist
            const redisUser = await this.redisService.getObjectByKey<User>(key);
            if (!redisUser) throw apiResponse.sendError({ details: { otp: { type: 'error.not-allow-action' } } }, 'ForbiddenException');

            //update user
            const user = await this.userService.findOneUserByField('username', redisUser.username);
            user.password = await this.authService.encryptString(body.newPassword);
            await this.userService.saveUser(user);
            this.redisService.deleteByKey(key);

            return apiResponse.send<void>({ details: { message: { type: 'message.update-success' } } });
      }

      @Put('/update-with-otp')
      async cUpdateEmailByOTP(@Query('key') key: string) {
            //checking otp key
            if (!key) throw apiResponse.sendError({ details: { otp: { type: 'error.not-allow-action' } } }, 'ForbiddenException');

            //checking otp key is exist
            const redisUser = await this.redisService.getObjectByKey<User>(key);
            if (!redisUser) throw apiResponse.sendError({ details: { otp: { type: 'error.not-allow-action' } } }, 'ForbiddenException');

            //update user
            const user = await this.userService.findOneUserByField('id', redisUser.id);
            if (user.email !== redisUser.email) {
                  user.email = redisUser.email;
            } else if (user.phoneNumber !== redisUser.phoneNumber) {
                  user.phoneNumber = redisUser.phoneNumber;
            }

            await this.userService.saveUser(user);
            this.redisService.deleteByKey(key);

            return apiResponse.send<void>({ details: { message: { type: 'message.update-success' } } });
      }

      //-----------------------------------Create-OTP--WITH GUARD-------------------------------
      @Post('/otp-sms')
      @UseGuards(UserGuard)
      @UsePipes(new JoiValidatorPipe(vOtpSmsDTO))
      async cCreateOTPBySmsWithGuard(@Body() body: OtpSmsDTO, @Req() req: Request) {
            //checking amount of time which user request before by ip
            const userIp = this.authService.parseIp(req);
            let canSendMore = await this.authService.isRateLimitKey(
                  userIp,
                  config.userController.OTPPhoneBlockTime * 2,
                  config.userController.OTPPhoneLimitTime,
            );
            if (!canSendMore)
                  throw apiResponse.sendError(
                        { details: { phoneNumber: { type: 'error.request-many-time', context: { time: '60' } } } },
                        'BadRequestException',
                  );

            //checking phone is exist
            const user = await this.userService.findOneUserByField('phoneNumber', body.phoneNumber);
            if (user) throw apiResponse.sendError({ details: { phoneNumber: { type: 'field.field-taken' } } }, 'BadRequestException');

            //checking amount of time which user request before by phone
            const updateUser = await this.userService.findOneUserByField('id', req.user.id);
            updateUser.phoneNumber = body.phoneNumber;
            canSendMore = await this.authService.isRateLimitKey(
                  updateUser.phoneNumber,
                  config.userController.OTPPhoneBlockTime,
                  config.userController.OTPPhoneLimitTime,
            );
            if (!canSendMore)
                  throw apiResponse.sendError(
                        { details: { phoneNumber: { type: 'error.request-many-time', context: { time: '60' } } } },
                        'BadRequestException',
                  );

            //generate otp
            const otpKey = this.authService.createOTP(updateUser, config.userController.OTPPhoneValidTime, 'sms');
            const res = await this.smsService.sendOTP(updateUser.phoneNumber, otpKey);
            if (!res) throw apiResponse.sendError({ details: { errorMessage: { type: 'error.some-wrong' } } }, 'InternalServerErrorException');

            return apiResponse.send({ details: { message: { type: 'message.send-phone-otp' } } });
      }

      @Post('/otp-email')
      @UseGuards(UserGuard)
      @UsePipes(new JoiValidatorPipe(vUpdateEmailDTO))
      async cCreateOtpByEmailWithGuard(@Body() body: UpdateEmailDTO, @Req() req: Request) {
            //checking amount of time which user request before by ip
            const userIp = this.authService.parseIp(req);
            let canSendMore = await this.authService.isRateLimitKey(
                  userIp,
                  config.userController.OTPMailBlockTime * 2,
                  config.userController.OTPMailLimitTime,
            );
            if (!canSendMore)
                  throw apiResponse.sendError(
                        { details: { email: { type: 'error.request-many-time', context: { time: '30' } } } },
                        'BadRequestException',
                  );

            //checking email is exist
            const user = await this.userService.findOneUserByField('email', body.email);
            if (user) throw apiResponse.sendError({ details: { email: { type: 'field.field-taken' } } }, 'BadRequestException');

            const updateUser = req.user;
            updateUser.email = body.email;

            //checking amount of time which user request before by email
            canSendMore = await this.authService.isRateLimitKey(
                  updateUser.email,
                  config.userController.OTPMailBlockTime,
                  config.userController.OTPMailLimitTime,
            );
            if (!canSendMore)
                  throw apiResponse.sendError(
                        { details: { email: { type: 'error.request-many-time', context: { time: '30' } } } },
                        'BadRequestException',
                  );

            //generate otp key
            const redisKey = await this.authService.createOTP(updateUser, config.userController.OTPMailValidTime, 'email');
            const isSent = await this.smailService.sendOTPForUpdateEmail(updateUser.email, redisKey);
            if (!isSent) throw apiResponse.sendError({ details: { errorMessage: { type: 'error.some-wrong' } } }, 'InternalServerErrorException');

            return apiResponse.send({ details: { message: { type: 'message.send-email' } } });
      }
}
