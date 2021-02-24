import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './entities/user.repository';
import { SmailModule } from '../smail/smail.module';

@Module({
      imports: [TypeOrmModule.forFeature([UserRepository]), SmailModule],
      controllers: [UserController],
      providers: [UserService],
})
export class UserModule {}
