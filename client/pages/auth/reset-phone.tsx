import * as React from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import SeoHead from '../../components/common/seoHead';
import routers from '../../common/constants/router';
import { ForgotPasswordPhoneDto } from '../../api/auth/dto';
import { useTimer } from '../../common/hooks/useTimer';
import { IApiState } from '../../store/api/interface';
import { RootState, store } from '../../store';
import useFormError from '../../common/hooks/useFormError';
import { apiActions } from '../../store/api';
import { RouteGuard } from '../../common/HOC/routeGuard';
import authThunk from '../../store/auth/thunk';

import TextField from '../../components/form/textField';
import SideLink from '../../components/link/sidelink';
import BtnForm from '../../components/btn/btnForm';
import WaveLoading from '../../components/loading/waveLoading';

const defaultValues: ForgotPasswordPhoneDto = {
    phoneNumber: '',
};

const ResetPhone: React.FunctionComponent = () => {
    const { register, handleSubmit } = useForm<ForgotPasswordPhoneDto>({ defaultValues });
    const apiState = useSelector<RootState, IApiState>((state) => state.api);
    const errors = useFormError<ForgotPasswordPhoneDto>(defaultValues);
    const [isSubmit, setIsSubmit] = React.useState(false);
    const [timer, isDone, setTimerStatus] = useTimer(60, false);

    const onSubmit = (data: ForgotPasswordPhoneDto) => {
        store.dispatch(authThunk.forgotPasswordByPhone(data));
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
        <>
            <SeoHead title="Reset Password" description="he" canonical="/" />
            <div className="flex-1 chess-bg grid place-items-center grid-rows-max shadow-sm">
                <form className="bg-gray-800 px-4 md:px-10 py-12 w-full max-w-md rounded-sm fade-in " onSubmit={handleSubmit(onSubmit)}>
                    <h1 className="text-center text-4xl text-white mb-7">Reset Password</h1>
                    {Boolean(apiState.message) && <p className="text-first-uppercase text-green-500 fade-in">{apiState.message}</p>}
                    <p className="text-mercury-800 py-2">Please enter your phone number, you will receive an OTP key.</p>

                    {isSubmit && !apiState.isError && (
                        <>
                            {/* ------------ Resend OTP start ------------------- */}
                            <div className=" flex space-x-2">
                                <p className="text-mercury-800">Send me an another OTP.</p>
                                {!isDone ? (
                                    <button className="duration-300 hover:text-malibu text-white focus:outline-none">Click Here</button>
                                ) : (
                                    <p className="text-white">{timer}s</p>
                                )}
                            </div>
                            {/* ------------ Resend OTP end ------------------- */}
                        </>
                    )}
                    {!isSubmit && (
                        <>
                            <div className="space-y-2">
                                <TextField name="phoneNumber" label="Phone Number" error={errors.phoneNumber} register={register} type="text" />
                            </div>
                        </>
                    )}
                    <div className="mt-4 mb-4">
                        {apiState.isLoading ? (
                            <WaveLoading />
                        ) : isSubmit && !apiState.isError ? (
                            <BtnForm label="Change Another Phone Number" type="button" handleOnClick={onReset} />
                        ) : (
                            <BtnForm label="Send An OTP" />
                        )}
                    </div>

                    <div>
                        <SideLink label="Or Reset By Email?" position="text-center" href={routers.forgotPasswordEmail.link} />
                    </div>
                </form>
            </div>
        </>
    );
};
const ResetPhoneRoute = (props: any) => RouteGuard({ Component: ResetPhone, props: { ...props } });
export default ResetPhoneRoute;
