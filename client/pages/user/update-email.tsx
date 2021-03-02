import * as React from "react";
import Btn from "../../components/btn";
import TextField from "../../components/form/textField";
import { ROUTER } from "../../constant/routerConstant";
import { seoHead } from "../../helper/seoHead";
import { translate } from "../../helper/i18n.helper";
import { capitalizeFirst } from "../../helper/capitalize";
import FormTitle from "../../components/form/common/formTitle";
import { RouterHOC } from "../../HOC/routerHOC";

const UpdateEmail: React.FunctionComponent = () => {
        return (
                <>
                        {seoHead({
                                title: "update email",
                                isIndexPage: false,
                                isFollowPage: false,
                                canonical: ROUTER.updatePhone.url,
                                description: ROUTER.updatePhone.label,
                        })}
                        <div className="w-full  grid place-items-center">
                                <main className=" bg-warmGray-700 px-8 py-16 rounded-sm">
                                        <form className="mb-6 max-w-sm">
                                                <FormTitle label="update email" />
                                                <p className="text-sm text-white  my-9 font-thin ">
                                                        {translate({ content: "please enter your email address", capitalizeOption: "first" }) +
                                                                ". " +
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
                                </main>
                        </div>
                </>
        );
};

const UpdateEmailRouter = (props: any) => RouterHOC({ Component: UpdateEmail, props: { ...props }, isNeedLogin: true });
export default UpdateEmailRouter;
