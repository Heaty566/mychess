import * as React from "react";
import * as Icons from "./icons";
import { translate, Dictionary } from "../../../helper/i18n.helper";
interface LoginSocialItem {
        url: string;
        brand: "Google" | "Facebook" | "Github";
        icon: keyof typeof Icons;
}

const data: Array<LoginSocialItem> = [
        {
                icon: "GoogleIcon",
                brand: "Google",
                url: "/auth/google",
        },
        {
                icon: "FacebookIcon",
                url: "/auth/facebook",
                brand: "Facebook",
        },
        {
                icon: "GithubIcon",
                brand: "Github",
                url: "/auth/github",
        },
];

const LoginSocial: React.FunctionComponent = () => {
        return (
                <>
                        {data.map((item) => {
                                return (
                                        <a
                                                href={process.env.SERVER_URL + item.url}
                                                key={item.brand}
                                                className={`font-medium text-white flex px-4 py-1.5 capitalize bg-blueGray-800 rounded-sm hover:bg-blueGray-700 duration-300 mb-3`}
                                        >
                                                <span className="mr-2">{Icons[item.icon]}</span>
                                                <p>{translate("continue with") + " " + item.brand} </p>
                                        </a>
                                );
                        })}
                </>
        );
};

export default LoginSocial;
