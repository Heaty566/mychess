import i18next, { TOptions } from "i18next";
import { translation } from "../locales/en.json";

export type Dictionary = keyof typeof translation;

export function translate(content: Dictionary, context?: TOptions) {
        return i18next.t(content, { ...context });
}
