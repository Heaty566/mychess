import { Dictionary } from '../../utils/locales/locales.service';

export interface JoiErrorItem {
      type: Dictionary;
      context?: Record<string, string>;
}
