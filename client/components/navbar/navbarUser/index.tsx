import * as React from 'react';
import Link from 'next/link';

import NavbarLang, { THandleChangeLanguage } from '../navbarLang';
import router from '../../../common/constants/router';
import { useTestId } from '../../../test/helper/data-testId';

export interface NavbarUserProps {
    isActiveLang: boolean;
    handleChangeActiveLang(): void;
    handleChangeLanguage: THandleChangeLanguage;
}

const NavbarUser: React.FunctionComponent<NavbarUserProps> = ({ handleChangeActiveLang, isActiveLang, handleChangeLanguage }) => (
    <ul className="items-center self-start hidden space-x-4 text-cloud md:flex ">
        <li>
            <Link href={router.login.link}>
                <a href={router.login.link} className="duration-300 hover:text-cloud-50" {...useTestId(`navbarUser-login`)}>
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
