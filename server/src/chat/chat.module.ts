import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

//---- Service
import { ChatService } from './chat.service';

//---- Controller
import { ChatController } from './chat.controller';

//---- Gateway
import { ChatGateway } from './chat.gateway';

//---- Module
import { RedisModule } from '../utils/redis/redis.module';
import { AuthModule } from '../auth/auth.module';

//---- Repository
import { ChatRepository } from './entities/chat.repository';
import { MessageRepository } from './entities/message.repository';

@Module({
      imports: [TypeOrmModule.forFeature([MessageRepository, ChatRepository]), RedisModule, AuthModule],
      providers: [ChatService, ChatGateway],
      controllers: [ChatController],
      exports: [ChatService],
})
export class ChatModule {}
