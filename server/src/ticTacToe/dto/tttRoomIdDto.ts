import * as Joi from 'joi';

//---- Entity
import { TicTacToe } from '../entity/ticTacToe.entity';
//---- Common
import { ValidatorService } from '../../utils/validator/validator.service';
import { roomJoiSchema } from '../../utils/validator/schema/room.validator';

const { getJoiSchema } = ValidatorService.joiSchemaGenerator<TicTacToe>(roomJoiSchema);

export class TTTRoomIdDTO {
      roomId: string;
}

export const vTTTRoomIdDto = Joi.object({
      roomId: getJoiSchema('id'),
});
