import * as React from 'react';
import Link from 'next/link';
import router from '../../../common/constants/router';

import NavbarLang, { THandleChangeLanguage } from '../navbarLang';

export interface NavbarUserProps {
    isActiveLang: boolean;
    handleChangeActiveLang(): void;
    handleChangeLanguage: THandleChangeLanguage;
}

const NavbarUser: React.FunctionComponent<NavbarUserProps> = ({ handleChangeActiveLang, isActiveLang, handleChangeLanguage }) => (
    <ul className="space-x-4 text-cloud items-center self-start  hidden md:flex ">
        <li>
            <Link href={router.login.link}>
                <a href={router.login.link} className="duration-300 hover:text-cloud-50">
                    Login
                </a>
            </Link>
        </li>
        <div className="h-3 w-0.5 bg-cloud" />
        <NavbarLang
            isActive={isActiveLang}
            handleChangeActive={handleChangeActiveLang}
            handleChangeLanguage={handleChangeLanguage}
            dropMenuPosition="right-0"
        />
    </ul>
);

export default NavbarUser;
