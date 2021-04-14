import * as React from 'react';

export interface MsgErrorProps {
    message: string;
    label: string;
}

const MsgError: React.FunctionComponent<MsgErrorProps> = ({ message, label }) => {
    if (!Boolean(message.length)) return null;
    return <p className="text-red-500 fade-in">{`${label} ${message}`}</p>;
};

export default MsgError;
