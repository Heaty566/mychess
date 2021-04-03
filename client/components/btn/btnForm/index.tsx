import * as React from 'react';

export interface BtnFormProps {
        label: string;
}

const BtnForm: React.FunctionComponent<BtnFormProps> = ({ label }) => (
        <button
                className="bg-btn-1 w-full py-2 text-white rounded-sm focus:outline-none "
                type="submit"
        >
                {label}
        </button>
);

export default BtnForm;
