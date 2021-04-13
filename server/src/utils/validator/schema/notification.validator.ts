import * as Joi from 'joi';

import { Notification } from '../../../notifications/entities/noitification.entity';
import { NotificationUserConnect } from '../../../notifications/entities/notification.user.connect.entity';

export function userJoiSchema(field: keyof Notification | keyof NotificationUserConnect) {
      switch (field) {
      }
}
