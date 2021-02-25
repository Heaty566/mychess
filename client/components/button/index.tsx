import * as React from "react";

export interface ButtonProps {
        type: "button" | "submit" | "reset";
        label: string;
        handleClick?(): void;
}

const Button: React.FunctionComponent<ButtonProps> = ({ type, label, handleClick }) => {
        return (
                <button
                        type={type}
                        className="bg-indigo-600 hover:bg-indigo-500 py-1 text-md text-white focus:outline-none border-none rounded-sm"
                        onClick={handleClick}
                >
                        {label}
                </button>
        );
};

export default Button;
