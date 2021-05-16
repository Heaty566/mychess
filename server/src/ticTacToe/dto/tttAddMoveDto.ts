import * as Joi from 'joi';

//---- Service
import { ValidatorService } from '../../utils/validator/validator.service';

//---- Entity
import { TicTacToe } from '../entity/ticTacToe.entity';

//---- Common
import { roomJoiSchema } from '../../utils/validator/schema/room.validator';

const { getJoiSchema } = ValidatorService.joiSchemaGenerator<TicTacToe>(roomJoiSchema);

export class TTTAddMoveDto {
      roomId: string;
      x: number;
      y: number;
}
export const vTTTAddMoveDto = Joi.object({
      roomId: getJoiSchema('id'),
      x: Joi.number().min(0).max(14).required(),
      y: Joi.number().min(0).max(14).required(),
});
