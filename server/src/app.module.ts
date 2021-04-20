import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

//---------Module
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';

//---------Provider
import { SmailModule } from './providers/smail/smail.module';
import { SmsModule } from './providers/sms/sms.module';
import { AwsModule } from './providers/aws/aws.module';
import { NotificationsModule } from './notifications/notifications.module';

//---------Utils
import { LoggerModule } from './utils/logger/logger.module';
import { RedisModule } from './providers/redis/redis.module';
import { RepositoryModule } from './utils/repository/repository.module';

//---------Entity
import { User } from './users/entities/user.entity';
import { ReToken } from './auth/entities/re-token.entity';
import { Notification } from './notifications/entities/notification.entity';
import { ChatsModule } from './chats/chats.module';

const Config = ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./config/.env.${process.env.NODE_ENV}`,
});

const DBConfig = TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      keepConnectionAlive: true,
      entities: [User, ReToken, Notification],
});

@Module({
      imports: [
            // --- Config
            Config,
            DBConfig,
            ScheduleModule.forRoot(),

            // --- Module
            AuthModule,
            UserModule,
            CommonModule,
            NotificationsModule,

            // --- Provider
            SmailModule,
            SmsModule,
            AwsModule,

            // --- Utils
            LoggerModule,
            RedisModule,
            RepositoryModule,
            ChatsModule,
      ],
      controllers: [],
})
export class AppModule {}
