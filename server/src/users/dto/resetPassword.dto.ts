import * as Joi from 'joi';

//---- Service
import { ValidatorService } from '../../utils/validator/validator.service';

//---- Entity
import { User } from '../entities/user.entity';

//---- Common
import { userJoiSchema } from '../../utils/validator/schema/user.validator';

const { getJoiSchema } = ValidatorService.joiSchemaGenerator<User>(userJoiSchema);

export class ResetPasswordDTO {
      newPassword: string;
      confirmNewPassword: string;
}

export const vResetPasswordDTO = Joi.object({
      newPassword: getJoiSchema('password'),
      confirmNewPassword: getJoiSchema('password').valid(Joi.ref('newPassword')),
});
