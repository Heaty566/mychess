import { Controller, Get, UseGuards, Req, Param, Body, Put } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { MyAuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { apiResponse } from '../app/interface/ApiResponse';
import User from './entities/user.entity';
import { RedisService } from '../utils/redis/redis.service';
import { JoiValidatorPipe } from '../utils/validator/validator.pipe';
import { ChangePasswordDTO, vChangePasswordDTO } from './dto/changePassword.dto';

@Controller('user')
export class UserController {
      constructor(
            private readonly userService: UserService,
            private readonly authService: AuthService,
            private readonly redisService: RedisService,
      ) {}

      @Get('/')
      @UseGuards(MyAuthGuard)
      async getUser(@Req() req: Request) {
            const user = await this.userService.getOneUserByField('_id', req.user._id);

            return apiResponse.send<User>({ body: { data: user } });
      }
<<<<<<< HEAD
=======

      @Put('/reset-password/:otp')
      async resetPassword(@Param('otp') otp: string, @Body(new JoiValidatorPipe(vChangePasswordDTO)) body: ChangePasswordDTO) {
            const redisUser = await this.redisService.getObjectByKey<User>(otp);
            if (!redisUser) throw apiResponse.sendError({ type: 'ForbiddenException', body: { message: 'action is not allowed' } });

            const user = await this.userService.findOneUserByField('email', redisUser.email);
            user.password = await this.authService.hash(body.newPassword);
            await this.authService.saveUser(user);
            this.redisService.deleteByKey(otp);

            return apiResponse.send<void>({ body: { message: 'update user success' } });
      }
>>>>>>> 18f53829d84e8443c87d62a0360aa51f87899bb4
}
