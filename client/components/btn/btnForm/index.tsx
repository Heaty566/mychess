import * as React from 'react';

export interface BtnFormProps {
    label: string;
    type?: 'submit' | 'button';
    handleOnClick?: () => void;
}

const BtnForm: React.FunctionComponent<BtnFormProps> = ({
    label,
    type = 'submit',
    handleOnClick = () => {},
}) => (
    <button
        className="bg-btn-1 w-full py-2 text-white rounded-sm focus:outline-none "
        type={type}
        onClick={() => handleOnClick()}
    >
        {label}
    </button>
);

export default BtnForm;
