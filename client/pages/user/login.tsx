import Link from "next/link";
import * as React from "react";

import Btn from "../../components/btn";
import LoginSocial from "../../components/form/loginSocial";
import TextField from "../../components/form/textField";
import TextFieldPassword from "../../components/form/textFieldPassword";
import { ROUTER } from "../../constant/routerConstant";
import { seoHead } from "../../helper/seoHead";
import { translate } from "../../helper/i18n.helper";
import FormBottomLink from "../../components/form/common/FormBottomLink";
import FormTitle from "../../components/form/common/formTitle";
import FormSideLink from "../../components/form/common/FormSideLink";

const LoginUser: React.FunctionComponent = () => {
        return (
                <>
                        {seoHead({
                                title: "login",
                                isIndexPage: false,
                                isFollowPage: false,
                                canonical: ROUTER.login.url,
                                description: ROUTER.login.label,
                        })}
                        <div className="w-full  grid place-items-center">
                                <main className="w-352 bg-warmGray-700 px-8 py-16 rounded-sm">
                                        <form className="mb-6">
                                                <FormTitle label="sign in" />
                                                <TextField
                                                        name="username"
                                                        label="username"
                                                        register={() => console.log("hello")}
                                                        error=""
                                                        customStyle="mb-4"
                                                />
                                                <TextFieldPassword
                                                        name="password"
                                                        label="password"
                                                        register={() => console.log("hello")}
                                                        error=""
                                                        customStyle="mb-4"
                                                />
                                                <div className="text-right mb-4">
                                                        <FormSideLink label="forgot your password" url={ROUTER.forgotPassword.url} />
                                                </div>
                                                <Btn label="login" />
                                        </form>
                                        <p className="text-sm text-white capitalize mb-3 text-center">{translate("or log in with")}</p>

                                        <LoginSocial />

                                        <FormBottomLink label="create a MyGame account" labelLink="sign up here" url={ROUTER.register.url} />
                                </main>
                        </div>
                </>
        );
};

export default LoginUser;
