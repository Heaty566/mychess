import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { ReTokenRepository } from './entities/re-token.repository';
import { JwtService } from '@nestjs/jwt';
import { GoogleStrategy } from './social/google.strategy';
import { FacebookStrategy } from './social/facebook.strategy';
import { GithubStrategy } from './social/github.strategy';
import { RedisModule } from '../utils/redis/redis.module';
import { SmailModule } from '../providers/smail/smail.module';
import { SmsModule } from '../providers/sms/sms.module';

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
