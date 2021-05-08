import * as Joi from 'joi';

//---- Entity
import { User } from '../../user/entities/user.entity';

//---- Service
import { ValidatorService } from '../../utils/validator/validator.service';

//---- Common
import { userJoiSchema } from '../../utils/validator/schema/user.validator';

const { getJoiSchema, getJoiSchemas } = ValidatorService.joiSchemaGenerator<User>(userJoiSchema);
export class RegisterUserDTO {
      username: string;
      name: string;
      password: string;
      confirmPassword: string;
}

export const vRegisterUserDto = Joi.object({
      ...getJoiSchemas(['username', 'password', 'name']),
      confirmPassword: getJoiSchema('password').valid(Joi.ref('password')),
});
