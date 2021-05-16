import * as React from 'react';

export interface BtnFuncProps {
    label: string;
    handleOnClick: () => void;
}

const BtnFunc: React.FunctionComponent<BtnFuncProps> = ({ handleOnClick, label }) => {
    return (
        <button
            className="px-4 py-2 font-semibold capitalize duration-200 bg-blue-700 rounded-sm text-mercury focus:outline-none hover:bg-blue-600"
            onClick={handleOnClick}
        >
            {label}
        </button>
    );
};

export default BtnFunc;
