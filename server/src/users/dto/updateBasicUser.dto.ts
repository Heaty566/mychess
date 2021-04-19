import * as Joi from 'joi';

//---- Service
import { ValidatorService } from '../../utils/validator/validator.service';

//---- Entity
import { User } from '../entities/user.entity';

//---- Common
import { userJoiSchema } from '../../utils/validator/schema/user.validator';

const { getJoiSchema } = ValidatorService.joiSchemaGenerator<User>(userJoiSchema);

export class UpdateUserDto {
      name: string;
}

export const vUpdateUserDto = Joi.object({
      name: getJoiSchema('name'),
});
