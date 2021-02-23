import * as Joi from 'joi';

import { userJoiSchema } from '../../app/validator/user.validator';
import { joiSchemaGenerator } from '../../app/validator';
import { User } from '../../user/entities/user.entity';

const { getJoiSchema, getJoiSchemas } = joiSchemaGenerator<User>(userJoiSchema);
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
