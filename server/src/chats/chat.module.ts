import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRepository } from './entities/chat.repository';

@Module({
      imports: [TypeOrmModule.forFeature([ChatRepository])],
      controllers: [ChatController],
      providers: [ChatService],
})
export class ChatModule {}
