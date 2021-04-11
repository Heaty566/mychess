import * as React from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import SeoHead from '../../components/common/seoHead';
import routers from '../../common/constants/router';
import { RootState, store } from '../../store';
import { UserRegisterDto } from '../../api/auth/dto';
import { IApiState } from '../../store/api/interface';
import useFormError from '../../common/hooks/useFormError';
import { RouteGuard } from '../../common/HOC/routeGuard';
import authThunk from '../../store/auth/thunk';

import TextField from '../../components/form/textField';
import SideLink from '../../components/link/sidelink';
import BtnForm from '../../components/btn/btnForm';
import LoginSocial from '../../components/form/loginSocial';
import WaveLoading from '../../components/loading/waveLoading';
import MsgSuccess from '../../components/form/msgSuccess';
import { useTestId } from '../../test/helper/data-testId';

const defaultValues: UserRegisterDto = {
    name: '',
    password: '',
    username: '',
    confirmPassword: '',
};

export interface RegisterProps {}
const Register: React.FunctionComponent<RegisterProps> = () => {
    const { register, handleSubmit } = useForm<UserRegisterDto>({ defaultValues });
    const apiState = useSelector<RootState, IApiState>((state) => state.api);
    const errors = useFormError<UserRegisterDto>(defaultValues);

    const onSubmit = (data: UserRegisterDto) => store.dispatch(authThunk.registerUser(data));

    return (
        <>
            <SeoHead {...routers.register.header} />
            <div className="grid flex-1 shadow-sm chess-bg place-items-center grid-rows-max">
                <div className="w-full max-w-md px-4 py-16 bg-gray-800 rounded-sm md:px-10 fade-in ">
                    <form onSubmit={handleSubmit(onSubmit)} {...useTestId(`auth-register`)}>
                        <h1 className="text-4xl text-center text-white mb-7">Register Account</h1>
                        <MsgSuccess message={apiState.message} />
                        <div className="space-y-2">
                            <TextField name="name" label="Name" error={errors.name} register={register} type="text" />
                            <TextField name="username" label="Username" error={errors.username} register={register} type="text" />
                            <TextField name="password" label="Password" error={errors.password} register={register} type="password" />
                            <TextField
                                name="confirmPassword"
                                label="Confirm Password"
                                error={errors.confirmPassword}
                                register={register}
                                type="password"
                            />
                        </div>
                        <div className="mt-4 mb-7">
                            <SideLink label="Sign In Instead" position="text-right" href={routers.login.link} />
                        </div>
                        {apiState.isLoading ? <WaveLoading /> : <BtnForm label="Sign Up" />}
                    </form>
                    <p className="my-4 text-center text-mercury">Or continue with</p>
                    <LoginSocial />
                </div>
            </div>
        </>
    );
};

const RegisterRoute = (props: RegisterProps) => RouteGuard<RegisterProps>({ Component: Register, props: { ...props } });
export default RegisterRoute;
