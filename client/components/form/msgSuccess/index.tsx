import * as React from 'react';

export interface MsgSuccessProps {
    message: string;
}

const MsgSuccess: React.FunctionComponent<MsgSuccessProps> = ({ message }) => {
    return Boolean(message) ? <p className="text-green-500 text-first-uppercase fade-in">{message}</p> : null;
};

export default MsgSuccess;
