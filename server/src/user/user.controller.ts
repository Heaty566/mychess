import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { MyAuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { apiResponse } from '../app/interface/ApiResponse';
import User from './entities/user.entity';

@Controller('user')
export class UserController {
      constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

      @Get('/')
      @UseGuards(MyAuthGuard)
      async getUser(@Req() req: Request) {
            const user = await this.userService.getOneUserByField('_id', req.user._id);

            return apiResponse.send<User>({ body: { data: user } });
      }
}
