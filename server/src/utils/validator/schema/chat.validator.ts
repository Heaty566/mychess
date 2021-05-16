import * as Joi from 'joi';

import { Chat } from '../../../chat/entities/chat.entity';

export function joinChatJoiSchema(field: keyof Chat) {
      switch (field) {
            case 'id':
                  return Joi.string().trim().required();
      }
}
