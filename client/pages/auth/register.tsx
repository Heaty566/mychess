import * as React from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import SeoHead from '../../components/common/seoHead';
import TextField from '../../components/form/textField';
import SideLink from '../../components/link/sidelink';
import routers from '../../common/constants/router';
import BtnForm from '../../components/btn/btnForm';
import LoginSocial from '../../components/form/loginSocial';
import { RootState, store } from '../../store';
import authApi from '../../api/auth';

import { UserLoginDto, UserRegisterDto } from '../../api/auth/dto';
import { IApiState } from '../../store/api/interface';
import WaveLoading from '../../components/loading/waveLoading';
import useFormError from '../../common/hooks/useFormError';

const defaultValues: UserRegisterDto = {
    name: '',
    password: '',
    username: '',
    confirmPassword: '',
};

const Register: React.FunctionComponent = () => {
    const { register, handleSubmit } = useForm<UserRegisterDto>({ defaultValues });
    const apiState = useSelector<RootState, IApiState>((state) => state.api);
    const errors = useFormError<UserRegisterDto>(defaultValues);

    const onSubmit = (data: UserRegisterDto) => store.dispatch(authApi.registerUser(data));

    return (
        <>
            <SeoHead title="Login" description="he" canonical="/" />
            <div className="flex-1 chess-bg grid place-items-center grid-rows-max shadow-sm">
                <form className="bg-gray-800 px-4 md:px-10 py-16 w-full max-w-md rounded-sm fade-in " onSubmit={handleSubmit(onSubmit)}>
                    <h1 className="text-center text-4xl text-white mb-7">Register Account</h1>
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
                    <p className="text-center my-4 text-mercury">Or continue with</p>
                    <LoginSocial />
                </form>
            </div>
        </>
    );
};
export default Register;
