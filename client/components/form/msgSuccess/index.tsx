import * as React from 'react';
import { useTestId } from '../../../test/helper/data-testId';

export interface MsgSuccessProps {
    message: string;
}

const MsgSuccess: React.FunctionComponent<MsgSuccessProps> = ({ message }) => {
    return Boolean(message) ? (
        <p className="text-green-500 text-first-uppercase fade-in" {...useTestId(`msgSuccess`)}>
            {message}
        </p>
    ) : null;
};

export default MsgSuccess;
