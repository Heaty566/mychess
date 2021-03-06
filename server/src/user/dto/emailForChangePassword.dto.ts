import * as Joi from 'joi';

import { User } from '../entities/user.entity';
import { ValidatorService } from '../../utils/validator/validator.service';
import { userJoiSchema } from '../../utils/validator/schema/user.validator';

const { getJoiSchemas } = ValidatorService.joiSchemaGenerator<User>(userJoiSchema);

export class EmailForChangePasswordDTO {
      email: string;
}

export const vEmailForChangePasswordDTO = Joi.object({
      ...getJoiSchemas(['email']),
});
