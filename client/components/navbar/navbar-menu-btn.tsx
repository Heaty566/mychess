import * as React from 'react';

export interface MobileNavBtnProps {
    handleChangeActive(): void;
}

const NavbarMenuBtn: React.FunctionComponent<MobileNavBtnProps> = ({ handleChangeActive }) => (
    <div className="absolute text-white transform -translate-y-1/2 cursor-pointer md:hidden left-4 top-1/2" onClick={handleChangeActive} aria-hidden>
        <div className="grid grid-cols-3 gap-1">
            <div className="w-2 h-2 bg-white" />
            <div className="w-2 h-2 bg-white" />
            <div className="w-2 h-2 bg-white" />
            <div className="w-2 h-2 bg-white" />
            <div className="w-2 h-2 bg-white" />
            <div className="w-2 h-2 bg-white" />
            <div className="w-2 h-2 bg-white" />
            <div className="w-2 h-2 bg-white" />
            <div className="w-2 h-2 bg-white" />
        </div>
    </div>
);

export default NavbarMenuBtn;
