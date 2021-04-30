import * as Joi from 'joi';

import { Notification } from '../../../notifications/entities/notification.entity';

export function notificationJoiSchema(field: keyof Notification) {
      switch (field) {
            case 'id':
                  return Joi.string().trim().required();
            case 'receiver':
                  return Joi.string().trim().required();
      }
}
