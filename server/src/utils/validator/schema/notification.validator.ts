import * as Joi from 'joi';

import { Notification } from '../../../notifications/entities/notification.entity';
import { NotificationType } from '../../../notifications/entities/notification.type.enum';
import { NotificationConnectType } from '../../../notifications/entities/notificationConnectType.entity';

export function notificationJoiSchema(field: keyof Notification | keyof NotificationConnectType) {
      switch (field) {
            case 'receiver':
                  return Joi.string().trim().required();
            case 'notificationType':
                  return Joi.string().valid(...Object.values(NotificationType));

            case 'link':
                  return Joi.string().trim().required();
      }
}
