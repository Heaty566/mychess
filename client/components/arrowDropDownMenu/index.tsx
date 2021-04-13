import * as React from 'react';

import DropdownIcons from '../../public/asset/icons/navbar-dropdown.svg';

export interface ArrowDropDownMenuProps {
    dropMenuPosition: 'left-0' | 'right-0';
    Component: JSX.Element;
    isOpen: boolean;
    setOpen: () => void;
}

const ArrowDropDownMenu: React.FunctionComponent<ArrowDropDownMenuProps> = ({
    dropMenuPosition = 'left-0',
    children,
    Component,
    isOpen = false,
    setOpen = () => {},
}) => {
    return (
        <div className="relative">
            <div className="relative flex items-center cursor-pointer" onClick={() => setOpen()} aria-hidden>
                {children}
                <DropdownIcons />
            </div>
            <div
                className={` absolute top-full ${dropMenuPosition}  shadow-menu z-20 duration-300 ${
                    isOpen ? 'visible opacity-100 ' : ' invisible opacity-0'
                }`}
            >
                {Component}
            </div>
        </div>
    );
};

export default ArrowDropDownMenu;
