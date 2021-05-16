import * as Joi from 'joi';

import { Message } from '../../../chat/entities/message.entity';

export function joinMessageJoiSchema(field: keyof Message) {
      switch (field) {
            case 'content':
                  return Joi.string().trim().required();
      }
}
