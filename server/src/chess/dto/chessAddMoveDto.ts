import * as Joi from 'joi';
import { ChessMove, ChessRole } from '../entity/chess.interface';
import { ValidatorService } from '../../utils/validator/validator.service';
import { Chess } from '../entity/chess.entity';
import { roomJoiSchema } from '../../utils/validator/schema/room.validator';
const { getJoiSchema } = ValidatorService.joiSchemaGenerator<Chess>(roomJoiSchema);

export class ChessAddMoveDto {
      roomId: string;
      curPos: ChessMove;
      desPos: ChessMove;
}

export const vChessAddMoveDto = Joi.object({
      roomId: getJoiSchema('id'),
      curPos: Joi.object().keys({
            x: Joi.number().min(0).max(7).required(),
            y: Joi.number().min(0).max(7).required(),
            flag: Joi.number().min(-1).max(1).required(),
            chessRole: Joi.number().min(-1).max(6).required(),
      }),
      desPos: Joi.object().keys({
            x: Joi.number().min(0).max(7).required(),
            y: Joi.number().min(0).max(7).required(),
            flag: Joi.number().min(-1).max(1).required(),
            chessRole: Joi.number().min(-1).max(6).required(),
      }),
});
