import * as Joi from 'joi';

//---- Entity
import { TicTacToe } from '../entity/ticTacToe.entity';
//---- Common
import { ValidatorService } from '../../utils/validator/validator.service';
import { roomJoiSchema } from '../../utils/validator/schema/room.validator';

const { getJoiSchema } = ValidatorService.joiSchemaGenerator<TicTacToe>(roomJoiSchema);

export class DrawDto {
      isAccept: boolean;
      roomId: string;
}

export const vDrawDto = Joi.object({
      isAccept: Joi.boolean().required(),
      roomId: getJoiSchema('id'),
});
