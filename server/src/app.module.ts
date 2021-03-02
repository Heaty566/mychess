import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
//* Internal import
import { User } from './user/entities/user.entity';

import { AuthModule } from './auth/auth.module';
import { ReToken } from './auth/entities/re-token.entity';
import { SmailModule } from './providers/smail/smail.module';
import { UserModule } from './user/user.module';
import { SmsModule } from './providers/sms/sms.module';
import { AwsModule } from './providers/aws/aws.module';
import { LoggerModule } from './utils/logger/logger.module';
import { RedisModule } from './utils/redis/redis.module';

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

const JwtConfig = JwtModule.register({ secret: process.env.JWT_SECRET_KEY });

@Module({
      imports: [Config, DBConfig, JwtConfig, AuthModule, SmailModule, UserModule, SmsModule, AwsModule, LoggerModule, RedisModule],
      controllers: [],
})
export class AppModule {}
