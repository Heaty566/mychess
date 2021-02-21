import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDTO } from './dto/register.dto';

@Controller('auth')
export class AuthController {
      constructor(private readonly authService: AuthService) {}

      @Post('register')
      async register(@Body() body: RegisterUserDTO) {
            return await this.authService.createUser(body);
      }
}
