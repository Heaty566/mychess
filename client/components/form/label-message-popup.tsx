import * as React from 'react';

export interface MsgSuccessProps {
    errorMessage: string;
    label?: string;
}

const LabelMessagePopup: React.FunctionComponent<MsgSuccessProps> = ({ errorMessage, label }) => {
    if (!Boolean(errorMessage)) return null;
    return <p className="px-2 py-1 text-white bg-red-500 rounded-sm text-first-uppercase pop-up">{errorMessage}</p>;
};

export default LabelMessagePopup;
