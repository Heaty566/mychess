import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/user/entities/user.repository';

@Module({
      imports: [TypeOrmModule.forFeature([UserRepository])],
      controllers: [AuthController],
      providers: [AuthService],
})
export class AuthModule {}
