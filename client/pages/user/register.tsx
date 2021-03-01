import Link from "next/link";
import * as React from "react";

import LoginSocial from "../../components/form/loginSocial";
import Btn from "../../components/btn";
import TextFieldPassword from "../../components/form/textFieldPassword";
import TextField from "../../components/form/textField";
import { ROUTER } from "../../constant/routerConstant";
import { seoHead } from "../../helper/seoHead";
import { translate } from "../../helper/i18n.helper";

const RegisterUser: React.FunctionComponent = () => {
        return (
                <>
                        {seoHead({
                                title: "Register",
                                isIndexPage: false,
                                isFollowPage: false,
                                canonical: ROUTER.register.url,
                                description: ROUTER.register.label,
                        })}
                        <div className="w-full  grid place-items-center">
                                <main className="w-352 bg-scarpa-flow-500 px-8 py-16 rounded-sm">
                                        <form className="mb-6">
                                                <h1 className="text-4xl text-center font-bold test mb-4 text-white">{translate("Sign Up")}</h1>
                                                <TextField
                                                        name="name"
                                                        label="Name"
                                                        register={() => console.log("hello")}
                                                        error=""
                                                        customStyle="mb-4"
                                                />
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
                                                <TextFieldPassword
                                                        name="confirmPassword"
                                                        label="Confirm Password"
                                                        register={() => console.log("hello")}
                                                        error=""
                                                        customStyle="mb-4"
                                                />

                                                <Btn label="Register" />
                                        </form>
                                        <p className="text-sm text-white  mb-3 text-center">{translate("Or Log In With")}</p>

                                        <LoginSocial />

                                        <div className="mt-6 text-center">
                                                <p className="text-white text-sm font-thin ">
                                                        {translate("You have your own account?")}
                                                        <Link href={ROUTER.login.url}>
                                                                <a className="font-medium ml-1 hover:text-indigo-200  duration-300">
                                                                        {translate("Sign In Here")}{" "}
                                                                </a>
                                                        </Link>
                                                </p>
                                        </div>
                                </main>
                        </div>
                </>
        );
};

export default RegisterUser;
