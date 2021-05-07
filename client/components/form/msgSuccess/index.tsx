import * as React from 'react';

export interface MsgSuccessProps {
    successMessage: string;
    errorMessage: string;
}

const MsgSuccess: React.FunctionComponent<MsgSuccessProps> = ({ successMessage, errorMessage }) => {
    return Boolean(successMessage) || Boolean(errorMessage) ? (
        <p className={`${successMessage ? 'text-green-500' : 'text-red-500'}  text-first-uppercase fade-in`}>
            {successMessage ? successMessage : errorMessage}
        </p>
    ) : null;
};

export default MsgSuccess;
