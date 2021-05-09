import * as React from 'react';

export interface BtnFormProps {
    label: string;
    type?: 'submit' | 'button';
    handleOnClick?: Function;
}

const BtnForm: React.FunctionComponent<BtnFormProps> = ({ label, type = 'submit', handleOnClick = () => {} }) => (
    <button
        className="w-full py-2 text-white rounded-sm bg-btn-1 focus:outline-none "
        type={type}
        onClick={(event) => {
            if (type === 'button') event.preventDefault();
            handleOnClick();
        }}
    >
        {label}
    </button>
);

export default BtnForm;
