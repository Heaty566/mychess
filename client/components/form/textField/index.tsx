import * as React from 'react';

export interface TextFieldProps {
        name: string;
        label: string;
        error: string;
}

const TextField: React.FunctionComponent<TextFieldProps> = ({ label, name, error }) => (
        <div className="space-y-1.5 text-sm">
                <label htmlFor={name} className="block text-cotton-seed ">
                        {label}
                </label>
                <input
                        type="text"
                        name={name}
                        id={name}
                        className="block w-full outline-none rounded-sm bg-tuna py-2 px-1.5  text-mercury"
                />
                {Boolean(error.length) && <p className="text-red-500">{`${label} ${error}`}</p>}
        </div>
);
export default TextField;
