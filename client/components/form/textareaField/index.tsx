import * as React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { useTestId } from '../../../test/helper/data-testId';

export interface TextFieldProps {
    name: string;
    label: string;
    error: string;
    register: UseFormRegister<any>;
}

const TextField: React.FunctionComponent<TextFieldProps> = ({ label, name, error, register }) => (
    <div className="space-y-1.5 text-sm">
        <label htmlFor={name} className="block text-cotton-seed " {...useTestId(`textField-label-${name}`)}>
            {label}
        </label>
        <textarea
            id={name}
            className="block w-full rounded-sm outline-none  bg-tuna py-2 px-1.5  text-mercury h-96 resize-none overflow-auto "
            {...register(name)}
            {...useTestId(`textField-input-${name}`)}
        />
        {Boolean(error.length) && <p className="text-red-500 fade-in" {...useTestId(`textField-error-${name}`)}>{`${label} ${error}`}</p>}
    </div>
);

export default TextField;
