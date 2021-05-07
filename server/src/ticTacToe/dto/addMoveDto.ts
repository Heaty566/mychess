import * as Joi from 'joi';

//---- Entity
import { TicTacToe } from '../entity/ticTacToe.entity';
//---- Common
import { ValidatorService } from '../../utils/validator/validator.service';
import { roomJoiSchema } from '../../utils/validator/schema/room.validator';

const { getJoiSchema } = ValidatorService.joiSchemaGenerator<TicTacToe>(roomJoiSchema);

export class AddMoveDto {
      roomId: string;
      x: number;
      y: number;
}
export const vAddMoveDto = Joi.object({
      roomId: getJoiSchema('id'),
      x: Joi.number().min(0).max(14).required(),
      y: Joi.number().min(0).max(14).required(),
});
