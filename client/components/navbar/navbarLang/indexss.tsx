import * as React from 'react';

import DropdownIcons from '../../../public/asset/icons/navbar-dropdown.svg';
import config from './config';

export type THandleChangeLanguage = (keyLang: string) => void;

export interface NavbarLangProps {
    isActive: boolean;
    handleChangeActive(): void;
    handleChangeLanguage: THandleChangeLanguage;
    dropMenuPosition: 'left-0' | 'right-0';
    Component: Function;
}

const NavbarLang: React.FunctionComponent<NavbarLangProps> = ({
    handleChangeActive,
    handleChangeLanguage,
    dropMenuPosition: menuPosition = 'left-0',
    isActive = false,
    Component,
}) => (
    <div className="relative">
        <div className="relative flex items-center cursor-pointer" onClick={() => handleChangeActive()} aria-hidden>
            <span className="mr-1 duration-300 hover:text-cloud-50">
                <Component />
            </span>
            <DropdownIcons />
        </div>
        <div
            className={`bg-woodsmoke absolute top-full ${menuPosition}  shadow-menu z-20 duration-300 ${
                isActive ? 'visible opacity-100 ' : ' invisible opacity-0'
            }`}
        >
            <ul>
                {config.map((item) => (
                    <li key={item.label}>
                        <div
                            className="px-4 py-2 capitalize duration-300 cursor-pointer hover:bg-woodsmoke-400"
                            onClick={() => {
                                handleChangeLanguage(item.key);
                                handleChangeActive();
                            }}
                            aria-hidden
                        >
                            {item.label}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

export default NavbarLang;
