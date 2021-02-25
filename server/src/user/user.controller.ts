import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { Post } from '@nestjs/common';
import { SmailService } from '../providers/smail/smail.service';
import { SmsService } from '../providers/sms/sms.service';

@Controller('user')
export class UserController {
      constructor(private readonly userService: UserService) {}
}
