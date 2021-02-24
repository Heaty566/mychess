import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { Post } from '@nestjs/common';
import { SmailService } from '../smail/smail.service';

@Controller('user')
export class UserController {
      constructor(private readonly userService: UserService, private readonly smailService: SmailService) {}

      @Post('/ee')
      async loginUser() {
            this.smailService['sendMail']('heaty566@gmail.com', 'hello');
      }
}
