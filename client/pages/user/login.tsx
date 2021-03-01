import Link from "next/link";
import * as React from "react";

import Btn from "../../components/btn";
import LoginSocial from "../../components/form/loginSocial";
import TextField from "../../components/form/textField";
import TextFieldPassword from "../../components/form/textFieldPassword";
import { ROUTER } from "../../constant/routerConstant";
import { seoHead } from "../../helper/seoHead";
import { translate } from "../../helper/i18n.helper";

const LoginUser: React.FunctionComponent = () => {
        return (
                <>
                        {seoHead({
                                title: "Login",
                                isIndexPage: false,
                                isFollowPage: false,
                                canonical: ROUTER.login.url,
                                description: ROUTER.login.label,
                        })}
                        <div className="w-full  grid place-items-center">
                                <main className="w-352 bg-scarpa-flow-500 px-8 py-16 rounded-sm">
                                        <form className="mb-6">
                                                <h1 className="text-4xl text-center font-bold test mb-4 text-white">{translate("Sign In")}</h1>
                                                <TextField
                                                        name="username"
                                                        label="Username"
                                                        register={() => console.log("hello")}
                                                        error=""
                                                        customStyle="mb-4"
                                                />
                                                <TextFieldPassword
                                                        name="password"
                                                        label="Password"
                                                        register={() => console.log("hello")}
                                                        error=""
                                                        customStyle="mb-4"
                                                />
                                                <div className="text-right mb-4">
                                                        <Link href={ROUTER.forgotPassword.url}>
                                                                <a
                                                                        href={ROUTER.forgotPassword.url}
                                                                        className="text-white text-sm font-thin hover:text-indigo-200  duration-300"
                                                                >
                                                                        {translate("Forgot Your Password?")}
                                                                </a>
                                                        </Link>
                                                </div>
                                                <Btn label="Login" />
                                        </form>
                                        <p className="text-sm text-white  mb-3 text-center">{translate("Or Log In With")}</p>

                                        <LoginSocial />

                                        <div className="mt-6 text-center">
                                                <p className="text-white text-sm font-thin ">
                                                        {translate("Create a MyGame account?")}
                                                        <Link href={ROUTER.register.url}>
                                                                <a className="font-medium ml-1 hover:text-indigo-200  duration-300">
                                                                        {translate("Sign Up here")}
                                                                </a>
                                                        </Link>
                                                </p>
                                        </div>
                                </main>
                        </div>
                </>
        );
};

export default LoginUser;
