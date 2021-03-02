import * as React from "react";
import Btn from "../../components/btn";
import TextField from "../../components/form/textField";
import { ROUTER } from "../../constant/routerConstant";
import { seoHead } from "../../helper/seoHead";
import { translate } from "../../helper/i18n.helper";
import Link from "next/link";
import FormBottomLink from "../../components/form/common/FormBottomLink";
import FormTitle from "../../components/form/common/formTitle";
import { capitalizeFirst } from "../../helper/capitalize";

const UpdatePhoneNumber: React.FunctionComponent = () => {
        return (
                <>
                        {seoHead({
                                title: "forgot your password",
                                isIndexPage: false,
                                isFollowPage: false,
                                canonical: ROUTER.forgotPassword.url,
                                description: ROUTER.forgotPassword.label,
                        })}
                        <div className="w-full  grid place-items-center">
                                <main className=" bg-warmGray-700 px-8 py-16 rounded-sm">
                                        <form className="mb-6 max-w-sm">
                                                <FormTitle label="forgot your password" />
                                                <p className="text-sm text-white  my-9 font-thin ">
                                                        {capitalizeFirst(translate("please enter your email address")) +
                                                                ", " +
                                                                translate("you will receive a link to reset your password")}
                                                </p>
                                                <TextField
                                                        name="email"
                                                        label="email"
                                                        register={() => console.log("hello")}
                                                        error=""
                                                        customStyle="mb-4"
                                                />

                                                <Btn label="send to email" />
                                        </form>
                                        <FormBottomLink label="or phone verification" labelLink="click here" url={ROUTER.forgotPasswordPhone.url} />
                                </main>
                        </div>
                </>
        );
};

export default UpdatePhoneNumber;
