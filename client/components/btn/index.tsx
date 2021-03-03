import Link from "next/link";
import * as React from "react";
import { Dictionary, translate } from "../../helper/i18n.helper";

export interface BtnLinkProps {
        label: Dictionary;
        type?: "submit" | "button" | "link";
        link?: string;
        func?(): void;
        customStyle?: string;
}

const Btn: React.FunctionComponent<BtnLinkProps> = ({ label, type = "submit", link = "", func, customStyle }) => {
        return type === "link" ? (
                <Link href={link}>
                        <a
                                href={link}
                                type={type}
                                className={`bg-indigo-600 py-1.5 px-6  capitalize font-medium text-white rounded-sm w-full ${customStyle}`}
                        >
                                {translate({ content: label })}
                        </a>
                </Link>
        ) : (
                <button
                        type={type}
                        className={`bg-indigo-600 py-1.5 px-6  font-medium capitalize text-white rounded-sm w-full focus:outline-none hover:bg-indigo-500 duration-300 ${customStyle}`}
                        onClick={type === "button" ? func : null}
                >
                        {translate({ content: label })}
                </button>
        );
};

export default Btn;
