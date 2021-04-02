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

const Config = ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./config/.env.${process.env.NODE_ENV}`,
});
const DBConfig = TypeOrmModule.forRoot({
      url: process.env.DB_URL,
      type: 'mongodb',
      synchronize: true,
      keepConnectionAlive: true,
      useUnifiedTopology: true,
      entities: [User, ReToken],
});

@Module({
      imports: [Config, DBConfig, AuthModule, SmailModule, UserModule, SmsModule, AwsModule, LoggerModule, RedisModule],
      controllers: [],
})
export class AppModule {}
