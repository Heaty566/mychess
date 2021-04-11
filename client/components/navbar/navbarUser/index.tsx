import * as React from 'react';
import Link from 'next/link';

import NavbarLang, { THandleChangeLanguage } from '../navbarLang';
import router from '../../../common/constants/router';
import { useTestId } from '../../../test/helper/data-testId';
import { IAuthState } from '../../../store/auth/interface';
import Test from '../navbarLang/indexss';

export interface NavbarUserProps {
    isActiveLang: boolean;
    handleChangeActiveLang(): void;
    handleChangeLanguage: THandleChangeLanguage;
    authState: IAuthState;
}

const NavbarUser: React.FunctionComponent<NavbarUserProps> = ({ handleChangeActiveLang, isActiveLang, handleChangeLanguage, authState }) => (
    <ul className="items-center self-start hidden space-x-4 text-cloud md:flex ">
        {authState.isLogin ? (
            <Test
                isActive={isActiveLang}
                handleChangeActive={handleChangeActiveLang}
                handleChangeLanguage={handleChangeLanguage}
                dropMenuPosition="right-0"
                Component={() => (
                    <div className="flex items-center justify-center space-x-2">
                        <img src={authState.avatarUrl} alt={authState.name} className="object-cover h-8" />
                        <h1>{authState.name}</h1>
                    </div>
                )}
            />
        ) : (
            <li>
                <Link href={router.login.link}>
                    <a href={router.login.link} className="duration-300 hover:text-cloud-50" {...useTestId(`navbarUser-login`)}>
                        Login
                    </a>
                </Link>
            </li>
        )}
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
