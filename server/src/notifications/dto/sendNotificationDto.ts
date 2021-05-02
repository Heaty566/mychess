import * as Joi from 'joi';

//---- Service
import { ValidatorService } from '../../utils/validator/validator.service';

//---- Common
import { notificationJoiSchema } from '../../utils/validator/schema/notification.validator';

const { getJoiSchemas } = ValidatorService.joiSchemaGenerator<any>(notificationJoiSchema);

export class SendNotificationDto {
      receiver: string;
      notificationType: string;
      link?: string;
}

export const vSendNotificationDto = Joi.object({
      ...getJoiSchemas(['receiver', 'notificationType', 'link']),
});
