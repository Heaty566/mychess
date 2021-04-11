import Link from 'next/link';
import * as React from 'react';
import Cookies from 'universal-cookie';

import LogoIcons from '../../public/asset/icons/navbar-logo.svg';
import LogoMdIcons from '../../public/asset/icons/navbar-logo-md.svg';

import router from '../../common/constants/router';
import NavbarMenu from './navbarMenu';
import NavbarUser from './navbarUser';
import NavbarMobile from './navbarMobile';
import { useSelector } from 'react-redux';
import { RootState, store } from '../../store';
import { IAuthState } from '../../store/auth/interface';
import authThunk from '../../store/auth/thunk';

const Navbar: React.FunctionComponent = () => {
    const [isOpenSideMenu, setIsOpenSideMenu] = React.useState(true);

    const authState = useSelector<RootState, IAuthState>((api) => api.auth);

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
                    <a href={router.home.link}>
                        <div className="hidden mr-14 md:block ">
                            <LogoIcons />
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
