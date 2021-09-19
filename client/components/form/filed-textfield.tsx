import * as React from 'react';
import { UseFormRegister } from 'react-hook-form';

import { LabelMessage } from './label-message';

export interface TextFieldProps {
    name: string;
    label: string;
    error: string;
    register: UseFormRegister<any>;
    type: 'text' | 'password';
    isDisable?: boolean;
}

export const TextField: React.FunctionComponent<TextFieldProps> = ({ label, name, error, register, type, isDisable = false }) => (
    <div className="space-y-1.5 text-sm">
        <label htmlFor={name} className="block text-cotton-seed ">
            {label}
        </label>
        <input
            type={type}
            id={name}
            className="block w-full outline-none rounded-sm bg-tuna py-2 px-1.5  text-mercury"
            {...register(name)}
            autoComplete={type === 'password' ? 'off' : 'on'}
            disabled={isDisable}
        />
        <LabelMessage label={label} errorMessage={error} successMessage="" />
    </div>
);
