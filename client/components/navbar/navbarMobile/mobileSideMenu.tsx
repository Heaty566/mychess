import * as React from 'react';
import Link from 'next/link';
import config from './config';
import NavbarLang, { THandleChangeLanguage } from '../navbarLang';

export interface MobileNavSideMenuProps {
    isActive: boolean;
    isActiveLang: boolean;
    handleChangeActiveLang(): void;
    handleChangeLanguage: THandleChangeLanguage;
}

const MobileNavSideMenu: React.FunctionComponent<MobileNavSideMenuProps> = ({
    isActive,
    isActiveLang,
    handleChangeActiveLang,
    handleChangeLanguage,
}) => (
    <div
        className={`md:hidden fixed w-64 bg-woodsmoke top-0 left-0 h-screen z-40 transform duration-300 shadow-menu ${
            isActive ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}
    >
        <ul className="text-cloud">
            {config.map((item) => (
                <li key={item.label} className="duration-300 hover:bg-woodsmoke-400">
                    <Link href={item.link}>
                        <a href={item.link} className="p-4 block  ">
                            {item.label}
                        </a>
                    </Link>
                </li>
            ))}
            <li className=" p-4 duration-300 hover:bg-woodsmoke-400 uppercase">
                <NavbarLang
                    isActive={isActiveLang}
                    handleChangeActive={handleChangeActiveLang}
                    handleChangeLanguage={handleChangeLanguage}
                    dropMenuPosition="left-0"
                />
            </li>
        </ul>
    </div>
);

export default MobileNavSideMenu;
