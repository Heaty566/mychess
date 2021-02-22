import { userJoiSchema } from '../../app/validator/user.validator';
import { User } from '../../user/entities/user.entity';
import { joiSchemaGenerator } from '../../app/validator';
import Joi from 'joi';

const { getJoiSchemas } = joiSchemaGenerator<User>(userJoiSchema);

export class LoginUserDto {
      username: string;
      password: string;
}

export const vLoginUserDto = Joi.object({
      ...getJoiSchemas(['username', 'password']),
});
