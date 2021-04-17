import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { Reflector } from '@nestjs/core';

//---- Service
import { AuthService } from './auth.service';

//---- Entity
import { UserRole } from '../users/entities/user.userRole.enum';

//---- Common
import { apiResponse } from '../app/interface/ApiResponse';

@Injectable()
export class UserGuard implements CanActivate {
      constructor(private authService: AuthService, private readonly reflector: Reflector) {}

      private async deleteAllAuthToken(res: Response) {
            res.cookie('auth-token', '', { maxAge: 0 });
            res.cookie('re-token', '', { maxAge: 0 });
      }

      private async getAuthToken(res: Response, reToken: string) {
            const authTokenId = await this.authService.getAuthTokenByReToken(reToken);

            if (!authTokenId) {
                  this.deleteAllAuthToken(res);
                  throw apiResponse.sendError({ body: { message: 'user.invalid-token' }, type: 'UnauthorizedException' });
            }
            res.cookie('auth-token', authTokenId, { maxAge: 1000 * 60 * 5 });
            return await this.authService.getUserByAuthToken(authTokenId);
      }

      async canActivate(context: ExecutionContext) {
            const req: Request = context.switchToHttp().getRequest();
            const res: Response = context.switchToHttp().getResponse();
            const role = this.reflector.get<UserRole>('role', context.getHandler());

            // get refreshToken and authToken
            const refreshToken = req.cookies['re-token'] || '';
            const authToken = req.cookies['auth-token'] || '';

            if (!refreshToken) {
                  res.cookie('re-token', '', { maxAge: 0 });
                  throw apiResponse.sendError({ body: { message: 'user.invalid-token' }, type: 'UnauthorizedException' });
            }
            if (authToken) {
                  const user = await this.authService.getUserByAuthToken(authToken);
                  if (!user) req.user = await this.getAuthToken(res, refreshToken);
                  else req.user = user;
            } else req.user = await this.getAuthToken(res, refreshToken);

            //checking isDisabled user
            if (req.user.isDisabled) {
                  this.deleteAllAuthToken(res);
                  throw apiResponse.sendError({ type: 'ForbiddenException', body: { message: 'user.ban' } });
            }

            //checking role
            if (role === UserRole.ADMIN && req.user.role !== UserRole.ADMIN) {
                  this.deleteAllAuthToken(res);
                  throw apiResponse.sendError({ body: { message: 'user.not-allow-action' }, type: 'ForbiddenException' });
            }

            return true;
      }
}
