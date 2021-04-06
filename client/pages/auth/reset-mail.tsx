import * as React from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import SeoHead from '../../components/common/seoHead';
import routers from '../../common/constants/router';
import { RootState, store } from '../../store';
import { useTimer } from '../../common/hooks/useTimer';
import { ForgotPasswordEmailDto } from '../../api/auth/dto';
import { IApiState } from '../../store/api/interface';
import useFormError from '../../common/hooks/useFormError';
import { apiActions } from '../../store/api';
import { RouteGuard } from '../../common/HOC/routeGuard';
import authThunk from '../../store/auth/thunk';

import TextField from '../../components/form/textField';
import SideLink from '../../components/link/sideLink';
import BtnForm from '../../components/btn/btnForm';
import WaveLoading from '../../components/loading/waveLoading';

const defaultValues: ForgotPasswordEmailDto = {
    email: '',
};

const ResetEmail: React.FunctionComponent = () => {
    const { register, handleSubmit } = useForm<ForgotPasswordEmailDto>({ defaultValues });
    const apiState = useSelector<RootState, IApiState>((state) => state.api);
    const errors = useFormError<ForgotPasswordEmailDto>(defaultValues);
    const [isSubmit, setIsSubmit] = React.useState(false);
    const [timer, isDone, setTimerStatus] = useTimer(60, false);

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
        <>
            <SeoHead title="Reset Password" description="he" canonical="/" />
            <div className="flex-1 chess-bg grid place-items-center grid-rows-max shadow-sm">
                <form className="bg-gray-800 px-4 md:px-10 py-12 w-full max-w-md rounded-sm fade-in " onSubmit={handleSubmit(onSubmit)}>
                    <h1 className="text-center text-4xl text-white mb-7">Reset Password</h1>
                    {Boolean(apiState.message) && <p className="text-first-uppercase text-green-500 fade-in">{apiState.message}</p>}
                    <p className="text-mercury-800 py-2">Please enter your email, you will receive an mail to reset your password</p>

                    {isSubmit && !apiState.isError && (
                        <>
                            {/* ------------ Resend email start ------------------- */}
                            <div className=" flex space-x-2">
                                <p className="text-mercury-800">Send me an another email.</p>
                                {!isDone ? (
                                    <button className="duration-300 hover:text-malibu text-white focus:outline-none">Click Here</button>
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
                                <TextField name="email" label="Email" error={errors.email} register={register} type="text" />
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

                    <div>
                        <SideLink label="Or Reset By Phone Number?" position="text-center" href={routers.forgotPasswordPhone.link} />
                    </div>
                </form>
            </div>
        </>
    );
};
const ResetMailRoute = (props: any) => RouteGuard({ Component: ResetEmail, props: { ...props } });
export default ResetMailRoute;
