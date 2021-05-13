import { ValidatorService } from '../../utils/validator/validator.service';
import { roomJoiSchema } from '../../utils/validator/schema/room.validator';
import * as Joi from 'joi';
import { Chess } from '../entity/chess.entity';
const { getJoiSchema } = ValidatorService.joiSchemaGenerator<Chess>(roomJoiSchema);

export class DrawDto {
      isAccept: boolean;
      roomId: string;
}

export const vDrawDto = Joi.object({
      isAccept: Joi.boolean().required(),
      roomId: getJoiSchema('id'),
});
