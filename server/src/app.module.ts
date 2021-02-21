import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
//* Internal import
import { User } from './user/entities/user.entity';

import { AuthModule } from './auth/auth.module';

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
      entities: [User],
});

const JwtConfig = JwtModule.register({ secret: process.env.JWT_SECRET_KEY });

@Module({
      imports: [Config, DBConfig, JwtConfig, AuthModule],
      controllers: [],
})
export class AppModule {}
