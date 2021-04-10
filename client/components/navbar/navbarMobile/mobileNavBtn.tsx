import * as React from 'react';

export interface MobileNavBtnProps {
    handleChangeActive(): void;
}

const MobileNavBtn: React.FunctionComponent<MobileNavBtnProps> = ({ handleChangeActive }) => (
    <div
        className="md:hidden absolute left-4 top-1/2 transform -translate-y-1/2 text-white cursor-pointer"
        onClick={() => handleChangeActive()}
        aria-hidden
    >
        <div className="grid grid-cols-3 gap-1">
            <div className="h-2 w-2 bg-white" />
            <div className="h-2 w-2 bg-white" />
            <div className="h-2 w-2 bg-white" />
            <div className="h-2 w-2 bg-white" />
            <div className="h-2 w-2 bg-white" />
            <div className="h-2 w-2 bg-white" />
            <div className="h-2 w-2 bg-white" />
            <div className="h-2 w-2 bg-white" />
            <div className="h-2 w-2 bg-white" />
        </div>
    </div>
);

export default MobileNavBtn;
