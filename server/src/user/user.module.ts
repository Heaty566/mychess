import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './entities/user.repository';
import { SmailModule } from '../providers/smail/smail.module';
import { SmsModule } from '../providers/sms/sms.module';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';

@Module({
      imports: [TypeOrmModule.forFeature([UserRepository]), AuthModule],
      controllers: [UserController],
      providers: [UserService],
      exports: [UserService],
})
export class UserModule {}
