import * as Joi from 'joi';

//---- Service
import { ValidatorService } from '../../utils/validator/validator.service';

//---- Entity
import { User } from '../entities/user.entity';

//---- Common
import { userJoiSchema } from '../../utils/validator/schema/user.validator';

const { getJoiSchemas } = ValidatorService.joiSchemaGenerator<User>(userJoiSchema);

export class UpdateEmailDTO {
      email: string;
}

export const vUpdateEmailDTO = Joi.object({
      ...getJoiSchemas(['email']),
});
