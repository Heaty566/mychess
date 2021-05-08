import * as React from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import SeoHead from '../../components/common/seoHead';
import routers from '../../common/constants/router';
import { UserLoginDto } from '../../common/interface/dto/auth.dto';
import { RootState, store } from '../../store';
import authThunk from '../../store/auth/thunk';
import { ApiState } from '../../common/interface/api.interface';
import useFormError from '../../common/hooks/useFormError';

import { RouteProtectedWrapper } from '../../common/HOC/routeProtectedWrapper';
import TextField from '../../components/form/filed-textfield';
import BtnSideLink from '../../components/btn/btn-side-link';
import BtnForm from '../../components/btn/btn-form';
import LoginSocial from '../../components/form/form-social-login';
import WaveLoading from '../../components/loading/wave-loading';
import LabelMessage from '../../components/form/label-message';

const defaultValues: UserLoginDto = {
    password: '',
    username: '',
};

export interface LoginProps {}
const Login: React.FunctionComponent<LoginProps> = () => {
    const { register, handleSubmit } = useForm<UserLoginDto>({ defaultValues });
    const apiState = useSelector<RootState, ApiState>((state) => state.api);
    const errors = useFormError<UserLoginDto>(defaultValues);

    const onSubmit = (data: UserLoginDto) => {
        store.dispatch(authThunk.loginUser(data));
    };

    return (
        <>
            <SeoHead {...routers.login.header} />
            <RouteProtectedWrapper>
                <div className="grid flex-1 shadow-sm chess-bg place-items-center grid-rows-max">
                    <div className="w-full max-w-md px-4 py-12 bg-gray-800 rounded-sm md:px-10 fade-in ">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <h1 className="text-4xl text-center text-white mb-7">Login Account</h1>
                            <LabelMessage successMessage={apiState.message} errorMessage={apiState.errorMessage} />
                            <div className="space-y-2">
                                <TextField name="username" label="Username" error={errors.username} register={register} type="text" />
                                <TextField name="password" label="Password" error={errors.password} register={register} type="password" />
                            </div>
                            <div className="mt-4 mb-7">
                                <BtnSideLink label="Sign Up Instead" position="text-right" href={routers.register.link} />
                            </div>

                            {apiState.isLoading ? <WaveLoading /> : <BtnForm label="Sign In" />}
                        </form>
                        <p className="my-4 text-center text-mercury">Or continue with</p>
                        <LoginSocial />
                        <div className="mt-4">
                            <BtnSideLink label="Forgot Your Password?" position="text-center" href={routers.forgotPasswordEmail.link} />
                        </div>
                    </div>
                </div>
            </RouteProtectedWrapper>
        </>
    );
};

export default Login;
