import * as React from "react";
import { InvisibleIcon, VisibleIcon } from "./icons";
import { Dictionary, translate } from "../../../helper/i18n.helper";
export interface TextFieldProps {
        label: Dictionary;
        placeHolder?: string;
        name: string;
        register: Function;
        error: string;
        customStyle?: string;
}

const TextFieldPassword: React.FunctionComponent<TextFieldProps> = ({ label, placeHolder = "", name, register, error = "", customStyle = "" }) => {
        const [isVisible, setVisible] = React.useState<boolean>(false);

        return (
                <div className={customStyle}>
                        <label htmlFor={name} className="font-semibold capitalize text-white">
                                {translate({ content: label })}
                        </label>
                        <div className="relative">
                                <input
                                        placeholder={placeHolder}
                                        name={name}
                                        autoComplete="off"
                                        id={name}
                                        type={isVisible ? "text" : "password"}
                                        ref={(value) => register(value)}
                                        className="rounded-sm bg-white block px-2 py-1 focus:outline-none w-full  pr-9"
                                />
                                <span
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                        onClick={() => setVisible(!isVisible)}
                                >
                                        {isVisible ? VisibleIcon : InvisibleIcon}
                                </span>
                        </div>

                        {error.length !== 0 && (
                                <p className="text-sm font-medium text-torch-red-500 capitalize-first fade-in">
                                        {translate({ content: label }) + " " + error}
                                </p>
                        )}
                </div>
        );
};

export default TextFieldPassword;
