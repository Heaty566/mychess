import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponse } from '../app/interface/ErrorResponse';
import { RegisterUserDTO, vRegisterUserDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { JoiValidatorPipe } from '../app/validator/validator.pipe';
import { LoginUserDTO, vLoginUserDto } from './dto/login.dto';
import { AuthToken } from './entities/authToken.entity';

@Controller('auth')
export class AuthController {
      constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

      @Post('/register')
      @UsePipes(new JoiValidatorPipe(vRegisterUserDto))
      async registerUser(@Body() body: RegisterUserDTO) {
            const user = await this.userService.findOneUserByField('username', body.username);
            if (user) throw ErrorResponse.send({ details: { username: 'Username is already exist.' } }, 'BadRequestException');

            const newUser = new User();
            newUser.username = body.username;
            newUser.name = body.name;
            newUser.password = await this.authService.hash(body.password);

            await this.authService.registerUser(newUser);
            return { message: 'Register success' };
      }

      @Post('/login')
      @UsePipes(new JoiValidatorPipe(vLoginUserDto))
      async loginUser(@Body() body: LoginUserDTO, @Res() res: Response) {
            const user = await this.userService.findOneUserByField('username', body.username);
            if (!user) throw ErrorResponse.send({ details: { username: 'Username or password is not correct.' } }, 'BadRequestException');

            const isCorrect = await this.authService.comparePassword(body.password, user.password);
            if (!isCorrect) throw ErrorResponse.send({ details: { password: 'Username or password is not correct.' } }, 'BadRequestException');

            // Generate token
            let authToken = new AuthToken();
            authToken.data = this.authService.createToken({ user });

            authToken = await this.authService.saveAuthToken(authToken);

            const refreshToken = this.authService.createToken({
                  authTokenId: authToken._id,
            });

            return res.cookie('refresh-token', refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 30 }).send({ message: 'Login success' });
      }
}
