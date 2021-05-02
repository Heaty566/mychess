import * as Joi from 'joi';

import { User } from '../../../users/entities/user.entity';

export function roomJoiSchema(field: keyof User) {
      switch (field) {
            case 'id':
                  return Joi.string().trim().required();
      }
}
