import * as React from 'react';

import MobileNavSideMenu from './mobileSideMenu';
import MobileNavBtn from './mobileNavBtn';
import { AuthState } from '../../../common/interface/user.interface';

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
        <MobileNavBtn handleChangeActive={handleChangeActive} />
        <MobileNavSideMenu
            isActive={isActive}
            handleChangeLanguage={handleChangeLanguage}
            authState={authState}
            handleLogoutUser={handleLogoutUser}
        />
        {isActive && <div className="fixed top-0 left-0 z-30 w-full h-screen" onClick={() => handleChangeActive()} aria-hidden />}
    </>
);

export default NavbarMobile;
