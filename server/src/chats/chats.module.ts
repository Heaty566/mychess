import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

//---- Service
import { ChatsService } from './chats.service';

//---- Gateway
import { ChatsGateway } from './chats.gateway';

//---- Repository
import { MessageRepository } from './entities/message.repository';
import { ChatRepository } from './entities/chat.repository';

//---- Utils
import { RedisModule } from '../providers/redis/redis.module';
import { ChatsController } from './chats.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
      imports: [TypeOrmModule.forFeature([MessageRepository, ChatRepository]), RedisModule, AuthModule],
      providers: [ChatsGateway, ChatsService],
      controllers: [ChatsController],
      exports: [ChatsService],
})
export class ChatsModule {}
