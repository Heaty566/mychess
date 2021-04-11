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
import MsgSuccess from '../../components/form/msgSuccess';

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
            <SeoHead {...routers.forgotPasswordPhone.header} />
            <div className="grid flex-1 shadow-sm chess-bg place-items-center grid-rows-max">
                <div className="w-full max-w-md px-4 py-12 bg-gray-800 rounded-sm md:px-10 fade-in ">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <h1 className="text-4xl text-center text-white mb-7">Reset Password</h1>
                        <MsgSuccess message={apiState.message} />
                        <p className="py-2 text-mercury-800">Please enter your phone number, you will receive an OTP key.</p>

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
                    </form>
                    <div>
                        <SideLink label="Or Reset By Email?" position="text-center" href={routers.forgotPasswordEmail.link} />
                    </div>
                </div>
            </div>
        </>
    );
};
const ResetPhoneRoute = (props: any) => RouteGuard({ Component: ResetPhone, props: { ...props } });
export default ResetPhoneRoute;
