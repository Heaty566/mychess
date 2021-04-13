import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import * as Cookie from 'cookie';
import { RedisService } from '../providers/redis/redis.service';
import User from '../users/entities/user.entity';

@Injectable()
export class UserSocketGuard implements CanActivate {
      constructor(private redisService: RedisService) {}

      private async cookieParserSocket(context: ExecutionContext) {
            const client: Socket = context.switchToWs().getClient();
            client.cookies = Cookie.parse(client.handshake.headers.cookie);
            return client;
      }

      async canActivate(context: ExecutionContext) {
            const client = await this.cookieParserSocket(context);
            const reToken = client.cookies['io-token'] || '';

            if (!reToken) return false;
            const getUser = await this.redisService.getObjectByKey<User>(reToken);
            if (!getUser) return false;
            client.user = getUser;

            return true;
      }
}
