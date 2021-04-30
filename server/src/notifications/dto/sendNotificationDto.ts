import * as Joi from 'joi';

//---- Service
import { ValidatorService } from '../../utils/validator/validator.service';

//---- Entity
import { Notification } from '../../notifications/entities/notification.entity';

//---- Common
import { notificationJoiSchema } from '../../utils/validator/schema/notification.validator';

const { getJoiSchemas } = ValidatorService.joiSchemaGenerator<Notification>(notificationJoiSchema);

export class SendNotificationDto {
      receiver: string;
}

export const vSendNotificationDto = Joi.object({
      ...getJoiSchemas(['receiver']),
});
