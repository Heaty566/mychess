import * as React from 'react';
import { UseFormRegister } from 'react-hook-form';

import LabelMessage from './label-message';

export interface TextFieldProps {
    name: string;
    label: string;
    error: string;
    register: UseFormRegister<any>;
}

const FieldTextarea: React.FunctionComponent<TextFieldProps> = ({ label, name, error, register }) => (
    <div className="space-y-1.5 text-sm">
        <label htmlFor={name} className="block text-cotton-seed ">
            {label}
        </label>
        <textarea
            id={name}
            className="block w-full rounded-sm outline-none  bg-tuna py-2 px-1.5  text-mercury h-96 resize-none overflow-auto "
            {...register(name)}
        />
        <LabelMessage label={label} errorMessage={error} successMessage="" />
    </div>
);

export default FieldTextarea;
