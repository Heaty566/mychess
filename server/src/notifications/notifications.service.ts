import { Injectable } from '@nestjs/common';

//---- Entity
import { NotificationRepository } from './entities/notification.repository';

@Injectable()
export class NotificationsService {
      constructor(private readonly notificationRepository: NotificationRepository) {}

      async getNotificationByUserId(userId: string) {
            return await this.notificationRepository.createQueryBuilder().select('*').where('userId = :userId', { userId }).execute();
      }
}
