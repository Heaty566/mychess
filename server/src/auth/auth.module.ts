import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../user/entities/user.repository';
import { UserService } from '../user/user.service';
import { AuthTokenRepository } from './entities/authToken.repository';
import { RefreshTokenRepository } from './entities/refreshToken.repository';

@Module({
      imports: [TypeOrmModule.forFeature([UserRepository, AuthTokenRepository, RefreshTokenRepository])],
      controllers: [AuthController],
      providers: [AuthService, UserService],
})
export class AuthModule { }
