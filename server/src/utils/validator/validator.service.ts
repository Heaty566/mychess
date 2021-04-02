import * as Joi from 'joi';

export class ValidatorService {
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
}

export const validatorService = new ValidatorService();
