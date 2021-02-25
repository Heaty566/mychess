import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { AuthTokenRepository } from './entities/authToken.repository';
import { JwtService } from '@nestjs/jwt';

@Module({
      imports: [TypeOrmModule.forFeature([AuthTokenRepository]), UserModule],
      controllers: [AuthController],
      providers: [
            AuthService,
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
