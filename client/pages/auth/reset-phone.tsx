import * as React from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import SeoHead from '../../components/common/seoHead';
import routers from '../../common/constants/router';
import { ForgotPasswordPhoneDto } from '../../common/interface/dto/auth.dto';
import { useTimer } from '../../common/hooks/useTimer';
import { ApiState } from '../../common/interface/api.interface';
import { RootState, store } from '../../store';
import useFormError from '../../common/hooks/useFormError';
import { apiActions } from '../../store/api';
import { Form } from '../../components/form';
import { authThunk } from '../../store/auth/thunk';

import BtnSideLink from '../../components/btn/btn-side-link';
import BtnForm from '../../components/btn/btn-form';
import WaveLoading from '../../components/loading/wave-loading';

import RouteProtectedWrapper from '../../common/HOC/routeProtectedWrapper';
import Link from 'next/link';

const defaultValues: ForgotPasswordPhoneDto = {
    phoneNumber: '',
};

const ResetPhone: React.FunctionComponent = () => {
    const { register, handleSubmit } = useForm<ForgotPasswordPhoneDto>({ defaultValues });
    const apiState = useSelector<RootState, ApiState>((state) => state.api);
    const errors = useFormError<ForgotPasswordPhoneDto>(defaultValues);
    const [isSubmit, setIsSubmit] = React.useState(false);
    const [timer, isDone, setTimerStatus] = useTimer(60, false);

    const onSubmit = (data: ForgotPasswordPhoneDto) => {
        store.dispatch(authThunk.forgotPasswordByPhone(data));
        setIsSubmit(true);
        if (isSubmit) setTimerStatus(true);
    };

    const onSendMore = () => {
        store.dispatch(apiActions.resetState());
        setTimerStatus(false);
        setIsSubmit(false);
    };

    React.useEffect(() => {
        if (apiState.isError) setIsSubmit(false);
    }, [apiState.isError]);

    return (
        <RouteProtectedWrapper>
            <SeoHead {...routers.forgotPasswordPhone.header} />
            <div className="grid flex-1 shadow-sm chess-bg place-items-center grid-rows-max">
                <div className="w-full max-w-md px-4 py-12 bg-gray-800 rounded-sm md:px-10 fade-in ">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <h1 className="text-4xl text-center text-white mb-7">Reset Password</h1>
                        <Form.LabelMessage successMessage={apiState.message} errorMessage={apiState.errorMessage} />
                        <p className="py-2 text-mercury-800">
                            Please enter your phone number, we will send an OTP code, This may take a little while and don't share it with others.
                        </p>

                        {isSubmit && !apiState.isError && (
                            <>
                                {/* ------------ Resend OTP start ------------------- */}
                                <div className="flex space-x-2 ">
                                    <p className="text-mercury-800">Send me an another OTP.</p>
                                    {!isDone ? (
                                        <button className="text-white duration-300 hover:text-malibu focus:outline-none">Click Here</button>
                                    ) : (
                                        <p className="text-white">{timer}s</p>
                                    )}
                                </div>
                                <Link href={routers.resetPassword.link}>
                                    <a href={routers.resetPassword.link} className="text-white duration-300 hover:text-malibu">
                                        Click Here To Enter Your OTP
                                    </a>
                                </Link>
                                {/* ------------ Resend OTP end ------------------- */}
                            </>
                        )}
                        {!isSubmit && (
                            <>
                                <div className="space-y-2">
                                    <Form.TextField
                                        name="phoneNumber"
                                        label="Phone Number"
                                        error={errors.phoneNumber}
                                        register={register}
                                        type="text"
                                    />
                                </div>
                            </>
                        )}
                        <div className="mt-4 mb-4">
                            {apiState.isLoading ? (
                                <WaveLoading />
                            ) : isSubmit && !apiState.isError ? (
                                <BtnForm label="Change Another Phone Number" type="button" handleOnClick={onSendMore} />
                            ) : (
                                <BtnForm label="Send An OTP" />
                            )}
                        </div>
                    </form>
                    <div>
                        <BtnSideLink label="Or Reset By Email?" position="text-center" href={routers.forgotPasswordEmail.link} />
                    </div>
                </div>
            </div>
        </RouteProtectedWrapper>
    );
};

export default ResetPhone;
