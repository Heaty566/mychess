import * as Joi from 'joi';

import { User } from '../../models/users/entities/user.entity';
import { ValidatorService } from '../../utils/validator/validator.service';
import { userJoiSchema } from '../../utils/validator/schema/user.validator';

const { getJoiSchemas } = ValidatorService.joiSchemaGenerator<User>(userJoiSchema);

export class OtpSmsDTO {
      phoneNumber: string;
}

export const vOtpSmsDTO = Joi.object({
      ...getJoiSchemas(['phoneNumber']),
});
