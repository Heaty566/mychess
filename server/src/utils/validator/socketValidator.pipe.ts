import { Injectable, PipeTransform } from '@nestjs/common';
import { ObjectSchema } from 'joi';
import { ioResponse } from '../../app/interface/socketResponse';
import { LocalesService } from '../locales/locales.service';

//---- Common

@Injectable()
export class SocketJoiValidatorPipe implements PipeTransform {
      constructor(private readonly schema: ObjectSchema) {}

      transform(input: any) {
            if (!input) throw ioResponse.sendError({ details: { errorMessage: { type: 'error.invalid-input' } } }, 'BadRequestException');
            const { error, value } = this.schema.validate(input, { abortEarly: false });
            if (error) throw ioResponse.sendError({ details: LocalesService.mapJoiError(error) }, 'BadRequestException');

            return value;
      }
}
