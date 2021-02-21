import * as Joi from 'joi';

import { errorMsg } from './messageErrorMapper';
import { User } from '../../user/entities/user.entity';

export function userJoiSchema(field: keyof User) {
      switch (field) {
            case 'name':
                  return Joi.string().min(5).max(40).trim().lowercase().required().messages(errorMsg());
            case 'password':
                  return Joi.string().min(8).max(32).trim().alphanum().required().messages(errorMsg());
            case 'username':
                  return Joi.string().max(32).min(5).lowercase().trim().alphanum().required().messages(errorMsg());
      }
}
