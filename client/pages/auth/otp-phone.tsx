import * as React from "react";
import Btn from "../../components/btn";
import TextField from "../../components/form/textField";
import { ROUTER } from "../../constant/routerConstant";
import { seoHead } from "../../helper/seoHead";
import { translate } from "../../helper/i18n.helper";
import FormBottomLink from "../../components/form/common/FormBottomLink";
import FormTitle from "../../components/form/common/formTitle";

import UseTimer from "../../hooks/useTimer";

const OtpPhone: React.FunctionComponent = () => {
        const [time, isFinish, reset] = UseTimer({ resetTime: 60000, defaultStop: true });

        const handleOnClick = () => {
                reset();
        };
        return (
                <>
                        {seoHead({
                                title: "verify phone number",
                                isIndexPage: false,
                                isFollowPage: false,
                                canonical: ROUTER.verifyPhoneNumber.url,
                                description: ROUTER.verifyPhoneNumber.label,
                        })}
                        <div className="w-full  grid place-items-center">
                                <main className=" bg-warmGray-700 px-8 py-16 rounded-sm fade-in">
                                        <form className="mb-6 max-w-sm">
                                                <FormTitle label="verify phone number" />
                                                <p className="text-sm text-white  my-9 font-thin ">
                                                        {translate({
                                                                content: "an OTP has been sent to your phone, please check and click continue",
                                                                capitalizeOption: "first",
                                                        })}
                                                </p>
                                                <p className=" text-white  my-9 font-thin  ">
                                                        {translate({ content: "send an another OTP key in", capitalizeOption: "first" })}
                                                        {isFinish ? (
                                                                <button
                                                                        className="font-medium ml-1 hover:text-indigo-200 capitalize duration-300"
                                                                        type="button"
                                                                        onClick={handleOnClick}
                                                                >
                                                                        Send Again
                                                                </button>
                                                        ) : (
                                                                ` ${time}s`
                                                        )}
                                                </p>
                                                <TextField name="otp" label="OTP" register={() => {}} error="" customStyle="mb-4" />

                                                <Btn label="continue" />
                                        </form>
                                        <FormBottomLink
                                                label="change other phone number"
                                                labelLink="click here"
                                                url={ROUTER.forgotPasswordPhone.url}
                                        />
                                </main>
                        </div>
                </>
        );
};

export default OtpPhone;
