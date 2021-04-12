import * as Joi from 'joi';
import { string } from 'joi';

export class JoinRoomDTO {
      roomId: string;
}

export const vJoinRoomDTO = Joi.object({
      roomId: string().required(),
});
