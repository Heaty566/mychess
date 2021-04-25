import { ValidatorService } from '../../utils/validator/validator.service';
import { roomJoiSchema } from '../../utils/validator/schema/room.validator';
import * as Joi from 'joi';
import { TicTacToe } from '../entity/ticTacToe.entity';

const { getJoiSchema } = ValidatorService.joiSchemaGenerator<TicTacToe>(roomJoiSchema);

export class JoinRoomDto {
      roomId: string;
}

export const vJoinRoomDto = Joi.object({
      roomId: getJoiSchema('id'),
});
