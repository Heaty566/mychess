import * as Joi from 'joi';

export class CreateNewRoomDTO {
      limitTime: number;
}

export const vCreateNewRoomDTO = Joi.object({
      limitTime: Joi.number().min(3).max(30).required(),
});
