import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageRepository } from './entities/message.repository';
import { ChatRepository } from './entities/chat.repository';
import { RedisModule } from '../utils/redis/redis.module';
import { AuthModule } from '../auth/auth.module';
import { ChatGateway } from './chat.gateway';

@Module({
      imports: [TypeOrmModule.forFeature([MessageRepository, ChatRepository]), RedisModule, AuthModule],
      providers: [ChatService, ChatGateway],
      controllers: [ChatController],
      exports: [ChatService],
})
export class ChatModule {}
