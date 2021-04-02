import * as React from 'react';
import DropdownIcons from '../../../public/asset/icons/navbar-dropdown.svg';
import config from './config';

export type THandleChangeLanguage = (keyLang: string) => void;

export interface NavbarLangProps {
        isActive: boolean;
        handleChangeActive(): void;
        handleChangeLanguage: THandleChangeLanguage;
        dropMenuPosition: 'left-0' | 'right-0';
}

const NavbarLang: React.FunctionComponent<NavbarLangProps> = ({
        handleChangeActive,
        handleChangeLanguage,
        dropMenuPosition: menuPosition = 'left-0',
        isActive = false,
}) => (
        <div className="relative">
                <div
                        className="flex items-center relative cursor-pointer"
                        onClick={() => handleChangeActive()}
                        aria-hidden
                >
                        <span className="mr-1 duration-300 hover:text-cloud-50">Language</span>
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
                                                        className="py-2 px-4 duration-300 hover:bg-woodsmoke-400 cursor-pointer capitalize"
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
