import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

import { apiResponse } from '../app/interface/ApiResponse';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
      constructor(private authService: AuthService) {}

      async canActivate(context: ExecutionContext) {
            const req: Request = context.switchToHttp().getRequest();
            const res: Response = context.switchToHttp().getResponse();

            // get refreshToken and authToken

            const refreshToken = req.cookies['re-token'] || '';
            const authToken = req.cookies['auth-token'] || '';

            if (!refreshToken) throw apiResponse.sendError({ body: { message: 'Invalid token' }, type: 'UnauthorizedException' });
            if (authToken) {
                  const user = await this.authService.getDataFromAuthToken(authToken);
                  if (!user) throw apiResponse.sendError({ body: { message: 'Invalid token' }, type: 'UnauthorizedException' });

                  req.user = user;
            } else {
                  const authTokenId = await this.authService.getAuthTokenFromReToken(refreshToken);
                  if (!authTokenId) throw apiResponse.sendError({ body: { message: 'Invalid token' }, type: 'UnauthorizedException' });
                  res.cookie('auth-token', authTokenId, { maxAge: 1000 * 60 * 5 });

                  req.user = await this.authService.getDataFromAuthToken(authTokenId);
            }

            return true;
      }
}
