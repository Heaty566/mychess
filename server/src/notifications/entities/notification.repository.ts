import { RepositoryService } from '../../utils/repository/repository.service';
import { Notification } from '../../notifications/entities/notification.entity';
import { EntityRepository } from 'typeorm';

@EntityRepository(Notification)
export class NotificationRepository extends RepositoryService<Notification> {}
