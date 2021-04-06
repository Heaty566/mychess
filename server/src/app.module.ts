import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

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
import { ChatModule } from './models/chats/chat.module';
import { MessagesModule } from './models/messages/messages.module';
import Room from './models/rooms/entities/room.entity';
import { Chat } from './models/chats/entities/chat.entity';
import { Message } from './models/messages/entities/message.entity';

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
      ],
      controllers: [],
})
export class AppModule {}
