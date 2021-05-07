import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

//---- Module
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

//---- Utils
import { RedisModule } from '../utils/redis/redis.module';

//---- Service
import { NotificationsService } from './notifications.service';

//---- Repository
import { NotificationRepository } from './entities/notification.repository';

//---- Gateway
import { NotificationsGateway } from './notifications.gateway';

@Module({
      imports: [TypeOrmModule.forFeature([NotificationRepository]), AuthModule, RedisModule, UserModule],
      providers: [NotificationsGateway, NotificationsService],
      exports: [],
})
export class NotificationsModule {}
