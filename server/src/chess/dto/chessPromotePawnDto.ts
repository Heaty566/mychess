import * as Joi from 'joi';

//---- Service
import { ValidatorService } from '../../utils/validator/validator.service';

//---- Entity
import { Chess } from '../entity/chess.entity';
import { ChessMoveCoordinates } from '../entity/chess.interface';

//---- Common
import { roomJoiSchema } from '../../utils/validator/schema/room.validator';

const { getJoiSchema } = ValidatorService.joiSchemaGenerator<Chess>(roomJoiSchema);

export class ChessPromotePawnDto {
      roomId: string;
      promotePos: ChessMoveCoordinates;
      promoteRole: number;
}

export const vChessPromotePawnDto = Joi.object({
      roomId: getJoiSchema('id'),
      promotePos: Joi.object().keys({
            x: Joi.number().min(0).max(7).required(),
            y: Joi.number().min(0).max(7).required(),
      }),
      promoteRole: Joi.number().min(2).max(5).required(),
});
