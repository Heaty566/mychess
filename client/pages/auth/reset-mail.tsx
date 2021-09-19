import * as React from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import SeoHead from '../../components/common/seoHead';
import routers from '../../common/constants/router';
import { RootState, store } from '../../store';
import { useTimer } from '../../common/hooks/useTimer';
import { ForgotPasswordEmailDto } from '../../common/interface/dto/auth.dto';
import { ApiState } from '../../common/interface/api.interface';
import useFormError from '../../common/hooks/useFormError';
import { apiActions } from '../../store/api';
import { authThunk } from '../../store/auth/thunk';
import { Form } from '../../components/form';

import BtnSideLink from '../../components/btn/btn-side-link';
import BtnForm from '../../components/btn/btn-form';
import WaveLoading from '../../components/loading/wave-loading';

import RouteProtectedWrapper from '../../common/HOC/routeProtectedWrapper';

const defaultValues: ForgotPasswordEmailDto = {
    email: '',
};

const ResetEmail: React.FunctionComponent = () => {
    const { register, handleSubmit } = useForm<ForgotPasswordEmailDto>({ defaultValues });
    const apiState = useSelector<RootState, ApiState>((state) => state.api);
    const errors = useFormError<ForgotPasswordEmailDto>(defaultValues);
    const [isSubmit, setIsSubmit] = React.useState(false);
    const [timer, isRunning, setTimerStatus] = useTimer(60, false);

    const onSubmit = (data: ForgotPasswordEmailDto) => {
        store.dispatch(authThunk.forgotPasswordByEmail(data));
        setIsSubmit(true);
        if (isSubmit) setTimerStatus(true);
    };

    const onReset = () => {
        store.dispatch(apiActions.resetState());
        setTimerStatus(false);
        setIsSubmit(false);
    };

    React.useEffect(() => {
        if (apiState.isError) setIsSubmit(false);
    }, [apiState.isError]);

    return (
        <RouteProtectedWrapper>
            <SeoHead {...routers.forgotPasswordEmail.header} />
            <div className="grid flex-1 shadow-sm chess-bg place-items-center grid-rows-max">
                <div className="w-full max-w-md px-4 py-12 bg-gray-800 rounded-sm md:px-10 fade-in ">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <h1 className="text-4xl text-center text-white mb-7">Reset Password</h1>
                        <Form.LabelMessage successMessage={apiState.message} errorMessage={apiState.errorMessage} />

                        <p className="py-2 text-mercury-800">
                            Please enter your email address. you will receive a link to create a new password via email.
                        </p>

                        {isSubmit && !apiState.isError && (
                            <>
                                {/* ------------ Resend email start ------------------- */}
                                <div className="flex space-x-2 ">
                                    <p className="text-mercury-800">Send me an another email.</p>
                                    {!isRunning ? (
                                        <button className="text-white duration-300 hover:text-malibu focus:outline-none">Click Here</button>
                                    ) : (
                                        <p className="text-white">{timer}s</p>
                                    )}
                                </div>
                                {/* ------------ Resend email end ------------------- */}
                            </>
                        )}
                        {!isSubmit && (
                            <>
                                <div className="space-y-2">
                                    <Form.TextField name="email" label="Email" error={errors.email} register={register} type="text" />
                                </div>
                            </>
                        )}
                        <div className="mt-4 mb-4">
                            {apiState.isLoading ? (
                                <WaveLoading />
                            ) : isSubmit && !apiState.isError ? (
                                <BtnForm label="Change Another Email" type="button" handleOnClick={onReset} />
                            ) : (
                                <BtnForm label="Send An Email" />
                            )}
                        </div>
                    </form>
                    <div>
                        <BtnSideLink label="Or Reset By Phone Number?" position="text-center" href={routers.forgotPasswordPhone.link} />
                    </div>
                </div>
            </div>
        </RouteProtectedWrapper>
    );
};

export default ResetEmail;
