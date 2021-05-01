import * as Joi from 'joi';

//---- Service
import { ValidatorService } from '../../utils/validator/validator.service';

//---- Entity
import { Notification } from '../entities/notification.entity';
import { NotificationConnectType } from '../entities/notificationConnectType.entity';

//---- Common
import { notificationJoiSchema } from '../../utils/validator/schema/notification.validator';

const { getJoiSchemas } = ValidatorService.joiSchemaGenerator<any>(notificationJoiSchema);

export class SendNotificationDto {
      receiver: string;
      notificationType: string;
      link?: string;
      sender: string;
}

export const vSendNotificationDto = Joi.object({
      ...getJoiSchemas(['receiver', 'notificationType', 'sender', 'link']),
});
