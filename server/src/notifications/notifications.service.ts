import { Injectable } from '@nestjs/common';

//---- Entity
import { Notification } from './entities/notification.entity';
import { NotificationRepository } from './entities/notification.repository';

@Injectable()
export class NotificationsService {
      constructor(private readonly notificationRepository: NotificationRepository) {}

      async getNotificationByUserId(userId: string) {
            return await this.notificationRepository.createQueryBuilder().select('*').where('userId = :userId', { userId }).execute();
      }
      async saveNotification(data: Notification) {
            return await this.notificationRepository.save(data);
      }
}
