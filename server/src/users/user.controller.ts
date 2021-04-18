import { Controller, Get, UseGuards, Req, Param, Body, Put, Post, UsePipes, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

//---- Service
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { SmailService } from '../providers/smail/smail.service';
import { SmsService } from '../providers/sms/sms.service';
import { AwsService } from '../providers/aws/aws.service';
import { RedisService } from '../providers/redis/redis.service';

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
import { apiResponse } from '../app/interface/ApiResponse';

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
            const user = await this.userService.findOneUserWithoutSomeSensitiveFields('id', req.user.id);

            return apiResponse.send<UserCustomDTO>({ body: { data: user } });
      }

      @Get('/search')
      async cSearchUsers(@Query() queries: SearchUsersDTO) {
            const { value } = <{ value: SearchUsersDTO }>vSearchUsersDTO.validate(queries, { convert: true, stripUnknown: true });

            const users = await this.userService.searchUsersByName(value.name, value.pageSize, value.currentPage);
            return apiResponse.send<Array<User>>({ body: { data: users } });
      }

      @Get('/:id')
      async cGetUserById(@Param('id') id: string) {
            const user = await this.userService.findOneUserWithoutSomeSensitiveFields('id', id);

            if (!user)
                  throw apiResponse.sendError({
                        body: { message: { type: 'user.invalid-input' } },
                        type: 'BadRequestException',
                  });

            return apiResponse.send<UserCustomDTO>({ body: { data: user } });
      }

      //------------------Update user information------------------------------------------
      @Put('/')
      @UseGuards(UserGuard)
      async cUpdateUserBasicInformation(@Req() req: Request, @Body(new JoiValidatorPipe(vUpdateUserDto)) body: UpdateUserDto) {
            const user = await this.userService.findOneUserByField('id', req.user.id);
            user.name = body.name;
            await this.userService.saveUser(user);

            return apiResponse.send<void>({
                  body: { message: { type: 'user.update-success' } },
            });
      }

      @Put('/avatar')
      @UseGuards(UserGuard)
      @UseInterceptors(FileInterceptor('avatar'))
      async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
            if (!file)
                  throw apiResponse.sendError({
                        body: { details: { avatar: { type: 'any.required' } } },
                  });

            const isCorrectSize = this.awsService.checkFileSize(file, 1);
            if (!isCorrectSize)
                  throw apiResponse.sendError({
                        body: { details: { avatar: { type: 'aws.file-too-big', context: { size: '1' } } } },
                  });

            const isCorrectFileExtension = this.awsService.checkFileExtension(file);
            if (!isCorrectFileExtension)
                  throw apiResponse.sendError({
                        body: { details: { avatar: { type: 'aws.file-wrong-extension' } } },
                  });

            const fileLocation = await this.awsService.uploadFile(file, String(req.user.id), 'user');
            if (!fileLocation)
                  throw apiResponse.sendError({
                        body: { message: { type: 'server.some-wrong' } },
                        type: 'InternalServerErrorException',
                  });

            const user = await this.userService.findOneUserByField('id', req.user.id);
            user.avatarUrl = fileLocation;
            await this.userService.saveUser(user);

            return apiResponse.send<void>({
                  body: { message: { type: 'user.update-success' } },
            });
      }

      @Put('/password')
      @UseGuards(UserGuard)
      async cUpdatePasswordByUser(@Body(new JoiValidatorPipe(vChangePasswordDTO)) body: ChangePasswordDTO, @Req() req: Request) {
            const user = await this.userService.findOneUserByField('username', req.user.username);
            const isCorrectPassword = await this.authService.decryptString(body.currentPassword, user.password);
            if (!isCorrectPassword)
                  throw apiResponse.sendError({
                        body: { details: { username: { type: 'user.auth-failed' } } },
                  });

            user.password = await this.authService.encryptString(body.newPassword);
            await this.userService.saveUser(user);

            return apiResponse.send<void>({
                  body: { message: { type: 'user.update-success' } },
            });
      }

      @Put('/reset-password')
      async cUpdatePasswordByOtp(@Query('key') key: string, @Body(new JoiValidatorPipe(vResetPasswordDTO)) body: ResetPasswordDTO) {
            if (!key)
                  throw apiResponse.sendError({
                        type: 'ForbiddenException',
                        body: { details: { otp: { type: 'user.not-allow-action' } } },
                  });

            const redisUser = await this.redisService.getObjectByKey<User>(key);
            if (!redisUser)
                  throw apiResponse.sendError({
                        type: 'ForbiddenException',
                        body: { details: { otp: { type: 'user.not-allow-action' } } },
                  });
            const user = await this.userService.findOneUserByField('username', redisUser.username);

            user.password = await this.authService.encryptString(body.newPassword);
            await this.userService.saveUser(user);
            this.redisService.deleteByKey(key);

            return apiResponse.send<void>({
                  body: { message: { type: 'user.update-success' } },
            });
      }

      @Put('/update-with-otp')
      async cUpdateEmailByOTP(@Query('key') key: string) {
            if (!key)
                  throw apiResponse.sendError({
                        type: 'ForbiddenException',
                        body: { details: { otp: { type: 'user.not-allow-action' } } },
                  });

            const redisUser = await this.redisService.getObjectByKey<User>(key);
            if (!redisUser)
                  throw apiResponse.sendError({
                        type: 'ForbiddenException',
                        body: { details: { otp: { type: 'user.not-allow-action' } } },
                  });

            const user = await this.userService.findOneUserByField('id', redisUser.id);

            if (user.email !== redisUser.email) {
                  user.email = redisUser.email;
            } else if (user.phoneNumber !== redisUser.phoneNumber) {
                  user.phoneNumber = redisUser.phoneNumber;
            }

            await this.userService.saveUser(user);
            this.redisService.deleteByKey(key);

            return apiResponse.send<void>({
                  body: { message: { type: 'user.update-success' } },
            });
      }

      //-----------------------------------Create-OTP--WITH GUARD-------------------------------
      @Post('/otp-sms')
      @UseGuards(UserGuard)
      @UsePipes(new JoiValidatorPipe(vOtpSmsDTO))
      async cCreateOTPBySmsWithGuard(@Body() body: OtpSmsDTO, @Req() req: Request) {
            const userIp = this.authService.parseIp(req);
            let canSendMore = await this.authService.isRateLimitKey(userIp, 6, 60);
            if (!canSendMore)
                  throw apiResponse.sendError({
                        body: { details: { email: { type: 'user.request-many-time-60p' } } },
                  });

            let user = await this.userService.findOneUserByField('phoneNumber', body.phoneNumber);
            if (user)
                  throw apiResponse.sendError({
                        body: { details: { phoneNumber: { type: 'user.field-taken' } } },
                  });

            user = await this.userService.findOneUserByField('id', req.user.id);
            user.phoneNumber = body.phoneNumber;

            canSendMore = await this.authService.isRateLimitKey(user.phoneNumber, 3, 60);
            if (!canSendMore)
                  throw apiResponse.sendError({
                        body: {
                              details: { phoneNumber: { type: 'user.request-many-time-60p' } },
                        },
                  });

            const otpKey = this.authService.generateOTP(user, 10, 'sms');
            const res = await this.smsService.sendOTP(user.phoneNumber, otpKey);
            if (!res)
                  throw apiResponse.sendError({
                        body: { message: { type: 'server.some-wrong' } },
                        type: 'InternalServerErrorException',
                  });

            return apiResponse.send({
                  body: { message: { type: 'server.send-phone-otp' } },
            });
      }

      @Post('/otp-email')
      @UseGuards(UserGuard)
      @UsePipes(new JoiValidatorPipe(vUpdateEmailDTO))
      async cCreateOtpByEmailWithGuard(@Body() body: UpdateEmailDTO, @Req() req: Request) {
            const userIp = this.authService.parseIp(req);
            let canSendMore = await this.authService.isRateLimitKey(userIp, 10, 60);
            if (!canSendMore)
                  throw apiResponse.sendError({
                        body: { details: { email: { type: 'user.request-many-time-60p' } } },
                  });

            let user = await this.userService.findOneUserByField('email', body.email);
            if (user)
                  throw apiResponse.sendError({
                        body: { details: { email: { type: 'user.field-taken' } } },
                  });

            user = req.user;
            user.email = body.email;

            canSendMore = await this.authService.isRateLimitKey(user.email, 5, 30);
            if (!canSendMore)
                  throw apiResponse.sendError({
                        body: { details: { email: { type: 'user.request-many-time-30p' } } },
                  });

            const redisKey = await this.authService.generateOTP(user, 30, 'email');
            const isSent = await this.smailService.sendOTPForUpdateEmail(user.email, redisKey);
            if (!isSent)
                  throw apiResponse.sendError({
                        body: { details: { email: { type: 'server.some-wrong' } } },
                        type: 'InternalServerErrorException',
                  });

            return apiResponse.send({
                  body: { message: { type: 'server.send-email-otp' } },
            });
      }
}
