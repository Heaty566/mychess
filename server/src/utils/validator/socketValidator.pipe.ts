import { Injectable, PipeTransform, UseFilters } from '@nestjs/common';
import { ConnectedSocket } from '@nestjs/websockets';
import { ObjectSchema } from 'joi';
import { ioResponse } from '../../app/interface/socketResponse';
import { LocalesService } from '../locales/locales.service';

//---- Common

@Injectable()
// @UseFilters(new AllExceptionsFilter())
export class SocketJoiValidatorPipe implements PipeTransform {
      constructor(private readonly schema: ObjectSchema) {}

      transform(input: any) {
            if (!input) throw ioResponse.sendError({ details: { message: { type: 'user.invalid-input' } } }, 'BadRequestException');
            const { error, value } = this.schema.validate(input, { abortEarly: false });
            if (error) throw ioResponse.sendError({ details: LocalesService.mapJoiError(error) }, 'BadRequestException');

            return value;
      }
}
