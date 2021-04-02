import * as Joi from 'joi';

import { ValidatorService } from '../../../utils/validator/validator.service';
import { userJoiSchema } from '../../../utils/validator/schema/user.validator';
import { User } from '../entities/user.entity';

const { getJoiSchema } = ValidatorService.joiSchemaGenerator<User>(userJoiSchema);

export class UpdateUserDto {
      name: string;
}

export const vUpdateUserDto = Joi.object({
      name: getJoiSchema('name'),
});
