import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './entities/user.repository';
import { AuthModule } from '../auth/auth.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
      imports: [TypeOrmModule.forFeature([UserRepository]), forwardRef(() => AuthModule)],
      controllers: [UserController, AdminController],
      providers: [UserService, AdminService],
      exports: [UserService, TypeOrmModule],
})
export class UserModule {}
