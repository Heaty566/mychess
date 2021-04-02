import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller';
import { AdminController } from './admin.controller';

import { UserService } from './user.service';
import { AdminService } from './admin.service';

import { SmailModule } from '../../providers/smail/smail.module';
import { LoggerModule } from '../../utils/logger/logger.module';
import { UserRepository } from './entities/user.repository';
import { AuthModule } from '../../auth/auth.module';
import { RedisModule } from '../../providers/redis/redis.module';
import { SmsModule } from '../../providers/sms/sms.module';
import { AwsModule } from '../../providers/aws/aws.module';

@Module({
      imports: [
            TypeOrmModule.forFeature([UserRepository]),
            forwardRef(() => AuthModule),
            LoggerModule,
            RedisModule,
            SmsModule,
            SmailModule,
            AwsModule,
      ],
      controllers: [UserController, AdminController],
      providers: [UserService, AdminService],
      exports: [UserService, TypeOrmModule],
})
export class UserModule {}
