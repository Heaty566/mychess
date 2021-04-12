import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { AuthModule } from '../auth/auth.module';
import { RedisModule } from '../providers/redis/redis.module';

@Module({
      imports: [AuthModule, RedisModule],
      providers: [ChatsGateway, ChatsService],
})
export class ChatsModule {}
