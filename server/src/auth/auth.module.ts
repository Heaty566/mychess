import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../user/entities/user.repository';
import { UserService } from '../user/user.service';
import { AuthTokenRepository } from './entities/authToken.repository';
import { JwtService } from '@nestjs/jwt';

@Module({
      imports: [TypeOrmModule.forFeature([AuthTokenRepository, UserRepository])],
      controllers: [AuthController],
      providers: [
            AuthService,
            UserService,
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
