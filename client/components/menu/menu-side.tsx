import * as React from 'react';

export interface MobileNavSideMenuProps {
    isActive: boolean;
}

export const SideMenu: React.FunctionComponent<MobileNavSideMenuProps> = ({ isActive, children }) => {
    return (
        <div
            className={`md:hidden fixed w-64 bg-woodsmoke top-0 left-0 h-screen z-40 transform duration-300 shadow-menu ${
                isActive ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
            }`}
        >
            {children}
        </div>
    );
};

export default SideMenu;
