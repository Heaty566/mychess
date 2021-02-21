import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ErrorResponse } from '../app/interface/ErrorResponse';
import { ApiResponse } from '../app/interface/ApiResponse';
import { RegisterUserDTO, vRegisterUserDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { JoiValidatorPipe } from '../app/validator/validator.pipe';

@Controller('auth')
export class AuthController {
      constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

      @Post('/register')
      @UsePipes(new JoiValidatorPipe(vRegisterUserDto))
      async registerUser(@Body() body: RegisterUserDTO): Promise<ApiResponse<void>> {
            const user = await this.userService.findOneUserByField('username', body.username);
            if (user) throw ErrorResponse.send({ details: { username: 'Username or Password is not correct.' } }, 'BadRequestException');
            if (body.password !== body.confirmPassword)
                  throw ErrorResponse.send({ details: { confirmPassword: 'Confirm Password is not match.' } }, 'BadRequestException');

            const newUser = new User();
            newUser.username = body.username;
            newUser.name = body.name;
            newUser.password = body.password;

            await this.authService.registerUser(newUser);
            return { message: 'Register success' };
      }
}
