import * as Joi from 'joi';
import { roomJoiSchema } from 'src/utils/validator/schema/room.validator';
import { ValidatorService } from 'src/utils/validator/validator.service';
import { Chess } from '../entity/chess.entity';
import { ChessRole, PlayerFlagEnum } from '../entity/chess.interface';
const { getJoiSchema } = ValidatorService.joiSchemaGenerator<Chess>(roomJoiSchema);

export class ChessChooseAPieceDTO {
      roomId: string;
      x: number;
      y: number;
      flag: PlayerFlagEnum;
      chessRole: ChessRole;
}

export const vChessChooseAPieceDTO = Joi.object({
      roomId: getJoiSchema('id'),
      x: Joi.number().min(0).max(7).required(),
      y: Joi.number().min(0).max(7).required(),
      flag: Joi.number().min(-1).max(1).required(),
      chessRole: Joi.number().min(-1).max(6).required,
});
