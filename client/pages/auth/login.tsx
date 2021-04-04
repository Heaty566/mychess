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

import { UserLoginDto } from '../../api/auth/dto';
import { IApiState } from '../../store/api/interface';
import WaveLoading from '../../components/loading/waveLoading';
import useFormError from '../../common/hooks/useFormError';

const defaultValues: UserLoginDto = {
    password: '',
    username: '',
};

const Home: React.FunctionComponent = () => {
    const { register, handleSubmit } = useForm<UserLoginDto>({ defaultValues });
    const apiState = useSelector<RootState, IApiState>((state) => state.api);
    const errors = useFormError<UserLoginDto>(defaultValues);

    const onSubmit = (data: UserLoginDto) => store.dispatch(authApi.loginUser(data));

    return (
        <>
            <SeoHead title="Login" description="he" canonical="/" />
            <div className="flex-1 chess-bg grid place-items-center grid-rows-max shadow-sm">
                <form
                    className="bg-gray-800 px-4 md:px-10 py-12 w-full max-w-md rounded-sm fade-in "
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <h1 className="text-center text-4xl text-white mb-7">SIGN IN</h1>
                    <div className="space-y-2">
                        <TextField
                            name="username"
                            label="Username"
                            error={errors.username}
                            register={register}
                        />
                        <TextField
                            name="password"
                            label="Password"
                            error={errors.password}
                            register={register}
                        />
                    </div>
                    <div className="mt-4 mb-7">
                        <SideLink
                            label="Sign Up Instead"
                            position="text-right"
                            href={routers.register.link}
                        />
                    </div>
                    {apiState.isLoading ? <WaveLoading /> : <BtnForm label="Sign In" />}
                    <p className="text-center my-4 text-mercury">Or continue with</p>
                    <LoginSocial />
                </form>
            </div>
        </>
    );
};
export default Home;
