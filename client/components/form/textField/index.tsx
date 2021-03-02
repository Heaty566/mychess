import * as React from "react";
import { Dictionary, translate } from "../../../helper/i18n.helper";

export interface TextFieldProps {
        label: Dictionary;
        placeHolder?: string;
        name: string;
        register: Function;
        error: string;
        customStyle?: string;
}

const TextField: React.FunctionComponent<TextFieldProps> = ({ label, placeHolder = "", name, register, error = "", customStyle = "" }) => {
        return (
                <div className={customStyle}>
                        <label htmlFor={name} className="font-semibold text-white capitalize">
                                {translate(label)}
                        </label>
                        <input
                                placeholder={placeHolder}
                                name={name}
                                id={name}
                                ref={(value) => register(value)}
                                className="rounded-sm bg-white block px-2 py-1 focus:outline-none w-full "
                        />

                        {error.length !== 0 && (
                                <p className="text-sm font-medium text-torch-red-500 capitalize-first fade-in">{translate(label) + " " + error}</p>
                        )}
                </div>
        );
};

export default TextField;
