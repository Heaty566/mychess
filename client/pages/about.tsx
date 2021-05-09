import * as React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';

import { store } from '../store';
import { useFormError } from '../common/hooks/useFormError';
import { SupportDto } from '../common/interface/dto/common.dto';
import routers from '../common/constants/router';
import SeoHead from '../components/common/seoHead';
import commonThunk from '../store/api/thunk';

import TextareaField from '../components/form/field-textarea';
import TextField from '../components/form/filed-textfield';
import BtnForm from '../components/btn/btn-form';

const defaultValues: SupportDto = {
    message: '',
    email: '',
    name: '',
};

export interface SupportProps {}

const About: React.FunctionComponent<SupportProps> = () => {
    const { register, handleSubmit } = useForm<SupportDto>({ defaultValues });
    const errors = useFormError<SupportDto>(defaultValues);
    const [isVerify, setVerify] = React.useState(false);

    return (
        <>
            <SeoHead {...routers.about.header} />
            <div className="flex-1 p-4 md:p-8 chess-bg-2"></div>
        </>
    );
};

export default About;
