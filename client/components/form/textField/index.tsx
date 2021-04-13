import * as React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { useTestId } from '../../../test/helper/data-testId';

export interface TextFieldProps {
    name: string;
    label: string;
    error: string;
    register: UseFormRegister<any>;
    type: 'text' | 'password';
    isDisable?: boolean;
    value?: string;
}

const TextField: React.FunctionComponent<TextFieldProps> = ({ label, name, error, register, type, isDisable = false, value = '' }) => (
    <div className="space-y-1.5 text-sm">
        <label htmlFor={name} className="block text-cotton-seed " {...useTestId(`textField-label-${name}`)}>
            {label}
        </label>
        <input
            type={type}
            id={name}
            className="block w-full outline-none rounded-sm bg-tuna py-2 px-1.5  text-mercury"
            value={value}
            {...register(name)}
            autoComplete={type === 'password' ? 'off' : 'on'}
            {...useTestId(`textField-input-${name}`)}
            disabled={isDisable}
        />
        {Boolean(error.length) && <p className="text-red-500 fade-in" {...useTestId(`textField-error-${name}`)}>{`${label} ${error}`}</p>}
    </div>
);

export default TextField;
