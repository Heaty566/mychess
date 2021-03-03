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
                        <div className="w-full flex-1 flex justify-center items-center">
                                <main className="w-full h-full sm:h-auto sm:w-88 bg-warmGray-700 px-8 py-16 sm:rounded-sm fade-in">
                                        <form className="mb-6 max-w-sm">
                                                <FormTitle label="forgot your password" />
                                                <p className="text-sm text-white  my-9 font-thin ">
                                                        {translate({ content: "please enter your email address", capitalizeOption: "first" }) +
                                                                ", " +
                                                                translate({ content: "you will receive a link to reset your password" })}
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
const UpdatePhoneNumberRouter = (props: any) => RouterHOC({ Component: UpdatePhoneNumber, props: { ...props } });
export default UpdatePhoneNumberRouter;
