import * as Joi from 'joi';

//Entity
import { User } from '../../user/entities/user.entity';

//Service
import { ValidatorService } from '../../utils/validator/validator.service';

//Utils
import { userJoiSchema } from '../../utils/validator/schema/user.validator';

const { getJoiSchemas } = ValidatorService.joiSchemaGenerator<User>(userJoiSchema);

export class OtpSmsDTO {
      phoneNumber: string;
}

export const vOtpSmsDTO = Joi.object({
      ...getJoiSchemas(['phoneNumber']),
});
