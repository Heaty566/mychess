import { Body, Controller, Get, Post, Req, Res, UseGuards, UsePipes } from '@nestjs/common';
import { Response, Request } from 'express';
import { apiResponse } from '../app/interface/ApiResponse';
import { RegisterUserDTO, vRegisterUserDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { JoiValidatorPipe } from '../utils/validator/validator.pipe';
import { LoginUserDTO, vLoginUserDto } from './dto/login.dto';
import { AuthToken } from './entities/authToken.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
      constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

      // GOOGLE
      @Get('/google')
      @UseGuards(AuthGuard('google'))
      googleAuth() {}

      @Get('/google/callback')
      @UseGuards(AuthGuard('google'))
      async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
            let authToken = new AuthToken();
            authToken.data = this.authService.createToken({ user: req.user });

            authToken = await this.authService.saveAuthToken(authToken);

            const refreshToken = this.authService.createToken({
                  authTokenId: authToken._id,
            });
            return res.cookie('refresh-token', refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 30 }).redirect(process.env.CLIENT_URL);
      }

      // FACEBOOK
      @Get('/facebook')
      @UseGuards(AuthGuard('facebook'))
      facebookAuth() {}

      @Get('/facebook/callback')
      @UseGuards(AuthGuard('facebook'))
      async facebookAuthRedirect(@Req() req: Request, @Res() res: Response) {
            let authToken = new AuthToken();
            authToken.data = this.authService.createToken({ user: req.user });

            authToken = await this.authService.saveAuthToken(authToken);

            const refreshToken = this.authService.createToken({
                  authTokenId: authToken._id,
            });
            return res.cookie('refresh-token', refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 30 }).redirect(process.env.CLIENT_URL);
      }

      // GITHUB
      @Get('/github')
      @UseGuards(AuthGuard('github'))
      async githubAuth() {}

      @Get('/github/callback')
      @UseGuards(AuthGuard('github'))
      async githubAuthRedirect(@Req() req: Request, @Res() res: Response) {
            let authToken = new AuthToken();
            authToken.data = this.authService.createToken({ user: req.user });

            authToken = await this.authService.saveAuthToken(authToken);

            const refreshToken = this.authService.createToken({
                  authTokenId: authToken._id,
            });
            return res.cookie('refresh-token', refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 30 }).redirect(process.env.CLIENT_URL);
      }

      @Post('/register')
      @UsePipes(new JoiValidatorPipe(vRegisterUserDto))
      async registerUser(@Body() body: RegisterUserDTO, @Res() res: Response) {
            const user = await this.userService.findOneUserByField('username', body.username);
            if (user) throw apiResponse.sendError({ details: { username: 'Username is already exist.' } }, 'BadRequestException');

            const newUser = new User();
            newUser.username = body.username;
            newUser.name = body.name;
            newUser.password = await this.authService.hash(body.password);

            const insertedUser = this.authService.registerUser(newUser);

            let authToken = new AuthToken();
            authToken.data = this.authService.createToken({ user: insertedUser });

            authToken = await this.authService.saveAuthToken(authToken);

            const refreshToken = this.authService.createToken({
                  authTokenId: authToken._id,
            });

            return res.cookie('refresh-token', refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 30 }).send({ message: 'Register success' });
      }

      @Post('/login')
      @UsePipes(new JoiValidatorPipe(vLoginUserDto))
      async loginUser(@Body() body: LoginUserDTO, @Res() res: Response) {
            const user = await this.userService.findOneUserByField('username', body.username);
            if (!user) throw apiResponse.sendError({ details: { username: 'Username or password is not correct.' } }, 'BadRequestException');

            const isCorrect = await this.authService.comparePassword(body.password, user.password);
            if (!isCorrect) throw apiResponse.sendError({ details: { password: 'Username or password is not correct.' } }, 'BadRequestException');

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
