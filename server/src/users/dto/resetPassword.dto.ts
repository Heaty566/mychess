import * as Joi from 'joi';

import { ValidatorService } from '../../utils/validator/validator.service';
import { userJoiSchema } from '../../utils/validator/schema/user.validator';
import { User } from '../entities/user.entity';

const { getJoiSchema } = ValidatorService.joiSchemaGenerator<User>(userJoiSchema);

export class ResetPasswordDTO {
      newPassword: string;
      confirmNewPassword: string;
}

export const vResetPasswordDTO = Joi.object({
      newPassword: getJoiSchema('password'),
      confirmNewPassword: getJoiSchema('password').valid(Joi.ref('newPassword')),
});
