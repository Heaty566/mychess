import * as i18n from 'i18n';
import Joi from 'joi';
import baseLocales from './dictionaries/en.json';

export type Dictionary = keyof typeof baseLocales;
export class LocalesService {
      /**
       *
       * @param content if the dictionary does not know your content, please add it in file ("en.json")
       */
      public translate(content: Dictionary, context?: Record<string, any>) {
            return i18n.__(content, { ...context }) as Dictionary;
      }

      public mapJoiError(type: string, context: Joi.Context) {
            return i18n.__(type, { ...context });
      }
}
