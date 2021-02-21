import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectSchema } from 'joi';

//* Internal import
import { JoiErrorMapper } from './messageErrorMapper';
import { ApiResponse } from '../interface/ApiResponse';

@Injectable()
export class JoiValidatorPipe implements PipeTransform {
      constructor(private readonly schema: ObjectSchema) {}

      transform(input: any, metaData: ArgumentMetadata) {
            const { error, value } = this.schema.validate(input, { abortEarly: false });
            if (error) {
                  const errorResponse: ApiResponse<void> = {
                        details: JoiErrorMapper(error),
                        message: 'Invalid input',
                  };
                  throw new BadRequestException(errorResponse);
            }

            return value;
      }
}
