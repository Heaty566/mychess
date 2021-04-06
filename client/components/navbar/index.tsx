import Link from 'next/link';
import * as React from 'react';
import LogoIcons from '../../public/asset/icons/navbar-logo.svg';
import LogoMdIcons from '../../public/asset/icons/navbar-logo-md.svg';
import NavbarMenu from './navbarMenu';
import NavbarUser from './navbarUser';

import router from '../../common/constants/router';
import NavbarMobile from './navbarMobile';
import { THandleChangeLanguage } from './navbarLang';
import { IAuthState } from '../../store/auth/interface';
import { RootState, store } from '../../store';
import { useSelector } from 'react-redux';
import userApi from '../../api/user';

const Navbar: React.FunctionComponent = () => {
    const [isOpenSideMenu, setIsOpenSideMenu] = React.useState(false);
    const [langOpen, setOpenLang] = React.useState(false);
    const authState = useSelector<RootState, IAuthState>((state) => state.auth);
    const handleChangeLanguage: THandleChangeLanguage = (langKey: string) => {
        console.log(langKey);
    };

    return (
        <div className="h-16 md:h-24 bg-woodsmoke flex justify-evenly items-center py-3  relative ">
            <NavbarMobile
                isActiveLang={langOpen}
                handleChangeActiveLang={() => setOpenLang(!langOpen)}
                handleChangeLanguage={handleChangeLanguage}
                isActive={isOpenSideMenu}
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
            <NavbarUser isActiveLang={langOpen} handleChangeLanguage={handleChangeLanguage} handleChangeActiveLang={() => setOpenLang(!langOpen)} />
        </div>
    );
};

export default Navbar;
