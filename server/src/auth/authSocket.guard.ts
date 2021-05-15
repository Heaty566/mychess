import * as Cookie from 'cookie';

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { RedisService } from '../utils/redis/redis.service';
import { SocketExtend } from 'socket.io';
import User from '../user/entities/user.entity';
import { ioResponse } from '../app/interface/socketResponse';

//---- Service

//---- Entity

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
            if (!client.cookies) throw ioResponse.sendError({}, 'UnauthorizedException');

            //get io-token
            const ioToken = client.cookies['io-token'] || '';
            if (!ioToken) throw ioResponse.sendError({}, 'UnauthorizedException');

            //checking io-token
            const getUser = await this.redisService.getObjectByKey<User>(ioToken);
            if (!getUser) throw ioResponse.sendError({}, 'UnauthorizedException');
            client.user = {
                  games: client?.user?.games ? client.user.games : { chessId: '', tttId: '' },
                  id: getUser.id,
                  username: getUser.username,
            };

            return true;
      }
}
