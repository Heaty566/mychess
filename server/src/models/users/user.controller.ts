import { Controller, Get, UseGuards, Req, Param, Body, Put, Post, UsePipes, UseInterceptors, UploadedFile } from '@nestjs/common';
import { Request } from 'express';

import { SmailService } from '../../providers/smail/smail.service';
import { AuthService } from '../../auth/auth.service';
import { UserService } from './user.service';
import { RedisService } from '../../providers/redis/redis.service';
import { SmsService } from '../../providers/sms/sms.service';
import { AwsService } from '../../providers/aws/aws.service';
import { RoomService } from '../rooms/room.service';

import { JoiValidatorPipe } from '../../utils/validator/validator.pipe';
import { MyAuthGuard } from '../../auth/auth.guard';
import { apiResponse } from '../../app/interface/ApiResponse';
import { User } from './entities/user.entity';
import { Room } from '../rooms/entities/room.entity';

import { OtpSmsDTO, vOtpSmsDTO } from '../../auth/dto/otpSms.dto';
import { ChangePasswordDTO, vChangePasswordDTO } from './dto/changePassword.dto';
import { UpdateUserDto, vUpdateUserDto } from './dto/updateBasicUser.dto';
import { UpdateEmailDTO, vUpdateEmailDTO } from './dto/updateEmail.dto';
import { CreateNewRoomDTO, vCreateNewRoomDTO } from './dto/createNewRoom.dto';
import { JoinRoomDTO, vJoinRoomDTO } from './dto/joinRoom.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
      constructor(
            private readonly userService: UserService,
            private readonly roomService: RoomService,
            private readonly authService: AuthService,
            private readonly redisService: RedisService,
            private readonly smsService: SmsService,
            private readonly smailService: SmailService,
            private readonly awsService: AwsService,
      ) {}

      @Get('/')
      @UseGuards(MyAuthGuard)
      async cGetUser(@Req() req: Request) {
            const user = await this.userService.getOneUserByField('id', req.user.id);

            return apiResponse.send<User>({ body: { data: user } });
      }
      @Get('/:id')
      async cGetUserById() {
            return apiResponse.send<any>({
                  body: {
                        data: {
                              id: '2561d256-4cb4-47ed-b692-0a73e310cff6',
                              username: 'heaty566',
                              name: 'heaty566',
                              avatarUrl: '',
                              createDate: new Date(),
                              elo: 0,
                        },
                  },
            });
      }

      //------------------Update user information------------------------------------------
      @Put('/')
      @UseGuards(MyAuthGuard)
      async cUpdateUserBasicInformation(@Req() req: Request, @Body(new JoiValidatorPipe(vUpdateUserDto)) body: UpdateUserDto) {
            const user = await this.userService.findOneUserByField('id', req.user.id);
            user.name = body.name;
            await this.userService.saveUser(user);

            return apiResponse.send<void>({ body: { message: 'user.update-success' } });
      }

      @Put('/avatar')
      @UseGuards(MyAuthGuard)
      @UseInterceptors(FileInterceptor('avatar'))
      async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
            if (!file) throw apiResponse.sendError({ body: { details: { avatar: 'any.required' } } });

            const isCorrectSize = this.awsService.checkFileSize(file, 1);
            if (!isCorrectSize)
                  throw apiResponse.sendError({
                        body: { details: { avatar: 'aws.file-too-big' } },
                        context: { size: '1' },
                  });

            const isCorrectFileExtension = this.awsService.checkFileExtension(file);
            if (!isCorrectFileExtension)
                  throw apiResponse.sendError({
                        body: { details: { avatar: 'aws.file-wrong-extension' } },
                  });

            const fileLocation = await this.awsService.uploadFile(file, String(req.user.id), 'user');
            if (!fileLocation) throw apiResponse.sendError({ body: { message: 'server.some-wrong' }, type: 'InternalServerErrorException' });

            const user = await this.userService.getOneUserByField('id', req.user.id);
            user.avatarUrl = '/' + fileLocation;
            await this.userService.saveUser(user);

            return apiResponse.send<void>({ body: { message: 'user.update-success' } });
      }

      @Put('/password/:otp')
      async cUpdatePasswordByOtp(@Param('otp') otp: string, @Body(new JoiValidatorPipe(vChangePasswordDTO)) body: ChangePasswordDTO) {
            const redisUser = await this.redisService.getObjectByKey<User>(otp);
            if (!redisUser) throw apiResponse.sendError({ type: 'ForbiddenException', body: { message: 'user.not-allow-action' } });
            const user = await this.userService.findOneUserByField('username', redisUser.username);

            user.password = await this.authService.encryptString(body.newPassword);
            await this.userService.saveUser(user);
            this.redisService.deleteByKey(otp);

            return apiResponse.send<void>({ body: { message: 'user.update-success' } });
      }

      @Put('/email/:otp')
      @UseGuards(MyAuthGuard)
      async cUpdateEmailByOTP(@Param('otp') otp: string) {
            const redisUser = await this.redisService.getObjectByKey<User>(otp);
            if (!redisUser) throw apiResponse.sendError({ type: 'ForbiddenException', body: { message: 'user.not-allow-action' } });

            const user = await this.userService.findOneUserByField('username', redisUser.username);
            user.email = redisUser.email;

            await this.userService.saveUser(user);
            this.redisService.deleteByKey(otp);

            return apiResponse.send<void>({ body: { message: 'user.update-success' } });
      }

      @Put('/phone/:otp')
      @UseGuards(MyAuthGuard)
      async cUpdatePhoneByOTP(@Param('otp') otp: string) {
            const redisUser = await this.redisService.getObjectByKey<User>(otp);
            if (!redisUser) throw apiResponse.sendError({ type: 'ForbiddenException', body: { message: 'user.not-allow-action' } });

            const user = await this.userService.findOneUserByField('username', redisUser.username);
            user.phoneNumber = redisUser.phoneNumber;
            await this.userService.saveUser(user);
            this.redisService.deleteByKey(otp);
      }

      @Post('/check-top/:otp')
      async cCheckOTP(@Param('otp') otp: string) {
            const isExist = await this.redisService.getObjectByKey<User>(otp);
            if (!isExist) throw apiResponse.sendError({ type: 'ForbiddenException', body: { message: 'user.not-allow-action' } });

            return apiResponse.send<void>({ body: { message: 'server.success' } });
      }

      //-----------------------------------Create-OTP--WITH GUARD-------------------------------
      @Post('/otp-sms')
      @UseGuards(MyAuthGuard)
      @UsePipes(new JoiValidatorPipe(vOtpSmsDTO))
      async cCreateOTPBySmsWithGuard(@Body() body: OtpSmsDTO, @Req() req: Request) {
            let user = await this.userService.findOneUserByField('phoneNumber', body.phoneNumber);
            if (user) throw apiResponse.sendError({ body: { details: { phoneNumber: 'user.field-taken' } } });

            user = await this.userService.findOneUserByField('id', req.user.id);

            user.phoneNumber = body.phoneNumber;

            const otpKey = this.authService.generateOTP(user, 10, 'sms');
            const res = await this.smsService.sendOTP(user.phoneNumber, otpKey);
            if (!res) throw apiResponse.sendError({ body: { message: 'server.some-wrong' }, type: 'InternalServerErrorException' });

            return apiResponse.send({ body: { message: 'server.send-phone-otp' } });
      }

      @Post('/otp-email')
      @UseGuards(MyAuthGuard)
      @UsePipes(new JoiValidatorPipe(vUpdateEmailDTO))
      async cCreateOtpByEmailWithGuard(@Body() body: UpdateEmailDTO, @Req() req: Request) {
            let user = await this.userService.findOneUserByField('email', body.email);
            if (user) throw apiResponse.sendError({ body: { details: { email: 'user.field-taken' } } });

            user = req.user;
            user.email = body.email;

            const redisKey = await this.authService.generateOTP(user, 30, 'email');
            const isSent = await this.smailService.sendOTPForUpdateEmail(user.email, redisKey);
            if (!isSent)
                  throw apiResponse.sendError({
                        body: { details: { email: 'server.some-wrong' } },
                        type: 'InternalServerErrorException',
                  });

            return apiResponse.send({ body: { message: 'server.send-email-otp' } });
      }

      @Post('/new-room')
      @UseGuards(MyAuthGuard)
      @UsePipes(new JoiValidatorPipe(vCreateNewRoomDTO))
      async cCreateNewRoom(@Body() body: CreateNewRoomDTO, @Req() req: Request) {
            const user = req.user;

            let room = await this.roomService.getOneRoomByUserId(user.id);
            if (room) throw apiResponse.sendError({ body: { message: 'user.field-taken' } });

            room = new Room();
            room.limitTime = body.limitTime;
            room.user1 = user;

            await this.roomService.saveRoom(room);
            return apiResponse.send({ body: { message: 'socket.room.created' } });
      }

      @Post('/join-room')
      @UseGuards(MyAuthGuard)
      @UsePipes(new JoiValidatorPipe(vJoinRoomDTO))
      async cJoinRoom(@Body() body: JoinRoomDTO, @Req() req: Request) {
            const user = req.user;

            let room = await this.roomService.getOneRoomByUserId(user.id);

            if (room) throw apiResponse.sendError({ body: { details: { roomId: 'user.field-taken' } } });

            room = await this.roomService.getOneRoomByField('id', body.roomId);
            if (!room) throw apiResponse.sendError({ body: { details: { roomId: 'user.field.not-found' } } });

            room.user2 = user;
            await this.roomService.saveRoom(room);
            return apiResponse.send({ body: { message: 'socket.room.created' } });
      }
}
