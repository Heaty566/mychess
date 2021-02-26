import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectSchema } from 'joi';

//* Internal import

import { apiResponse } from '../../app/interface/ApiResponse';
import { validatorService } from './validator.service';

@Injectable()
export class JoiValidatorPipe implements PipeTransform {
      constructor(private readonly schema: ObjectSchema) {}

      transform(input: any, metaData: ArgumentMetadata) {
            const { error, value } = this.schema.validate(input, { abortEarly: false });
            if (error)
                  throw apiResponse.sendError({ details: validatorService.joiErrorMapper(error), message: 'Invalid input' }, 'BadRequestException');

            return value;
      }
}
