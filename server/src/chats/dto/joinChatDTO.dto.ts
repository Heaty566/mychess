import * as Joi from 'joi';
import { joinChatJoiSchema } from '../../utils/validator/schema/chat.validator';
import { ValidatorService } from '../../utils/validator/validator.service';
import { Chat } from '../entities/chat.entity';
const { getJoiSchema } = ValidatorService.joiSchemaGenerator<Chat>(joinChatJoiSchema);

export class JoinChatDTO {
      chatId: string;
}

export const vJoinChatDTO = Joi.object({
      chatId: getJoiSchema('id'),
});
