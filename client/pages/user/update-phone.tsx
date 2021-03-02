import * as React from "react";
import Btn from "../../components/btn";
import TextField from "../../components/form/textField";
import { ROUTER } from "../../constant/routerConstant";
import { seoHead } from "../../helper/seoHead";
import { translate } from "../../helper/i18n.helper";
import { capitalizeFirst } from "../../helper/capitalize";

const UpdatePhoneNumber: React.FunctionComponent = () => {
        return (
                <>
                        {seoHead({
                                title: "update phone number",
                                isIndexPage: false,
                                isFollowPage: false,
                                canonical: ROUTER.updatePhone.url,
                                description: ROUTER.updatePhone.label,
                        })}
                        <div className="w-full  grid place-items-center">
                                <main className=" bg-warmGray-700 px-8 py-16 rounded-sm">
                                        <form className="mb-6 max-w-sm">
                                                <h1 className="text-3xl text-center font-bold test mb-4 text-white">
                                                        {translate("update phone number")}
                                                </h1>
                                                <p className="text-sm text-white  my-9 font-thin ">
                                                        {capitalizeFirst(translate("please enter your phone number")) +
                                                                ". " +
                                                                capitalizeFirst(translate("we will send you OTP code"))}
                                                </p>
                                                <TextField
                                                        name="phone"
                                                        label="phone number"
                                                        register={() => console.log("hello")}
                                                        error=""
                                                        customStyle="mb-4"
                                                />

                                                <Btn label="send to phone" />
                                        </form>
                                </main>
                        </div>
                </>
        );
};

export default UpdatePhoneNumber;
