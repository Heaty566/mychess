import * as React from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import SeoHead from '../../components/common/seoHead';
import routers from '../../common/constants/router';
import { UserLoginDto } from '../../api/auth/dto';
import { RootState, store } from '../../store';
import authThunk from '../../store/auth/thunk';
import { IApiState } from '../../store/api/interface';
import { RouteGuard } from '../../common/HOC/routeGuard';
import useFormError from '../../common/hooks/useFormError';
import { useTestId } from '../../test/helper/data-testId';

import TextField from '../../components/form/textField';
import SideLink from '../../components/link/sidelink';
import BtnForm from '../../components/btn/btnForm';
import LoginSocial from '../../components/form/loginSocial';
import WaveLoading from '../../components/loading/waveLoading';
import MsgSuccess from '../../components/form/msgSuccess';

const defaultValues: UserLoginDto = {
    password: '',
    username: '',
};

export interface LoginProps {}
const Login: React.FunctionComponent<LoginProps> = () => {
    const { register, handleSubmit } = useForm<UserLoginDto>({ defaultValues });
    const apiState = useSelector<RootState, IApiState>((state) => state.api);
    const errors = useFormError<UserLoginDto>(defaultValues);

    const onSubmit = (data: UserLoginDto) => store.dispatch(authThunk.loginUser(data));

    return (
        <>
            <SeoHead {...routers.login.header} />
            <div className="flex-1 chess-bg grid place-items-center grid-rows-max shadow-sm">
                <div className="bg-gray-800 px-4 md:px-10 py-12 w-full max-w-md rounded-sm fade-in ">
                    <form onSubmit={handleSubmit(onSubmit)} {...useTestId(`auth-login`)}>
                        <h1 className="text-center text-4xl text-white mb-7">Login Account</h1>
                        <MsgSuccess message={apiState.message} />
                        <div className="space-y-2">
                            <TextField name="username" label="Username" error={errors.username} register={register} type="text" />
                            <TextField name="password" label="Password" error={errors.password} register={register} type="password" />
                        </div>
                        <div className="mt-4 mb-7">
                            <SideLink label="Sign Up Instead" position="text-right" href={routers.register.link} />
                        </div>

                        {apiState.isLoading ? <WaveLoading /> : <BtnForm label="Sign In" />}
                    </form>
                    <p className="text-center my-4 text-mercury">Or continue with</p>
                    <LoginSocial />
                    <div className="mt-4">
                        <SideLink label="Forgot Your Password?" position="text-center" href={routers.forgotPasswordEmail.link} />
                    </div>
                </div>
            </div>
        </>
    );
};

const LoginRoute = (props: LoginProps) => RouteGuard<LoginProps>({ Component: Login, props: { ...props } });
export default LoginRoute;
