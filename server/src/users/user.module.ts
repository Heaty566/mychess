import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

//----- Controller
import { UserController } from './user.controller';
import { AdminController } from './admin.controller';

//----- Module
import { AuthModule } from '../auth/auth.module';

//----- Utils
import { RedisModule } from '../providers/redis/redis.module';
import { LoggerModule } from '../utils/logger/logger.module';

//----- Provider
import { SmsModule } from '../providers/sms/sms.module';
import { AwsModule } from '../providers/aws/aws.module';
import { SmailModule } from '../providers/smail/smail.module';
import { UserGateway } from './user.gateway';

//----- Service
import { UserService } from './user.service';
import { AdminService } from './admin.service';

//----- Repository
import { UserRepository } from './entities/user.repository';

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
      providers: [UserService, AdminService, UserGateway],
      exports: [UserService, TypeOrmModule],
})
export class UserModule {}
