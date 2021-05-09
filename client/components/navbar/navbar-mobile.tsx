import * as React from 'react';

import NavbarSideMenu from './navbar-side-menu';
import NavbarMenuBtn from './navbar-menu-btn';
import { AuthState } from '../../common/interface/user.interface';

export interface NavbarMobileProps {
    handleChangeActive(): void;
    handleLogoutUser: () => void;
    handleChangeLanguage: any;
    isActive: boolean;
    authState: AuthState;
}

const NavbarMobile: React.FunctionComponent<NavbarMobileProps> = ({
    handleChangeActive,
    handleChangeLanguage,
    isActive = false,
    authState,
    handleLogoutUser,
}) => (
    <>
        <NavbarMenuBtn handleChangeActive={handleChangeActive} />
        <NavbarSideMenu isActive={isActive} handleChangeLanguage={handleChangeLanguage} authState={authState} handleLogoutUser={handleLogoutUser} />
        {isActive && <div className="fixed top-0 left-0 z-30 w-full h-screen" onClick={handleChangeActive} aria-hidden />}
    </>
);

export default NavbarMobile;
