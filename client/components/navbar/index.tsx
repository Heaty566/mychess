import Link from 'next/link';
import * as React from 'react';
import Cookies from 'universal-cookie';

import LogoIcons from '../../public/asset/icons/navbar-logo.svg';
import LogoMdIcons from '../../public/asset/icons/navbar-logo-md.svg';

import { THandleChangeLanguage } from './navbarLang';
import router from '../../common/constants/router';
import NavbarMenu from './navbarMenu';
import NavbarUser from './navbarUser';
import NavbarMobile from './navbarMobile';

const Navbar: React.FunctionComponent = () => {
    const [isOpenSideMenu, setIsOpenSideMenu] = React.useState(false);
    const [langOpen, setOpenLang] = React.useState(false);

    const handleChangeLanguage: THandleChangeLanguage = (langKey: string) => {
        const cookies = new Cookies();
        cookies.set('lang', langKey);
        window.location.reload();
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
