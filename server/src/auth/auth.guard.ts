import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { User } from '../user/entities/user.entity';
import { ErrorResponse } from '../app/interface/ErrorResponse';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
      constructor(private authService: AuthService) {}

      async canActivate(context: ExecutionContext) {
            const req: Request = context.switchToHttp().getRequest();
            const res: Response = context.switchToHttp().getResponse();

            // get refreshToken and authToken
            const refreshToken = req.cookies['refresh-token'] || '';
            let authToken = req.cookies['auth-token'] || '';

            if (!refreshToken) throw ErrorResponse.send({ message: 'Invalid token' }, 'UnauthorizedException');

            let token = await this.authService.getDataFromAuthToken(authToken);

            if (!token) {
                  token = await this.authService.getDataFromRefreshToken(refreshToken);
                  if (!token) throw ErrorResponse.send({ message: 'Invalid token' }, 'UnauthorizedException');

                  authToken = String(token._id);
                  res.cookie('auth-token', authToken, { maxAge: 1000 * 60 * 5 });
            }

            const decode = this.authService.decodeToken(token.data) as User;

            req[`user`] = decode;
            return true;
      }
}
