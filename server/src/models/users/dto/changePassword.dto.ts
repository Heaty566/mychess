import * as Joi from 'joi';

import { ValidatorService } from '../../../utils/validator/validator.service';
import { userJoiSchema } from '../../../utils/validator/schema/user.validator';
import { User } from '../entities/user.entity';

const { getJoiSchema } = ValidatorService.joiSchemaGenerator<User>(userJoiSchema);

export class ChangePasswordDTO {
      newPassword: string;
      confirmNewPassword: string;
}

export const vChangePasswordDTO = Joi.object({
      newPassword: getJoiSchema('password'),
      confirmNewPassword: getJoiSchema('password').valid(Joi.ref('newPassword')),
});
