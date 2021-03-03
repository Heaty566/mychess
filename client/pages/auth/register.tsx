import { useForm } from "react-hook-form";
import { RegisterUserDto } from "../../service/auth/dto";
import * as React from "react";
import { useEffect, useState } from "react";

import LoginSocial from "../../components/form/loginSocial";
import Btn from "../../components/btn";
import TextFieldPassword from "../../components/form/textFieldPassword";
import TextField from "../../components/form/textField";
import { ROUTER } from "../../constant/routerConstant";
import { store, RootState } from "../../store";
import { authActions } from "../../store/auth";
import { seoHead } from "../../helper/seoHead";
import { translate } from "../../helper/i18n.helper";
import FormBottomLink from "../../components/form/common/FormBottomLink";
import FormTitle from "../../components/form/common/formTitle";
import { useSelector } from "react-redux";
import { ApiState } from "../../store/api";
import { RouterHOC } from "../../HOC/routerHOC";

const defaultValues: RegisterUserDto = {
        username: "",
        password: "",
        confirmPassword: "",
        name: "",
};

const RegisterUser: React.FunctionComponent = () => {
        const { register, handleSubmit } = useForm<RegisterUserDto>({ defaultValues });
        const apiState = useSelector<RootState, ApiState>((state) => state.api);
        const [errors, setErrors] = useState<RegisterUserDto>(defaultValues);

        const handleOnSubmit = (data: RegisterUserDto) => store.dispatch(authActions.registerUser(data));

        useEffect(() => {
                const { isError, errorDetails } = apiState;

                if (isError) setErrors({ ...defaultValues, ...errorDetails });
                else setErrors(defaultValues);
        }, [apiState.isError]);

        return (
                <>
                        {seoHead({
                                title: "register",
                                isIndexPage: false,
                                isFollowPage: false,
                                canonical: ROUTER.register.url,
                                description: ROUTER.register.label,
                        })}
                        <div className="w-full flex-1 flex justify-center items-center">
                                <main className="w-full h-full sm:h-auto sm:w-88 bg-warmGray-700 px-8 py-16 sm:rounded-sm fade-in">
                                        <form className="mb-6" onSubmit={handleSubmit(handleOnSubmit)}>
                                                <FormTitle label="sign up" />
                                                <TextField name="name" label="name" register={register} error={errors.name} customStyle="mb-4" />
                                                <TextField
                                                        name="username"
                                                        label="username"
                                                        register={register}
                                                        error={errors.username}
                                                        customStyle="mb-4"
                                                />
                                                <TextFieldPassword
                                                        name="password"
                                                        label="password"
                                                        register={register}
                                                        error={errors.password}
                                                        customStyle="mb-4"
                                                />
                                                <TextFieldPassword
                                                        name="confirmPassword"
                                                        label="confirm password"
                                                        register={register}
                                                        error={errors.confirmPassword}
                                                        customStyle="mb-4"
                                                />

                                                <Btn label="register" />
                                        </form>
                                        <p className="text-sm text-white capitalize mb-3 text-center">{translate({ content: "or log in with" })}</p>

                                        <LoginSocial />

                                        <FormBottomLink label="you have your own account" labelLink="sign in here" url={ROUTER.login.url} />
                                </main>
                        </div>
                </>
        );
};

const RegisterUserRouter = (props: any) => RouterHOC({ Component: RegisterUser, props: { ...props } });
export default RegisterUserRouter;
