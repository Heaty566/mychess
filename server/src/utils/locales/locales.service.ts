import * as i18n from 'i18n';
import { ValidationError } from 'joi';
import { ResponseBody, ServerResponse } from '../../app/interface/api.interface';

import baseLocales from './dictionaries/en.json';
export type Dictionary = keyof typeof baseLocales;

export class LocalesService {
      /**
       *
       * @param content if the dictionary does not know your content, please add it in file ("en.json")
       * @description translate content to different languages base on dictionary files
       */
      public translate(content: Dictionary, context?: i18n.Replacements) {
            const newStr = i18n.__(content, { ...context });

            return newStr;
      }

      /**
       * @description translate joi error message to different languages
       */
      public translateResponse<T>(res: ResponseBody<T>) {
            const formatApi: ServerResponse<T> = {
                  details: {},
                  data: res.data,
            };

            if (res.details)
                  for (const item in res.details) {
                        formatApi.details[item] = this.translate(res.details[item].type, { ...res.details[item].context });
                  }

            return formatApi;
      }

      /**
       * @description translate joi error message to different languages
       */
      static mapJoiError(errors: ValidationError) {
            const errorObj = {};
            for (const item of errors.details) errorObj[item.context.key] = { type: item.type, context: item.context };

            return errorObj;
      }
}
