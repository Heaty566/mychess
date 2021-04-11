import * as Joi from 'joi';

import { User } from '../../models/users/entities/user.entity';
import { ValidatorService } from '../../utils/validator/validator.service';
import { userJoiSchema } from '../../utils/validator/schema/user.validator';

const { getJoiSchemas } = ValidatorService.joiSchemaGenerator<User>(userJoiSchema);

export class SupportDTO {
      name: string;
      email: string;
      message: string;
}

export const vSupportDto = Joi.object({
      ...getJoiSchemas(['name', 'email']),
      message: Joi.string().min(1).max(3000).required(),
});
