import * as Joi from 'joi';

//---- Entity
import { TicTacToe } from '../entity/ticTacToe.entity';
//---- Common
import { ValidatorService } from '../../utils/validator/validator.service';
import { roomJoiSchema } from '../../utils/validator/schema/room.validator';

const { getJoiSchema } = ValidatorService.joiSchemaGenerator<TicTacToe>(roomJoiSchema);

export class RoomIdDTO {
      roomId: string;
}

export const vRoomIdDto = Joi.object({
      roomId: getJoiSchema('id'),
});
