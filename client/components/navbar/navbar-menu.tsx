import * as React from 'react';
import Link from 'next/link';

import { navbarMenuConfig } from './config';

export interface NavbarMenuProps {}

const NavbarMenu: React.FunctionComponent<NavbarMenuProps> = () => (
    <ul className=" hidden space-x-3.5 md:flex" id="navbar-menu">
        {navbarMenuConfig.map((item) => (
            <li key={item.label}>
                <Link href={item.link}>
                    <a href={item.link} className="duration-300 text-cloud hover:text-cloud-50">
                        {item.label}
                    </a>
                </Link>
            </li>
        ))}
        <a href="https://github.com/Heaty566/mychess" className="duration-300 text-cloud hover:text-cloud-50">
            ABOUT US
        </a>
    </ul>
);

export default NavbarMenu;
