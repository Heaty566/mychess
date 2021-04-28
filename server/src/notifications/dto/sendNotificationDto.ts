import * as Joi from 'joi';

//---- Service
import { ValidatorService } from '../../utils/validator/validator.service';

//---- Entity
import { User } from '../../users/entities/user.entity';

//---- Common
import { userJoiSchema } from '../../utils/validator/schema/user.validator';

const { getJoiSchemas } = ValidatorService.joiSchemaGenerator<User>(userJoiSchema);

export class SendNotificationDto {
      id: string;
}

export const vSendNotificationDto = Joi.object({
      ...getJoiSchemas(['id']),
});
