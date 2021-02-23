import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common';
import { Response } from "express"
import { ErrorResponse } from '../app/interface/ErrorResponse';
import { ApiResponse } from '../app/interface/ApiResponse';
import { RegisterUserDTO, vRegisterUserDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { JoiValidatorPipe } from '../app/validator/validator.pipe';
import { LoginUserDTO, vLoginUserDto } from './dto/login.dto';
import { AuthToken } from './entities/authToken.entity';
import { RefreshToken } from './entities/refreshToken.entity';


@Controller('auth')
export class AuthController {
      constructor(private readonly authService: AuthService, private readonly userService: UserService) { }

      @Post('/register')
      @UsePipes(new JoiValidatorPipe(vRegisterUserDto))
      async registerUser(@Body() body: RegisterUserDTO): Promise<ApiResponse<void>> {
            const user = await this.userService.findOneUserByField('username', body.username);
            if (user) throw ErrorResponse.send({ details: { username: 'Username is already exist.' } }, 'BadRequestException');


            const newUser = new User();
            newUser.username = body.username;
            newUser.name = body.name;
            newUser.password = body.password;

            await this.authService.registerUser(newUser);
            return { message: 'Register success' };
      }

      @Post('/login')
      @UsePipes(new JoiValidatorPipe(vLoginUserDto))
      async loginUser(@Body() body: LoginUserDTO, @Res() res: Response) {
            const user = await this.userService.findOneUserByField("username", body.username);
            if (!user) throw ErrorResponse.send({ details: { username: 'Username or password is not correct.' } }, "BadRequestException");

            // Where hashing???
            if (user.password !== body.password) throw ErrorResponse.send({ details: { password: 'Username or password is not correct.' } }, "BadRequestException");

            // authToken contain:  _id, jwt string(user ==> jwt string)
            let authToken = new AuthToken();
            authToken.data = this.authService.createToken({ user });

            // save authToken to db
            authToken = await this.authService.saveAuthToken(authToken);

            // refreshToken contain _id of authToken, create time, expired time
            let refreshToken = new RefreshToken();
            refreshToken.data = this.authService.createToken({
                  authTokenId: authToken._id
            })

            // save refreshToken to db
            await this.authService.saveRefreshToken(refreshToken);
            console.log(refreshToken.data);
            res.cookie("refresh-token", refreshToken.data).send({});


            // tao refeshToken gom id, createTime, expiredTime
            // gui refeshToken cho user


            // const token = sign(
            //       {
            //             userId: user._id
            //       }, process.env.JWT_SECRET_KEY);


            //return res.cookie("name", token).send();

      }
}
