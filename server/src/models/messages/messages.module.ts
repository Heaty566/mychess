import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageRepository } from './entities/message.repository';

@Module({
      imports: [TypeOrmModule.forFeature([MessageRepository])],
      controllers: [MessagesController],
      providers: [MessagesService],
})
export class MessagesModule {}
