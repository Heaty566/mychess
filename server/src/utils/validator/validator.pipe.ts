import { Injectable, PipeTransform } from '@nestjs/common';
import { ObjectSchema } from 'joi';

//---- Service
import { LocalesService } from '../locales/locales.service';

//---- Common
import { apiResponse } from '../../app/interface/ApiResponse';

@Injectable()
export class JoiValidatorPipe implements PipeTransform {
      constructor(private readonly schema: ObjectSchema) {}

      transform(input: any) {
            const { error, value } = this.schema.validate(input, { abortEarly: false });
            if (error) throw apiResponse.sendError({ body: { details: LocalesService.mapJoiError(error), message: 'user.invalid-input' } });

            return value;
      }
}
