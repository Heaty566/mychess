import * as React from "react";

export interface NavbarMobileProps {
        isActive: boolean;
        setActive(): void;
        register: React.RefObject<HTMLDivElement>;
}

const NavbarMobile: React.FunctionComponent<NavbarMobileProps> = ({ isActive, setActive, register }) => {
        return (
                <div
                        className="box-border h-10 w-10 p-1  grid grid-cols-3 grid-rows-3  gap-1 cursor-pointer sm:hidden"
                        onClick={() => setActive()}
                        ref={register}
                >
                        <div className={`w-full h-full bg-black transform ${isActive ? "scale-0" : "scale-100"} duration-300`}></div>
                        <div className={`w-full h-full bg-black`}></div>
                        <div className={`w-full h-full bg-black`}></div>

                        <div className={`w-full h-full bg-black`}></div>
                        <div className={`w-full h-full bg-black`}></div>
                        <div className={`w-full h-full bg-black`}></div>

                        <div className={`w-full h-full bg-black`}></div>
                        <div className={`w-full h-full bg-black`}></div>
                        <div className={`w-full h-full bg-black transform   ${isActive ? "scale-0" : "scale-100"}  duration-300`}></div>
                </div>
        );
};

export default NavbarMobile;
