import * as Joi from 'joi';

//---- Service
import { ValidatorService } from '../../utils/validator/validator.service';

//---- Entity
import { User } from '../entities/user.entity';

//---- Common
import { userJoiSchema } from '../../utils/validator/schema/user.validator';

const { getJoiSchema } = ValidatorService.joiSchemaGenerator<User>(userJoiSchema);

export class ChangePasswordDTO {
      newPassword: string;
      confirmNewPassword: string;
      currentPassword: string;
}

export const vChangePasswordDTO = Joi.object({
      newPassword: getJoiSchema('password'),
      confirmNewPassword: getJoiSchema('password').valid(Joi.ref('newPassword')),
      currentPassword: getJoiSchema('password'),
});
