import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
//* Internal import
import { User } from './user/entities/user.entity';

import { AuthModule } from './auth/auth.module';
import { AuthToken } from './auth/entities/authToken.entity';
import { RefreshToken } from './auth/entities/refreshToken.entity';
import { SmailModule } from './providers/smail/smail.module';
import { UserModule } from './user/user.module';
import { SmsModule } from './providers/sms/sms.module';
import { AwsModule } from './providers/aws/aws.module';
import { LoggerModule } from './providers/logger/logger.module';

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
      entities: [User, AuthToken, RefreshToken],
});

const JwtConfig = JwtModule.register({ secret: process.env.JWT_SECRET_KEY });

@Module({
      imports: [Config, DBConfig, JwtConfig, AuthModule, SmailModule, UserModule, SmsModule, AwsModule, LoggerModule],
      controllers: [],
})
export class AppModule {}
