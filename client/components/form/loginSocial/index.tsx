import * as React from "react";
import * as Icons from "./icons";
import { translate, Dictionary } from "../../../helper/i18n.helper";
interface LoginSocialItem {
        label: Dictionary;
        url: string;
        icon: keyof typeof Icons;
}

const data: Array<LoginSocialItem> = [
        {
                label: "Continue with Google",
                icon: "GoogleIcon",
                url: "/auth/google",
        },
        {
                label: "Continue with Facebook",
                icon: "FacebookIcon",
                url: "/auth/facebook",
        },
        {
                label: "Continue with Github",
                icon: "GithubIcon",
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
                                                key={item.label}
                                                className={`font-medium text-white flex px-4 py-1.5 bg-blueGray-800 rounded-sm hover:bg-blueGray-700 duration-300 mb-3`}
                                        >
                                                <span className="mr-2">{Icons[item.icon]}</span>
                                                <p>{translate(item.label)}</p>
                                        </a>
                                );
                        })}
                </>
        );
};

export default LoginSocial;
