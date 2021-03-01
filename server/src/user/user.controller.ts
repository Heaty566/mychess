import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';

@Controller('user')
export class UserController {
      constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

      @Get('/')
      @UseGuards(AuthGuard)
      async getUser(@Req() req: Request) {
            console.log(req.user);
            // const user = await this.userService.getOneUserByField('_id', req.user._id);
            // return user;
      }
}
