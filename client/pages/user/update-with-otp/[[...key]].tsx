import * as React from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import routers from '../../../common/constants/router';
import { RootState } from '../../../store';
import { ApiState } from '../../../common/interface/api.interface';
import userAPI from '../../../api/userApi';
import useFormError from '../../../common/hooks/useFormError';

import SeoHead from '../../../components/common/seoHead';
import BtnLink from '../../../components/btn/btn-link';
import TextField from '../../../components/form/filed-textfield';
import BtnForm from '../../../components/btn/btn-form';
import WaveLoading from '../../../components/loading/wave-loading';
import LabelMessage from '../../../components/form/label-message';

interface RestUserPasswordWithKey {
    otp: string;
}

const defaultValues: RestUserPasswordWithKey = {
    otp: '',
};

export interface ResetPasswordProps {}
const UpdateWithOTP: React.FunctionComponent<ResetPasswordProps> = () => {
    const { register, handleSubmit } = useForm<RestUserPasswordWithKey>({ defaultValues });
    const apiState = useSelector<RootState, ApiState>((state) => state.api);
    const errors = useFormError<RestUserPasswordWithKey>(defaultValues);
    const [isCheckOtp, setCheckOtp] = React.useState(false);

    const router = useRouter();

    const onSubmit = async (data: RestUserPasswordWithKey) => {
        if (!isCheckOtp)
            userAPI
                .updateUserByOtp(data.otp)
                .then(() => setCheckOtp(true))
                .catch((err) => setCheckOtp(false));
    };

    React.useEffect(() => {
        if (router.query.key && router.query.key[0]) {
            const key = router.query.key[0];
            onSubmit({ otp: key });
        }
    }, [router.query]);

    return (
        <>
            <SeoHead {...routers.resetPassword.header} />

            <div className="grid flex-1 shadow-sm chess-bg place-items-center grid-rows-max">
                {isCheckOtp ? (
                    <div className="flex flex-col justify-center space-y-4 fade-in">
                        <h1 className="self-start text-4xl text-green-500 m">Your Account Has Been Updated</h1>
                        <div className="grid place-items-center">
                            <BtnLink href={routers.home.link} label="Go Back To Home" />
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-md px-4 py-12 bg-gray-800 rounded-sm md:px-10 fade-in ">
                        <h1 className="text-4xl text-center text-white mb-7">Update Phone Number</h1>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                            <LabelMessage successMessage={apiState.message} errorMessage={apiState.errorMessage} />

                            <p className="py-2 text-mercury-800">Please enter your OTP, and do not share it with anybody.</p>
                            <div className="space-y-2">
                                <TextField name="otp" label="OTP" error={errors.otp} register={register} type="text" />
                            </div>
                            {apiState.isLoading ? <WaveLoading /> : <BtnForm label="Submit" />}
                        </form>
                    </div>
                )}
            </div>
        </>
    );
};

export default UpdateWithOTP;
