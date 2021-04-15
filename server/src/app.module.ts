import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AuthModule } from './auth/auth.module';
import { SmailModule } from './providers/smail/smail.module';
import { UserModule } from './users/user.module';
import { SmsModule } from './providers/sms/sms.module';
import { AwsModule } from './providers/aws/aws.module';
import { LoggerModule } from './utils/logger/logger.module';
import { RedisModule } from './providers/redis/redis.module';

import { User } from './users/entities/user.entity';
import { ReToken } from './auth/entities/re-token.entity';
import { RepositoryModule } from './utils/repository/repository.module';
import { CommonModule } from './common/common.module';
import { ChatsModule } from './chats/chats.module';
import { Notification } from './notifications/entities/notification.entity';
import { NotificationsModule } from './notifications/notifications.module';

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
      entities: [User, ReToken, Notification],
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
            RepositoryModule,
            CommonModule,
            ChatsModule,
            NotificationsModule,
      ],
      controllers: [],
})
export class AppModule {}
