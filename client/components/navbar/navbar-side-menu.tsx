import * as React from 'react';
import Link from 'next/link';

import routers from '../../common/constants/router';
import { navbarMenuConfig } from './config';
import ArrowDropDownMenu from '../menu/menu-arrow-dropdown';
import { navbarMobileConfig } from './config';
import NavbarLanguage from './navbar-language';
import { AuthState } from '../../common/interface/user.interface';
import { SideMenu } from '../../components/menu/menu-side';

export interface MobileNavSideMenuProps {
    isActive: boolean;
    authState: AuthState;
    handleChangeLanguage: (data: any) => void;
    handleLogoutUser: () => void;
}

const NavbarSideMenu: React.FunctionComponent<MobileNavSideMenuProps> = ({ isActive, handleChangeLanguage, authState, handleLogoutUser }) => {
    const [isOpenLanguage, setOpenLanguage] = React.useState(false);

    return (
        <SideMenu isActive={isActive}>
            <ul className="text-cloud">
                {authState.isLogin && (
                    <li>
                        <Link href={`${routers.userProfile.link}/${authState.id}`}>
                            <div className="flex items-center p-4 space-x-2 capitalize duration-300 cursor-pointer hover:text-white">
                                <img className="object-cover w-8 h-8" src={authState.avatarUrl} alt={authState.name} />
                                <a href={`${routers.userProfile.link}/${authState.id}`}>{authState.name}</a>
                            </div>
                        </Link>
                    </li>
                )}
                {navbarMenuConfig.map((item) => (
                    <li key={item.label} className="duration-300 hover:bg-woodsmoke-400">
                        <Link href={item.link}>
                            <a href={item.link} className="block p-4 ">
                                {item.label}
                            </a>
                        </Link>
                    </li>
                ))}
                {navbarMobileConfig.map(
                    (item) =>
                        item.isAppearOnLogin === authState.isLogin && (
                            <li key={item.label} className="duration-300 hover:bg-woodsmoke-400">
                                <Link href={item.link}>
                                    <a href={item.link} className="block p-4 ">
                                        {item.label}
                                    </a>
                                </Link>
                            </li>
                        ),
                )}

                <li className="p-4 uppercase duration-300 hover:bg-woodsmoke-400">
                    <ArrowDropDownMenu
                        Component={<NavbarLanguage handleOnChangeLanguage={handleChangeLanguage} />}
                        dropMenuPosition="left-0"
                        isOpen={isOpenLanguage}
                        setOpen={() => setOpenLanguage(!isOpenLanguage)}
                    >
                        <span className="mr-1 duration-300 hover:text-cloud-50">Language</span>
                    </ArrowDropDownMenu>
                </li>
                {authState.isLogin && (
                    <li className="p-4 uppercase duration-300 cursor-pointer hover:bg-woodsmoke-400">
                        <button onClick={() => handleLogoutUser()}>LOGOUT</button>
                    </li>
                )}
            </ul>
        </SideMenu>
    );
};

export default NavbarSideMenu;
