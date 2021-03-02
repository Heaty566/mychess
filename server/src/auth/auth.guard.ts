import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

import { apiResponse } from '../app/interface/ApiResponse';
import { AuthService } from './auth.service';

@Injectable()
export class MyAuthGuard implements CanActivate {
      constructor(private authService: AuthService) {}

      private async updateAuthToken(res: Response, reToken: string) {
            const authTokenId = await this.authService.getAuthTokenFromReToken(reToken);
            if (!authTokenId) {
                  res.cookie('auth-token', '', { maxAge: 0 });
                  res.cookie('re-token', '', { maxAge: 0 });
                  throw apiResponse.sendError({ body: { message: 'Invalid token' }, type: 'UnauthorizedException' });
            }
            res.cookie('auth-token', authTokenId, { maxAge: 1000 * 60 * 5 });
            return await this.authService.getDataFromAuthToken(authTokenId);
      }

      async canActivate(context: ExecutionContext) {
            const req: Request = context.switchToHttp().getRequest();
            const res: Response = context.switchToHttp().getResponse();

            // get refreshToken and authToken

            const refreshToken = req.cookies['re-token'] || '';
            const authToken = req.cookies['auth-token'] || '';

            if (!refreshToken) {
                  res.cookie('re-token', '', { maxAge: 0 });
                  throw apiResponse.sendError({ body: { message: 'Invalid token' }, type: 'UnauthorizedException' });
            }
            if (authToken) {
                  const user = await this.authService.getDataFromAuthToken(authToken);
                  if (!user) {
                        req.user = await this.updateAuthToken(res, refreshToken);
                        return true;
                  }
                  req.user = user;
            } else req.user = await this.updateAuthToken(res, refreshToken);

            return true;
      }
}
