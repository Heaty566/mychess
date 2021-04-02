import * as Joi from 'joi';

import { User } from '../entities/user.entity';
import { ValidatorService } from '../../../utils/validator/validator.service';
import { userJoiSchema } from '../../../utils/validator/schema/user.validator';

const { getJoiSchemas } = ValidatorService.joiSchemaGenerator<User>(userJoiSchema);

export class UpdateEmailDTO {
      email: string;
}

export const vUpdateEmailDTO = Joi.object({
      ...getJoiSchemas(['email']),
});
