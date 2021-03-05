import { Controller, Get, UseGuards, Req, Param, Body, Put, UsePipes } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { MyAuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { apiResponse } from '../app/interface/ApiResponse';
import User from './entities/user.entity';
import { RedisService } from '../utils/redis/redis.service';
import { JoiValidatorPipe } from '../utils/validator/validator.pipe';
import { ChangePasswordDTO, vChangePasswordDTO } from './dto/changePassword.dto';
import { UpdateUserDto, vUpdateUserDto } from './dto/updateUser.dto';

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

      @Put('/')
      @UseGuards(MyAuthGuard)
      async updateUser(@Req() req: Request, @Body(new JoiValidatorPipe(vUpdateUserDto)) body: UpdateUserDto) {
            const user = await this.userService.findOneUserByField('_id', req.user._id);
            user.name = body.name;
            await this.authService.saveUser(user);

            return apiResponse.send<void>({ body: { message: 'update user success' } });
      }
}
