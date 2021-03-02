import { Body, Controller, Get, Post, Req, Res, UseGuards, UsePipes } from '@nestjs/common';
import { Response, Request } from 'express';
import { apiResponse } from '../app/interface/ApiResponse';
import { RegisterUserDTO, vRegisterUserDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { JoiValidatorPipe } from '../utils/validator/validator.pipe';
import { LoginUserDTO, vLoginUserDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
      constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

      @Get('/google')
      @UseGuards(AuthGuard('google'))
      googleAuth() {
            //
      }

      @Get('/google/callback')
      @UseGuards(AuthGuard('google'))
      async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
            const refreshToken = await this.authService.createReToken(req.user);
            return res.cookie('re-token', refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 30 }).redirect(process.env.CLIENT_URL);
      }

      @Get('/facebook')
      @UseGuards(AuthGuard('facebook'))
      facebookAuth() {
            //
      }

      @Get('/facebook/callback')
      @UseGuards(AuthGuard('facebook'))
      async facebookAuthRedirect(@Req() req: Request, @Res() res: Response) {
            const refreshToken = await this.authService.createReToken(req.user);
            return res.cookie('re-token', refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 30 }).redirect(process.env.CLIENT_URL);
      }

      @Get('/github')
      @UseGuards(AuthGuard('github'))
      async githubAuth() {
            //
      }

      @Get('/github/callback')
      @UseGuards(AuthGuard('github'))
      async githubAuthRedirect(@Req() req: Request, @Res() res: Response) {
            const refreshToken = await this.authService.createReToken(req.user);
            return res.cookie('re-token', refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 30 }).redirect(process.env.CLIENT_URL);
      }

      @Post('/register')
      @UsePipes(new JoiValidatorPipe(vRegisterUserDto))
      async registerUser(@Body() body: RegisterUserDTO, @Res() res: Response) {
            const user = await this.userService.findOneUserByField('username', body.username);
            if (user) throw apiResponse.sendError({ body: { details: { username: 'Username is already exist' } } });

            const newUser = new User();
            newUser.username = body.username;
            newUser.name = body.name;
            newUser.password = await this.authService.hash(body.password);
            const insertedUser = await this.authService.registerUser(newUser);

            const refreshToken = await this.authService.createReToken(insertedUser);
            return res.cookie('re-token', refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 30 }).send({ message: 'Register success' });
      }

      @Post('/login')
      @UsePipes(new JoiValidatorPipe(vLoginUserDto))
      async loginUser(@Body() body: LoginUserDTO, @Res() res: Response) {
            const user = await this.userService.findOneUserByField('username', body.username);
            if (!user) throw apiResponse.sendError({ body: { details: { username: 'Username or password is not correct' } } });

            const isCorrect = await this.authService.comparePassword(body.password, user.password);
            if (!isCorrect) throw apiResponse.sendError({ body: { details: { username: 'Username or password is not correct' } } });

            const refreshToken = await this.authService.createReToken(user);
            return res.cookie('re-token', refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 30 }).send({ message: 'Login success' });
      }
}
