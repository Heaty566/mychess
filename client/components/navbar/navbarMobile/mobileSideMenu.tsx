import * as React from 'react';
import Link from 'next/link';

import routers from '../../../common/constants/router';
import navbarMenuConfig from '../navbarMenu/config';
import ArrowDropDownMenu from '../../arrowDropDownMenu';
import config from './config';
import NavbarLang from '../navbarLang';
import { AuthState } from '../../../store/auth/interface';

export interface MobileNavSideMenuProps {
    isActive: boolean;
    authState: AuthState;
    handleChangeLanguage: (data: any) => void;
    handleLogoutUser: () => void;
}

const MobileNavSideMenu: React.FunctionComponent<MobileNavSideMenuProps> = ({ isActive, handleChangeLanguage, authState, handleLogoutUser }) => {
    const [isOpenLanguage, setOpenLanguage] = React.useState(false);

    return (
        <div
            className={`md:hidden fixed w-64 bg-woodsmoke top-0 left-0 h-screen z-40 transform duration-300 shadow-menu ${
                isActive ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
            }`}
        >
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
                {config.map(
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
                        Component={<NavbarLang handleOnChangeLanguage={handleChangeLanguage} />}
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
        </div>
    );
};

export default MobileNavSideMenu;
