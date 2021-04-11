import * as React from 'react';

import { THandleChangeLanguage } from '../navbarLang';
import MobileNavSideMenu from './mobileSideMenu';
import MobileNavBtn from './mobileNavBtn';

export interface NavbarMobileProps {
    handleChangeActive(): void;
    handleChangeActiveLang(): void;
    handleChangeLanguage: THandleChangeLanguage;
    isActive: boolean;
    isActiveLang: boolean;
}

const NavbarMobile: React.FunctionComponent<NavbarMobileProps> = ({
    handleChangeActive,
    handleChangeActiveLang,
    isActiveLang,
    handleChangeLanguage,
    isActive = false,
}) => (
    <>
        <MobileNavBtn handleChangeActive={handleChangeActive} />
        <MobileNavSideMenu
            handleChangeActiveLang={handleChangeActiveLang}
            isActive={isActive}
            isActiveLang={isActiveLang}
            handleChangeLanguage={handleChangeLanguage}
        />
        {isActive && <div className="fixed top-0 left-0 z-30 w-full h-screen" onClick={() => handleChangeActive()} aria-hidden />}
    </>
);

export default NavbarMobile;
