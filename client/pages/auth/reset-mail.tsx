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

import { ForgotPasswordEmailDto } from '../../api/auth/dto';
import { IApiState } from '../../store/api/interface';
import WaveLoading from '../../components/loading/waveLoading';
import useFormError from '../../common/hooks/useFormError';

const defaultValues: ForgotPasswordEmailDto = {
    email: '',
};

const ResetEmail: React.FunctionComponent = () => {
    const { register, handleSubmit } = useForm<ForgotPasswordEmailDto>({ defaultValues });
    const apiState = useSelector<RootState, IApiState>((state) => state.api);
    const errors = useFormError<ForgotPasswordEmailDto>(defaultValues);
    const [isSubmit, setIsSubmit] = React.useState(false);

    const onSubmit = (data: ForgotPasswordEmailDto) => {
        store.dispatch(authApi.forgotPasswordCreate(data));
        setIsSubmit(isSubmit);
    };

    return (
        <>
            <SeoHead title="Reset Password" description="he" canonical="/" />
            <div className="flex-1 chess-bg grid place-items-center grid-rows-max shadow-sm">
                <form
                    className="bg-gray-800 px-4 md:px-10 py-12 w-full max-w-md rounded-sm fade-in "
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <h1 className="text-center text-4xl text-white mb-7">Reset Password</h1>
                    <p className="text-mercury-800 py-2">
                        Please enter your email, you will receive an mail to reset your password
                    </p>
                    {isSubmit && !apiState.isError && (
                        <>
                            <div className=" flex space-x-2">
                                <p className="text-mercury-800">Send me an another email.</p>
                                <button className="duration-300 hover:text-malibu text-white ">
                                    Click Here
                                </button>
                            </div>
                        </>
                    )}
                    {!isSubmit && (
                        <>
                            <div className="space-y-2">
                                <TextField
                                    name="email"
                                    label="Email"
                                    error={errors.email}
                                    register={register}
                                    type="text"
                                />
                            </div>
                        </>
                    )}
                    <div className="mt-4 mb-4">
                        {isSubmit && !apiState.isError ? (
                            <BtnForm
                                label="Change Another Email"
                                type="button"
                                handleOnClick={() => setIsSubmit(false)}
                            />
                        ) : apiState.isLoading ? (
                            <WaveLoading />
                        ) : (
                            <BtnForm label="Send An Email" />
                        )}
                    </div>

                    <div>
                        <SideLink
                            label="Or Reset By Phone Number?"
                            position="text-center"
                            href={routers.forgotPasswordPhone.link}
                        />
                    </div>
                </form>
            </div>
        </>
    );
};
export default ResetEmail;
