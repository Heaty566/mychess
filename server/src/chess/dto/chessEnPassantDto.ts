import * as Joi from 'joi';
import { ChessMoveCoordinates } from '../entity/chess.interface';
import { ValidatorService } from '../../utils/validator/validator.service';
import { Chess } from '../entity/chess.entity';
import { roomJoiSchema } from '../../utils/validator/schema/room.validator';
const { getJoiSchema } = ValidatorService.joiSchemaGenerator<Chess>(roomJoiSchema);

export class ChessEnPassantDto {
      roomId: string;
      enPassantPos: ChessMoveCoordinates;
}

export const vChessEnPassantDto = Joi.object({
      roomId: getJoiSchema('id'),
      enPassantPos: Joi.object().keys({
            x: Joi.number().min(0).max(7).required(),
            y: Joi.number().min(0).max(7).required(),
      }),
});
