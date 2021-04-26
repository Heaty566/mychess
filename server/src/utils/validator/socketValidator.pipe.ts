import { Injectable, PipeTransform } from '@nestjs/common';
import { ObjectSchema } from 'joi';
import { ioResponse } from '../../app/interface/socketResponse';

//---- Common

@Injectable()
export class SocketJoiValidatorPipe implements PipeTransform {
      constructor(private readonly schema: ObjectSchema) {}

      transform(input: any) {
            const { error, value } = this.schema.validate(input, { abortEarly: false });
            if (error) throw ioResponse.sendError({ details: { message: { type: 'user.not-allow-action' } } }, 'BadRequestException');

            return value;
      }
}
