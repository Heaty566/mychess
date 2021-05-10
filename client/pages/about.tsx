import * as React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';

import { store } from '../store';
import { useFormError } from '../common/hooks/useFormError';
import { SupportDto } from '../common/interface/dto/common.dto';
import routers from '../common/constants/router';
import SeoHead from '../components/common/seoHead';
import GithubIcon from '../public/asset/icons/github-login';
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
    return (
        <>
            <SeoHead {...routers.about.header} />
            <div className="items-center flex-1 p-4 md:p-8 chess-bg">
                <div className="flex items-center space-x-2">
                    <h1 className="text-3xl font-semibold text-white">MyChess Project v1.5.7 - Project Information</h1>
                    <a href="https://github.com/Heaty566/mychess" target="_blank">
                        <GithubIcon />
                    </a>
                </div>
            </div>
        </>
    );
};

export default About;
