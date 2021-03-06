import { Injectable, PipeTransform } from '@nestjs/common';
import { ObjectSchema } from 'joi';

import { LocalesService } from '../locales/locales.service';
import { apiResponse } from '../../app/interface/ApiResponse';

@Injectable()
export class JoiValidatorPipe implements PipeTransform {
      constructor(private readonly schema: ObjectSchema) {}

      transform(input: any) {
            const { error, value } = this.schema.validate(input, { abortEarly: false });
            if (error) throw apiResponse.sendError({ body: { details: LocalesService.mapJoiError(error), message: 'invalid input' } });

            return value;
      }
}
