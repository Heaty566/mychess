import * as i18n from 'i18n';
import { ValidationError } from 'joi';

import baseLocales from './dictionaries/en.json';

export type Dictionary = keyof typeof baseLocales;
export class LocalesService {
      /**
       *
       * @param content if the dictionary does not know your content, please add it in file ("en.json")
       * @description translate content to different languages base on dictionary files
       */
      public translate(content: Dictionary, context?: i18n.Replacements) {
            return i18n.__(content, { ...context }) as Dictionary;
      }

      /**
       * @description translate joi error message to different languages
       */
      static mapJoiError(errors: ValidationError) {
            const errorObj = {};
            for (const item of errors.details) {
                  errorObj[item.context.key] = i18n.__(item.type, { ...item.context });
            }

            return errorObj;
      }
}
