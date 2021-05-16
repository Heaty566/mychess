import * as Joi from 'joi';

//---- Service
import { ValidatorService } from '../../utils/validator/validator.service';

//---- Entity
import { Chess } from '../entity/chess.entity';

//---- Common
import { roomJoiSchema } from '../../utils/validator/schema/room.validator';

const { getJoiSchema } = ValidatorService.joiSchemaGenerator<Chess>(roomJoiSchema);

export class ChessRoomIdDTO {
      roomId: string;
}

export const vChessRoomIdDto = Joi.object({
      roomId: getJoiSchema('id'),
});
