import * as React from "react";

export interface TextFieldProps {
        label: string;
        name: string;
        register;
}

const TextField: React.FunctionComponent<TextFieldProps> = ({ label, name, register }) => {
        return (
                <div className="flex flex-col mb-4 w-full">
                        <label htmlFor={name} className="text-white text-base font-semibold cursor-pointer">
                                {label}
                        </label>
                        <input
                                id={name}
                                name={name}
                                ref={register}
                                type="text"
                                className="w-full rounded-sm outline-none pl-2 text-sm text-black py-1"
                        />
                </div>
        );
};

export default TextField;
