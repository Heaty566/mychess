import * as Joi from 'joi';

//---- Entity
import { User } from '../../user/entities/user.entity';

//---- Service
import { ValidatorService } from '../../utils/validator/validator.service';

//---- Common
import { userJoiSchema } from '../../utils/validator/schema/user.validator';

const { getJoiSchemas } = ValidatorService.joiSchemaGenerator<User>(userJoiSchema);

export class SupportDTO {
      name: string;
      email: string;
      message: string;
}

export const vSupportDto = Joi.object({
      ...getJoiSchemas(['name', 'email']),
      message: Joi.string().min(1).max(3000).required(),
});
