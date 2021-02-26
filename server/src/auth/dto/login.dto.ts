import * as Joi from 'joi';

import { User } from '../../user/entities/user.entity';
import { ValidatorService } from '../../utils/validator/validator.service';
import { userJoiSchema } from '../../utils/validator/schema/user.validator';

const { getJoiSchemas } = ValidatorService.joiSchemaGenerator<User>(userJoiSchema);

export class LoginUserDTO {
      username: string;
      password: string;
      //isRemember: boolean;
}

export const vLoginUserDto = Joi.object({
      ...getJoiSchemas(['username', 'password']),
});
