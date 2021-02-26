import Link from "next/link";
import * as React from "react";

const gameIcons = {
        caro: (
                <svg className="mr-2" width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                                d="M10.3228 1.17927C10.7821 0.720028 11.5266 0.720029 11.9859 1.17927C12.4451 1.63851 12.4451 2.38309 11.9859 2.84233L2.00753 12.8207C1.54829 13.2799 0.803711 13.2799 0.34447 12.8207C-0.114771 12.3614 -0.11477 11.6169 0.34447 11.1576L10.3228 1.17927Z"
                                fill="#2563EB"
                        />
                        <path
                                d="M11.9858 11.1576C12.4451 11.6169 12.4451 12.3615 11.9858 12.8207C11.5266 13.2799 10.782 13.2799 10.3228 12.8207L0.34443 2.84235C-0.114811 2.38311 -0.11481 1.63854 0.344431 1.1793C0.803671 0.720057 1.54825 0.720057 2.00749 1.1793L11.9858 11.1576Z"
                                fill="#2563EB"
                        />
                </svg>
        ),
};

type IconType = keyof typeof gameIcons;

export interface GameItemProps {
        link: string;
        label: string;
        icon: IconType;
}

const GameItem: React.FunctionComponent<GameItemProps> = ({ icon, label, link = "/" }) => {
        return (
                <Link href={link}>
                        <a className="flex items-center cursor-pointer w-full" href={link}>
                                {gameIcons[icon]}
                                <p className="text-base font-bold text-blue-600">{label}</p>
                        </a>
                </Link>
        );
};

export default GameItem;
