import { ValidationError } from 'joi';

export const errorMsg = (override?: Record<string, any>) => {
      return {
            'string.base': `should be a string`,
            'string.min': `should contain at least {#limit} characters`,
            'string.max': `should contain less than or equal {#limit} characters`,
            'string.alphanum': `should contain letters and numbers`,
            'string.email': `should be a valid email`,
            'string.pattern.base': `should follow pattern`,
            'number.base': `should be a number`,
            'number.min': `should be greater than or equal {#limit}`,
            'number.max': `should be less than or equal {#limit}`,
            'any.required': `is required`,
            'any.only': `should be match`,
            'string.empty': `should not be empty`,
            'boolean.base': `should be a boolean`,
            'array.length': 'should be length equal',
            ...override,
      };
};

export const JoiErrorMapper = (err: ValidationError) => {
      const errorObj = {};

      for (const item of err.details) {
            errorObj[item.context.key] = `${item.message}`;
      }

      return errorObj;
};

export type ObjError = { [key: string]: string };
