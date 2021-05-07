import { Injectable, PipeTransform } from '@nestjs/common';
import { ObjectSchema } from 'joi';

//---- Service
import { LocalesService } from '../locales/locales.service';

//---- Common
import { apiResponse } from '../../app/interface/apiResponse';

@Injectable()
export class JoiValidatorPipe implements PipeTransform {
      constructor(private readonly schema: ObjectSchema) {}

      transform(input: any) {
            if (!input) throw apiResponse.sendError({ details: { message: { type: 'error.invalid-input' } } }, 'BadRequestException');
            const { error, value } = this.schema.validate(input, { abortEarly: false });
            if (error) throw apiResponse.sendError({ details: LocalesService.mapJoiError(error) }, 'BadRequestException');

            return value;
      }
}
