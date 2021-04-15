import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { AuthModule } from '../auth/auth.module';
import { RedisModule } from '../providers/redis/redis.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationRepository } from './entities/notification.repository';
import { UserModule } from '../users/user.module';

@Module({
      imports: [TypeOrmModule.forFeature([NotificationRepository]), AuthModule, RedisModule, UserModule],
      providers: [NotificationsGateway, NotificationsService],
      exports: [],
})
export class NotificationsModule {}
