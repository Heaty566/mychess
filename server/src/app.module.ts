import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AuthModule } from './auth/auth.module';
import { SmailModule } from './providers/smail/smail.module';
import { UserModule } from './models/users/user.module';
import { SmsModule } from './providers/sms/sms.module';
import { AwsModule } from './providers/aws/aws.module';
import { LoggerModule } from './utils/logger/logger.module';
import { RedisModule } from './providers/redis/redis.module';

import { User } from './models/users/entities/user.entity';
import { ReToken } from './auth/entities/re-token.entity';
import { RoomModule } from './models/rooms/room.module';
import { ChatModule } from './chats/chat.module';
import { MessagesModule } from './models/messages/messages.module';
import Room from './models/rooms/entities/room.entity';
import { Chat } from './chats/entities/chat.entity';
import { Message } from './models/messages/entities/message.entity';
import { EventsModule } from './chats/events/events.module';
import { RepositoryModule } from './utils/repository/repository.module';

const Config = ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./config/.env.${process.env.NODE_ENV}`,
});
const DBConfig = TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      keepConnectionAlive: true,
      entities: [User, ReToken, Room, Chat, Message],
});

@Module({
      imports: [
            Config,
            DBConfig,
            ScheduleModule.forRoot(),
            AuthModule,
            SmailModule,
            UserModule,
            SmsModule,
            AwsModule,
            LoggerModule,
            RedisModule,
            RoomModule,
            ChatModule,
            MessagesModule,
            EventsModule,
            RepositoryModule,
      ],
      controllers: [],
})
export class AppModule {}
