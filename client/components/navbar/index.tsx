import Link from 'next/link';
import * as React from 'react';
import Cookies from 'universal-cookie';
import { useSelector } from 'react-redux';

import router from '../../common/constants/router';
import { RootState, store } from '../../store';
import { AuthState } from '../../common/interface/user.interface';
import { authThunk } from '../../store/auth/thunk';

import LogoDesktop from '../../public/asset/icons/navbar-logo';
import LogoMdIcons from '../../public/asset/icons/navbar-logo-md';
import NavbarMenu from './navbar-menu';
import NavbarUser from './navbar-user';
import NavbarMobile from './navbar-mobile';

const Navbar: React.FunctionComponent = () => {
    const [isOpenSideMenu, setIsOpenSideMenu] = React.useState(false);

    const authState = useSelector<RootState, AuthState>((api) => api.auth);

    const handleChangeLanguage = (langKey: string) => {
        const cookies = new Cookies();
        cookies.set('lang', langKey);
        window.location.reload();
    };

    const handleOnLogoutUser = () => store.dispatch(authThunk.logoutUser());

    return (
        <div className="relative flex items-center h-16 py-3 md:h-24 bg-woodsmoke justify-evenly navbar">
            <NavbarMobile
                authState={authState}
                handleChangeLanguage={handleChangeLanguage}
                isActive={isOpenSideMenu}
                handleLogoutUser={handleOnLogoutUser}
                handleChangeActive={() => setIsOpenSideMenu(!isOpenSideMenu)}
            />
            <div className="flex items-center">
                <Link href={router.home.link}>
                    <a href={router.home.link} className="inline-block ">
                        <div className="hidden mr-14 md:block ">
                            <LogoDesktop />
                        </div>
                        <div className="md:hidden">
                            <LogoMdIcons />
                        </div>
                        <h1 className="semantic">MyGame</h1>
                    </a>
                </Link>
                <NavbarMenu />
            </div>
            <NavbarUser authState={authState} handleLogoutUser={handleOnLogoutUser} handleChangeLanguage={handleChangeLanguage} />
        </div>
    );
};

export default Navbar;
