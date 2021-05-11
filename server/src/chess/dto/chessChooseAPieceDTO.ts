import * as Joi from 'joi';
import { roomJoiSchema } from '../../utils/validator/schema/room.validator';
import { ValidatorService } from '../../utils/validator/validator.service';
import { Chess } from '../entity/chess.entity';
const { getJoiSchema } = ValidatorService.joiSchemaGenerator<Chess>(roomJoiSchema);

export class ChessChooseAPieceDTO {
      roomId: string;
      x: number;
      y: number;
}

export const vChessChooseAPieceDTO = Joi.object({
      roomId: getJoiSchema('id'),
      x: Joi.number().min(0).max(7).required(),
      y: Joi.number().min(0).max(7).required(),
});
