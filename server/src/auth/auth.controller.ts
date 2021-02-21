import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { RegisterUserDTO } from 'src/user/dto/register.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) { }

  @Post("/register")
  async registerUser(@Body() body: RegisterUserDTO) {
    const user = await this.authService.findOneUserByField("username", body.username);

    if (user) throw new BadRequestException("Username or Password is not correct.");

    if (body.password !== body.confirmPassword) throw new BadRequestException("Password is not match.");

    await this.authService.registerUser(body);
    return "Register success";
  }
}
