import * as Joi from 'joi';

import { User } from '../../user/entities/user.entity';
import { ValidatorService } from '../../utils/validator/validator.service';
import { userJoiSchema } from '../../utils/validator/schema/user.validator';

const { getJoiSchemas } = ValidatorService.joiSchemaGenerator<User>(userJoiSchema);

export class OTPEmail {
      email: string;
}

export const vOTPEmail = Joi.object({
      ...getJoiSchemas(['email']),
});
