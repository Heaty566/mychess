import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import TextField from '../../../components/form/textField';
import { RootState } from '../../../store';
import { IAuthState } from '../../../store/auth/interface';
import { UpdateUserAvatarDto, UpdateUserInfoDto } from '../../../api/user/dto';
import useFormError from '../../../common/hooks/useFormError';

interface EditUserInfoDto extends UpdateUserAvatarDto, UpdateUserInfoDto {}

const defaultValues: EditUserInfoDto = {
    name: '',
    avatar: null,
};

export interface AutoLoginProps {}

const AutoLogin: React.FunctionComponent<AutoLoginProps> = () => {
    const authState = useSelector<RootState, IAuthState>((state) => state.auth);
    const { register } = useForm<UpdateUserInfoDto>({ defaultValues });
    const errors = useFormError(defaultValues);

    return (
        <div className="w-1/5 p-4">
            <div>
                <img src={authState.avatarUrl} alt={authState.name} />
                <input type="file" />
            </div>
            <TextField name="name" type="text" error={errors.name} label="Name" register={register} />
            {Boolean(authState.username) && (
                <TextField name="username" type="text" error="" label="Username" register={register} value={authState.username} isDisable />
            )}
        </div>
    );
};

export default AutoLogin;
