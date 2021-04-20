import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

//---- Service
import { ChatsService } from './chats.service';

//---- Gateway
import { ChatsGateway } from './chats.gateway';

//---- Repository
import { BelongChatRepository } from './entities/belongChat.repository';

//---- Utils
import { RedisModule } from '../providers/redis/redis.module';

@Module({
      imports: [TypeOrmModule.forFeature([BelongChatRepository]), RedisModule],
      providers: [ChatsGateway, ChatsService],
})
export class ChatsModule {}
