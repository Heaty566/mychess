import * as Joi from 'joi';
import { JoiPasswordComplexity } from 'joi-password';

import { User } from '../../../models/users/entities/user.entity';

export function userJoiSchema(field: keyof User) {
      switch (field) {
            case 'name':
                  return Joi.string().min(5).max(40).trim().lowercase().required();
            case 'password':
                  return JoiPasswordComplexity.string()
                        .min(8)
                        .max(32)
                        .trim()
                        .alphanum()
                        .minOfLowercase(1)
                        .minOfUppercase(1)
                        .minOfNumeric(1)
                        .required();
            case 'username':
                  return Joi.string().max(32).min(5).lowercase().trim().alphanum().required();
            case 'phoneNumber':
                  return Joi.string().max(11).min(10).trim().required();
            case 'email':
                  return Joi.string().min(5).max(255).email();
      }
}
