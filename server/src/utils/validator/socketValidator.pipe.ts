import { Injectable, PipeTransform, UseFilters } from '@nestjs/common';
import { ConnectedSocket } from '@nestjs/websockets';
import { ObjectSchema } from 'joi';
import { ioResponse } from '../../app/interface/socketResponse';

//---- Common

@Injectable()
// @UseFilters(new AllExceptionsFilter())
export class SocketJoiValidatorPipe implements PipeTransform {
      constructor(private readonly schema: ObjectSchema) {}

      transform(input: any) {
            const { error, value } = this.schema.validate(input, { abortEarly: false });
            if (error) throw ioResponse.sendError({ details: { message: { type: 'user.not-allow-action' } } }, 'BadRequestException');

            return value;
      }
}
