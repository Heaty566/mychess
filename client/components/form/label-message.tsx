import * as React from 'react';

export interface MsgSuccessProps {
    successMessage: string;
    errorMessage: string;
    label?: string;
}

const LabelMessage: React.FunctionComponent<MsgSuccessProps> = ({ successMessage, errorMessage, label }) => {
    if (!(Boolean(successMessage) || Boolean(errorMessage))) return null;
    const message = successMessage ? successMessage : label ? `${label} ${errorMessage}` : errorMessage;
    return <p className={`${successMessage ? 'text-green-500' : 'text-red-500'}  text-first-uppercase fade-in`}>{message}</p>;
};

export default LabelMessage;
