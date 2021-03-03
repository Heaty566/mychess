import * as React from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ROUTER } from "../../constant/routerConstant";
import { MyGameLogoIcon } from "./common/icon";
import NavbarItem from "./navbarItem";
import NavbarMobile from "./navbarMobile";
import { useClickOutSide } from "../../hooks/useClickOutSide";

export interface NavbarProps {}

const Navbar: React.FunctionComponent<NavbarProps> = () => {
        const [isActive, setActive] = useState<boolean>(false);
        const mobileNavRegister = useClickOutSide<HTMLDivElement>({ callBackOutside: () => setActive(false), exceptElement: ["navbar-inside"] });

        return (
                <div className="flex justify-between items-center  h-12 w-full px-4 shadow-lg bg-gray-100 relative sm:flex-col sm:items-start sm:w-88 sm:h-full sm:py-8  ">
                        {/* Main Logo -------------- Start */}

                        <div className="grid place-items-center sm:mb-4 sm:w-full">
                                <Link href={ROUTER.home.url}>
                                        <a title={ROUTER.home.label} aria-label={ROUTER.home.label}>
                                                {MyGameLogoIcon}
                                        </a>
                                </Link>
                        </div>
                        <NavbarMobile isActive={isActive} setActive={() => setActive(!isActive)} register={mobileNavRegister} />
                        {/* Main Logo -------------- End */}
                        <div
                                className={`block w-full absolute top-full origin-top transform duration-300 bg-gray-100 left-0 sm:flex-1 navbar-inside  sm:flex sm:flex-col  sm:static pb-4 sm:pb-0 sm:transform-none  ${
                                        isActive ? "scale-y-100" : "scale-y-0"
                                }`}
                        >
                                <div className="h-0.5 bg-gray-700 "></div>
                                {/* Center Navbar -------------- Start*/}
                                <div className="flex-1 pt-4 sm:pt-0">
                                        <nav>
                                                <h1 className="screen_reader">Our games</h1>
                                                <ul>
                                                        <NavbarItem
                                                                label="tic tac toe"
                                                                icon="XTicTacToeIcon"
                                                                url={ROUTER.ticTacToe.url}
                                                                customStyle="text-blue-600"
                                                                handleOnClickItem={() => setActive(false)}
                                                        />
                                                </ul>
                                        </nav>
                                </div>
                                {/* Center Navbar -------------- End*/}
                                <div className="h-0.5 bg-gray-700 hidden sm:block"></div>
                                {/* Bottom Navbar -------------- Start*/}
                                <div className="">
                                        <nav>
                                                <h1 className="screen_reader">User</h1>
                                                <ul>
                                                        <NavbarItem
                                                                label="login"
                                                                icon="LoginUserIcon"
                                                                url={ROUTER.login.url}
                                                                handleOnClickItem={() => setActive(false)}
                                                        />
                                                        <NavbarItem
                                                                label="register"
                                                                icon="RegisterUserIcon"
                                                                url={ROUTER.register.url}
                                                                handleOnClickItem={() => setActive(false)}
                                                        />
                                                </ul>
                                        </nav>
                                </div>
                                {/* Bottom Navbar -------------- End*/}
                        </div>
                </div>
        );
};

export default Navbar;
