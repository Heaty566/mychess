import { Injectable } from '@nestjs/common';

//---- Entity
import { NotificationRepository } from './entities/notification.repository';
import { NotificationConnectType } from './entities/notificationConnectType.entity';

@Injectable()
export class NotificationsService {
      constructor(private readonly notificationRepository: NotificationRepository) {}

      async getNotificationByUserId(userId: string) {
            return await this.notificationRepository.createQueryBuilder().select('*').where('userId = :userId', { userId }).execute();
      }

      async saveNotification(input: NotificationConnectType): Promise<NotificationConnectType> {
            return await this.notificationRepository.save(input);
      }
}
