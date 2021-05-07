import { Message } from '../entities/message.entity';
import * as Joi from 'joi';
import { joinChatJoiSchema } from '../../utils/validator/schema/chat.validator';
import { joinMessageJoiSchema } from '../../utils/validator/schema/message.validator';
import { ValidatorService } from '../../utils/validator/validator.service';
import { Chat } from '../entities/chat.entity';

const { getJoiSchema: getJoiSchemaChat } = ValidatorService.joiSchemaGenerator<Chat>(joinChatJoiSchema);
const { getJoiSchema: getJoiSchemaMessage } = ValidatorService.joiSchemaGenerator<Message>(joinMessageJoiSchema);

export class SendMessageDTO {
      content: string;
      chatId: string;
}
export const vSendMessageDTO = Joi.object({
      chatId: getJoiSchemaChat('id'),
      content: getJoiSchemaMessage('content'),
});
