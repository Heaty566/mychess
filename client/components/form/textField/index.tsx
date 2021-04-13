import * as React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { useTestId } from '../../../test/helper/data-testId';
import MsgError from '../msgError';

export interface TextFieldProps {
    name: string;
    label: string;
    error: string;
    register: UseFormRegister<any>;
    type: 'text' | 'password';
    isDisable?: boolean;
}

const TextField: React.FunctionComponent<TextFieldProps> = ({ label, name, error, register, type, isDisable = false }) => (
    <div className="space-y-1.5 text-sm">
        <label htmlFor={name} className="block text-cotton-seed " {...useTestId(`textField-label-${name}`)}>
            {label}
        </label>
        <input
            type={type}
            id={name}
            className="block w-full outline-none rounded-sm bg-tuna py-2 px-1.5  text-mercury"
            {...register(name)}
            autoComplete={type === 'password' ? 'off' : 'on'}
            {...useTestId(`textField-input-${name}`)}
            disabled={isDisable}
        />
        <MsgError label={label} message={error} />
    </div>
);

export default TextField;
