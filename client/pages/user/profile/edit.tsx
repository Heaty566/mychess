import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { RootState } from '../../../store';
import { AuthState } from '../../../store/auth/interface';
import { UpdateUserEmailDto, UpdateUserPhoneDto, UpdateUserInfoDto } from '../../../api/user/dto';
import { useUploadFile } from '../../../common/hooks/useUploadFile';
import useFormError from '../../../common/hooks/useFormError';
import { ApiState } from '../../../store/api/interface';
import userAPI from '../../../api/user';
import routers from '../../../common/constants/router';
import { useRouter } from 'next/router';

import FileUpload from '../../../components/form/fileUpload';
import TextField from '../../../components/form/textField';
import RouteProtectedWrapper from '../../../common/HOC/routeProtectedWrapper';
import BtnForm from '../../../components/btn/btnForm';
import MsgSuccess from '../../../components/form/msgSuccess';
import WaveLoading from '../../../components/loading/waveLoading';
import SeoHead from '../../../components/common/seoHead';

interface EditUserForm extends UpdateUserInfoDto, UpdateUserEmailDto, UpdateUserPhoneDto {
    avatar: string;
}

const defaultValues: EditUserForm = {
    name: '',
    avatar: '',
    email: '',
    phoneNumber: '',
};

export interface AutoLoginProps {}

const EditUserProfile: React.FunctionComponent<AutoLoginProps> = () => {
    const authState = useSelector<RootState, AuthState>((state) => state.auth);
    const apiState = useSelector<RootState, ApiState>((state) => state.api);
    const router = useRouter();
    const { register, handleSubmit, setValue } = useForm<EditUserForm>({ defaultValues });
    const [file, handleOnChangeFile] = useUploadFile();
    const errors = useFormError(defaultValues);

    const handleOnSubmit = async (data: EditUserForm) => {
        if (file) await userAPI.updateUserAvatar(file);
        if (data.name !== authState.name) await userAPI.updateUserInfo({ name: data.name });
        if (data.email && data.email !== authState.email) await userAPI.updateUserEmailCreateOTP({ email: data.email });
        if (data.phoneNumber && data.phoneNumber !== authState.phoneNumber)
            await userAPI.updateUserPhoneCreateOTP({ phoneNumber: data.phoneNumber }).then(() => router.push(routers.updateWithOTP.link));
    };

    React.useEffect(() => {
        if (authState.isLogin) {
            setValue('name', authState.name);
            setValue('phoneNumber', authState.phoneNumber);
            setValue('email', authState.email);
        }
    }, [authState]);

    return (
        <>
            <SeoHead {...routers.userEdit.header} />
            <RouteProtectedWrapper isNeedLogin>
                <div className="relative flex flex-1">
                    <video
                        playsInline
                        autoPlay
                        muted
                        loop
                        className="absolute top-0 z-0 object-cover w-full h-full"
                        poster="https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/items/1263950/d7d28a52bd829aeee6989e58c3214e6c1cdbc5e3.jpg"
                    >
                        <source
                            src="https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/items/1263950/cba7f6ad5a2a96638ff91e5900e17fa671d0385e.webm?fbclid=IwAR2lnhDiu_UzKVt5H4VjGhULyMB1GPhEBEm0276riR0MeAyKUnWfj2qQtUw"
                            type="video/webm"
                        />
                    </video>
                    <div className="relative w-full px-4 py-6 mx-auto md:w-5/6 xl:w-4/6 background-profile fade-in">
                        <form onSubmit={handleSubmit(handleOnSubmit)} className="flex flex-col items-start space-x-0 md:flex-row md:space-x-10">
                            <div className="w-40 space-y-2">
                                <div className="relative max-w-xs ">
                                    <img
                                        src={file ? URL.createObjectURL(file) : authState.avatarUrl}
                                        alt={authState.name}
                                        className="object-cover w-40 h-40"
                                    />
                                    <FileUpload name="avatar" handleOnChange={handleOnChangeFile} label="Avatar" error={errors.avatar} />
                                </div>
                            </div>
                            <div className="w-full space-y-2 md:w-64">
                                <h1 className="text-3xl text-white ">Update User</h1>
                                <MsgSuccess message={apiState.message} />
                                <TextField name="name" type="text" error={errors.name} label="Name" register={register} />
                                <TextField name="email" type="text" error={errors.email} label="Email" register={register} />
                                <TextField name="phoneNumber" type="text" error={errors.phoneNumber} label="Phone" register={register} />
                                {Boolean(authState.username) && (
                                    <TextField name="username" type="text" error="" label="Username" register={register} isDisable />
                                )}

                                {apiState.isLoading ? <WaveLoading /> : <BtnForm label="Update" />}
                            </div>
                        </form>
                    </div>
                </div>
            </RouteProtectedWrapper>
        </>
    );
};

export default EditUserProfile;
