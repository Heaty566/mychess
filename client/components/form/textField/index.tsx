import * as React from 'react';
import { UseFormRegister } from 'react-hook-form';

export interface TextFieldProps {
    name: string;
    label: string;
    error: string;
    register: UseFormRegister<any>;
    type: 'text' | 'password';
}

const TextField: React.FunctionComponent<TextFieldProps> = ({ label, name, error, register, type }) => (
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
        />
        {Boolean(error.length) && <p className="text-red-500 fade-in">{`${label} ${error}`}</p>}
    </div>
);

export default TextField;
