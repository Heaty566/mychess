import * as React from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import SeoHead from '../../../components/common/seoHead';
import routers from '../../../common/constants/router';
import { ResetUserPasswordDto } from '../../../api/user/dto';
import { RootState } from '../../../store';
import { ApiState } from '../../../store/api/interface';

import useFormError from '../../../common/hooks/useFormError';
import { RouteProtectedWrapper } from '../../../common/HOC/routeProtectedWrapper';
import TextField from '../../../components/form/textField';
import BtnForm from '../../../components/btn/btnForm';
import WaveLoading from '../../../components/loading/waveLoading';
import MsgSuccess from '../../../components/form/msgSuccess';
import userAPI from '../../../api/user';
import authApi from '../../../api/auth';
import { useRouter } from 'next/router';

interface RestUserPasswordWithKey extends ResetUserPasswordDto {
    otp: string;
}

const defaultValues: RestUserPasswordWithKey = {
    confirmNewPassword: '',
    otp: '',
    newPassword: '',
};

export interface ResetPasswordProps {}
const ResetPassword: React.FunctionComponent<ResetPasswordProps> = () => {
    const { register, handleSubmit } = useForm<RestUserPasswordWithKey>({ defaultValues });
    const apiState = useSelector<RootState, ApiState>((state) => state.api);
    const errors = useFormError<RestUserPasswordWithKey>(defaultValues);
    const [isCheckOtp, setCheckOtp] = React.useState(false);

    const router = useRouter();

    const onSubmit = async (data: RestUserPasswordWithKey) => {
        if (!isCheckOtp)
            authApi
                .checkOTP(data.otp)
                .then(() => setCheckOtp(true))
                .catch((err) => setCheckOtp(false));
        else
            userAPI.resetUserPassword({ confirmNewPassword: data.confirmNewPassword, newPassword: data.newPassword }, data.otp).then(() => {
                router.push(routers.login.link);
            });
    };
    React.useEffect(() => {
        if (router.query.key && router.query.key[0]) {
            const key = router.query.key[0];

            onSubmit({ otp: key, confirmNewPassword: '', newPassword: '' });
        }
    }, [router.query]);

    return (
        <>
            <SeoHead {...routers.resetPassword.header} />
            <RouteProtectedWrapper>
                <div className="grid flex-1 shadow-sm chess-bg place-items-center grid-rows-max">
                    <div className="w-full max-w-md px-4 py-12 bg-gray-800 rounded-sm md:px-10 fade-in ">
                        <h1 className="text-4xl text-center text-white mb-7">Reset Your Password</h1>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <MsgSuccess message={apiState.message} />
                            {isCheckOtp ? (
                                <div className="space-y-2">
                                    <p className="py-2 text-mercury-800">Please enter your new password.</p>
                                    <div className="space-y-2">
                                        <TextField
                                            name="newPassword"
                                            label="New Password"
                                            error={errors.newPassword}
                                            register={register}
                                            type="password"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <TextField
                                            name="confirmNewPassword"
                                            label="Confirm Password"
                                            error={errors.confirmNewPassword}
                                            register={register}
                                            type="password"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className="py-2 text-mercury-800">Please enter your OTP, and do not share it with anybody.</p>
                                    <div className="space-y-2">
                                        <TextField name="otp" label="OTP" error={errors.otp} register={register} type="text" />
                                    </div>
                                </>
                            )}
                            <div className="mb-4"></div>

                            {apiState.isLoading ? <WaveLoading /> : <BtnForm label="Submit" />}
                        </form>
                    </div>
                </div>
            </RouteProtectedWrapper>
        </>
    );
};

export default ResetPassword;
