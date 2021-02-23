import * as Joi from "joi";

import { User } from "../../user/entities/user.entity";
import { joiSchemaGenerator } from "../../app/validator";
import { userJoiSchema } from '../../app/validator/user.validator';

const { getJoiSchemas } = joiSchemaGenerator<User>(userJoiSchema);

export class LoginUserDTO {
    username: string;
    password: string;
    //isRemember: boolean;
}

export const vLoginUserDto = Joi.object({
    ...getJoiSchemas(["username", "password"])
})