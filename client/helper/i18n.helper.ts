import i18next, { TOptions } from "i18next";
import { translation } from "../locales/en.json";
import { capitalize, capitalizeFirst } from "./capitalize";

export type Dictionary = keyof typeof translation;

interface ITranslate {
        content: Dictionary;
        context?: TOptions;
        capitalizeOption?: "all" | "first" | "normal";
}

export function translate({ content, capitalizeOption = "normal", context }: ITranslate) {
        const newStr = i18next.t(content, { ...context });
        switch (capitalizeOption) {
                case "all":
                        return capitalize(newStr);
                case "first":
                        return capitalizeFirst(newStr);
                default:
                        return newStr;
        }
}
