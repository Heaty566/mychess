import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ReTokenRepository } from './entities/re-token.repository';
import { UserModule } from '../models/users/user.module';
import { RedisModule } from '../providers/redis/redis.module';
import { SmailModule } from '../providers/smail/smail.module';
import { SmsModule } from '../providers/sms/sms.module';
import { GoogleStrategy } from './passport/google.strategy';
import { FacebookStrategy } from './passport/facebook.strategy';
import { GithubStrategy } from './passport/github.strategy';

@Module({
      imports: [TypeOrmModule.forFeature([ReTokenRepository]), UserModule, RedisModule, SmailModule, SmsModule],
      controllers: [AuthController],
      providers: [
            AuthService,
            GoogleStrategy, // GOOGLE
            FacebookStrategy, // FACEBOOK
            GithubStrategy, // GITHUB
            {
                  provide: JwtService,
                  useFactory: () => {
                        return new JwtService({ secret: process.env.JWT_SECRET_KEY });
                  },
            },
      ],
      exports: [AuthService],
})
export class AuthModule {}
