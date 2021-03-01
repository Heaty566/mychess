import * as React from "react";
import Link from "next/link";
import { ROUTER } from "../../constant/routerConstant";
import { MyGameLogoIcon } from "./common/icon";
import NavbarItem from "./navbarItem";

export interface NavbarProps {}

const Navbar: React.FunctionComponent<NavbarProps> = () => {
        return (
                <div className="w-48 shadow-lg bg-gray-100 px-4 py-8 flex flex-col">
                        {/* Main Logo -------------- Start */}
                        <div className="mb-4  flex justify-center items-center">
                                <Link href={ROUTER.home.url}>
                                        <a title={ROUTER.home.label} aria-label={ROUTER.home.label}>
                                                {MyGameLogoIcon}
                                        </a>
                                </Link>
                        </div>
                        {/* Main Logo -------------- End */}
                        <div className="h-0.5 bg-gray-700"></div>
                        {/* Center Navbar -------------- Start*/}
                        <div className="flex-1">
                                <nav>
                                        <h1 className="screen_reader">Our games</h1>
                                        <ul>
                                                <NavbarItem
                                                        label="Tic Tac Toe"
                                                        icon="XTicTacToeIcon"
                                                        url={ROUTER.ticTacToe.url}
                                                        customStyle="text-blue-600"
                                                />
                                        </ul>
                                </nav>
                        </div>
                        {/* Center Navbar -------------- End*/}
                        <div className="h-0.5 bg-gray-700"></div>
                        {/* Bottom Navbar -------------- Start*/}
                        <div>
                                <nav>
                                        <h1 className="screen_reader">User</h1>
                                        <ul>
                                                <NavbarItem label="Login" icon="LoginUserIcon" url={ROUTER.login.url} />
                                                <NavbarItem label="Register" icon="RegisterUserIcon" url={ROUTER.register.url} />
                                        </ul>
                                </nav>
                        </div>
                        {/* Bottom Navbar -------------- End*/}
                </div>
        );
};

export default Navbar;
