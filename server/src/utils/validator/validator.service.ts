import * as Joi from 'joi';
import { ValidationError } from 'joi';
import { LocalesService } from '../locales/locales.service';

export class ValidatorService {
      constructor(private readonly localesService: LocalesService) {}

      /**
       *
       * @param cb must be an switch case function return Joi.schema
       * @param T the object you want to validate
       * @returns return 2 joi generator function with your schema
       */
      public static joiSchemaGenerator<T>(cb: CallableFunction) {
            function getJoiSchema(field: keyof T): Joi.Schema {
                  return cb(field);
            }

            function getJoiSchemas(fields: (keyof T)[]): { [key: string]: Joi.Schema } {
                  const schema = {};
                  for (const field of fields) {
                        schema[`${field}`] = cb(field);
                  }

                  return schema;
            }

            return { getJoiSchema, getJoiSchemas };
      }

      public joiErrorMapper(err: ValidationError) {
            const errorObj = {};
            for (const item of err.details) {
                  errorObj[item.context.key] = this.localesService.mapJoiError(item.type, item.context);
            }

            return errorObj;
      }
}

export const validatorService = new ValidatorService(new LocalesService());
