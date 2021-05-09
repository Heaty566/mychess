import * as Joi from 'joi';
import { ChessRole } from '../entity/chess.interface';
import { ValidatorService } from '../../utils/validator/validator.service';
import { Chess } from '../entity/chess.entity';
import { roomJoiSchema } from '../../utils/validator/schema/room.validator';
const { getJoiSchema } = ValidatorService.joiSchemaGenerator<Chess>(roomJoiSchema);

export class ChessAddMoveDto {
      roomId: string;
      x: number;
      y: number;
      chessRole: ChessRole;
}

export const vChessAddMoveDto = Joi.object({
      roomId: getJoiSchema('id'),
      x: Joi.number().min(0).max(7).required(),
      y: Joi.number().min(0).max(7).required(),
      chessRole: Joi.number().min(-1).max(6).required,
});
