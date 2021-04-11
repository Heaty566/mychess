import * as React from 'react';
import TextField from '../components/form/textField';
import { useForm } from 'react-hook-form';
import { useFormError } from '../common/hooks/useFormError';
import TextareaField from '../components/form/textareaField';
import ReCAPTCHA from 'react-google-recaptcha';
import { SupportDto } from '../api/common/dto';
import BtnForm from '../components/btn/btnForm';
import { store } from '../store';
import commonThunk from '../store/api/thunk';

const defaultValues: SupportDto = {
    message: '',
    email: '',
    name: '',
};

export interface SupportProps {}

const Support: React.FunctionComponent<SupportProps> = () => {
    const { register, handleSubmit } = useForm<SupportDto>({ defaultValues });
    const errors = useFormError<SupportDto>(defaultValues);
    const [isVerify, setVerify] = React.useState(false);

    const onSubmit = (data: SupportDto) => {
        if (isVerify) store.dispatch(commonThunk.sendSupport(data));
    };

    return (
        <div className="flex-1 p-4 md:p-8 chess-bg-2">
            <form className="max-w-3xl p-0 space-y-2 md:p-4" onSubmit={handleSubmit(onSubmit)}>
                <h1 className="text-4xl text-white">Support Form</h1>
                <div className="max-w-xs">
                    <TextField error={errors.name} label="Name" name="name" register={register} type="text" />
                    <TextField error={errors.email} label="Email" name="email" register={register} type="text" />
                </div>
                <div className="">
                    <TextareaField error={errors.message} label="Message" name="message" register={register} />
                </div>
                <ReCAPTCHA sitekey="6Ld6aKUaAAAAAJdiR8rHOe3eToUYVT7J-FXWkJyv" onChange={() => setVerify(true)} />
                <div className="max-w-xs">
                    <BtnForm label="Submit" />
                </div>
            </form>
        </div>
    );
};

export default Support;
