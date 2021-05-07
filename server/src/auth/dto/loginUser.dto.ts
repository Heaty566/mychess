import * as Joi from 'joi';

//Entity
import { User } from '../../user/entities/user.entity';

//Service
import { ValidatorService } from '../../utils/validator/validator.service';

//Utils
import { userJoiSchema } from '../../utils/validator/schema/user.validator';

const { getJoiSchemas } = ValidatorService.joiSchemaGenerator<User>(userJoiSchema);

export class LoginUserDTO {
      username: string;
      password: string;
}

export const vLoginUserDto = Joi.object({
      ...getJoiSchemas(['username', 'password']),
});
