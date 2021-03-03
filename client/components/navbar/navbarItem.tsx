import Link from "next/link";
import * as React from "react";
import * as Icons from "./common/icon";
import { translate, Dictionary } from "../../helper/i18n.helper";

export interface NavbarItemProps {
        label: Dictionary;
        icon: keyof typeof Icons;
        url: string;
        customStyle?: string;
        handleOnClickItem(): void;
}

const NavbarItem: React.FunctionComponent<NavbarItemProps> = ({ label, icon, url, customStyle = "text-gray-700", handleOnClickItem }) => {
        return (
                <li className="my-1">
                        <Link href={url}>
                                <a
                                        className={`flex items-center font-bold duration-300 px-2 capitalize py-2 hover:bg-blue-100 navbar-inside ${customStyle}`}
                                        onClick={() => handleOnClickItem()}
                                >
                                        <span className="mr-2">{Icons[icon]}</span>
                                        {translate({ content: label })}
                                </a>
                        </Link>
                </li>
        );
};

export default NavbarItem;
