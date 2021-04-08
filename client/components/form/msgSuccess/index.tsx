import * as React from 'react';

export interface MsgSuccessProps {
    message: string;
}

const MsgSuccess: React.FunctionComponent<MsgSuccessProps> = ({ message }) => {
    return Boolean(message) ? (
        <p className="text-first-uppercase text-green-500 fade-in" data-testid="success-msg">
            {message}
        </p>
    ) : null;
};

export default MsgSuccess;
