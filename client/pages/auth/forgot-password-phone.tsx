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
import { RouterHOC } from "../../HOC/routerHOC";

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
                                <main className=" bg-warmGray-700 px-8 py-16 rounded-sm fade-in">
                                        <form className="mb-6 max-w-sm">
                                                <FormTitle label="forgot your password" />
                                                <p className="text-sm text-white  my-9 font-thin ">
                                                        {capitalizeFirst(translate("please enter your phone number")) +
                                                                ". " +
                                                                translate("we will send you OTP code")}
                                                </p>
                                                <TextField
                                                        name="phoneNumber"
                                                        label="phone number"
                                                        register={() => console.log("hello")}
                                                        error=""
                                                        customStyle="mb-4"
                                                />

                                                <Btn label="send to phone" />
                                        </form>
                                        <FormBottomLink label="or email verification" labelLink="click here" url={ROUTER.forgotPassword.url} />
                                </main>
                        </div>
                </>
        );
};

const UpdatePhoneNumberRouter = (props: any) => RouterHOC({ Component: UpdatePhoneNumber, props: { ...props } });
export default UpdatePhoneNumberRouter;
