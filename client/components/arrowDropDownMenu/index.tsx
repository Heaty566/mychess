import * as React from 'react';

import DropdownIcons from '../../public/asset/icons/navbar-dropdown.svg';

export interface ArrowDropDownMenuProps {
    dropMenuPosition: 'left-0' | 'right-0';
    Component: JSX.Element;
}

const ArrowDropDownMenu: React.FunctionComponent<ArrowDropDownMenuProps> = ({ dropMenuPosition = 'left-0', children, Component }) => {
    const [isOpen, setOpen] = React.useState(false);

    return (
        <div className="relative">
            <div className="relative flex items-center cursor-pointer" onClick={() => setOpen(!isOpen)} aria-hidden>
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
