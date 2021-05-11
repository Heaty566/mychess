import * as Joi from 'joi';
import { ChessMoveRedis, ChessRole } from '../entity/chess.interface';
import { ValidatorService } from '../../utils/validator/validator.service';
import { Chess } from '../entity/chess.entity';
import { roomJoiSchema } from '../../utils/validator/schema/room.validator';
const { getJoiSchema } = ValidatorService.joiSchemaGenerator<Chess>(roomJoiSchema);

export class ChessAddMoveDto {
      roomId: string;
      curX: number;
      curY: number;
      desX: number;
      desY: number;
}

export const vChessAddMoveDto = Joi.object({
      roomId: getJoiSchema('id'),
      curX: Joi.number().min(0).max(7).required(),
      curY: Joi.number().min(0).max(7).required(),
      desX: Joi.number().min(0).max(7).required(),
      desY: Joi.number().min(0).max(7).required(),
});
