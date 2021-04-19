import { EntityRepository } from 'typeorm';

//---- Service
import { RepositoryService } from '../../utils/repository/repository.service';

//---- Entity
import { Notification } from '../../notifications/entities/notification.entity';

@EntityRepository(Notification)
export class NotificationRepository extends RepositoryService<Notification> {}
