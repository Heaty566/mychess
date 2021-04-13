import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { SocketExtend } from 'socket.io';
import * as Cookie from 'cookie';
import { RedisService } from '../providers/redis/redis.service';
import User from '../users/entities/user.entity';

@Injectable()
export class UserSocketGuard implements CanActivate {
      constructor(private redisService: RedisService) {}

      private async cookieParserSocket(context: ExecutionContext) {
            const client: SocketExtend = context.switchToWs().getClient();
            if (client.handshake.headers.cookie) client.cookies = Cookie.parse(client.handshake.headers.cookie);
            return client;
      }

      async canActivate(context: ExecutionContext) {
            const client = await this.cookieParserSocket(context);
            if (!client.cookies) return false;

            const ioToken = client.cookies['io-token'] || '';

            if (!ioToken) return false;
            const getUser = await this.redisService.getObjectByKey<User>(ioToken);
            if (!getUser) return false;
            client.user = getUser;

            return true;
      }
}
