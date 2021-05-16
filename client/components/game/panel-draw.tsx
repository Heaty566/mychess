import * as React from 'react';

import BtnFunc from '../btn/btn-func';
import ModalWrapper from '../modal/modal-wrapper';
export interface PanelDrawProps {
    handleOnAccept: () => void;
    handleOnDeny: () => void;
    isAppear: boolean;
    isDraw: boolean;
}

const PanelDraw: React.FunctionComponent<PanelDrawProps> = ({ handleOnDeny, handleOnAccept, isAppear, isDraw }) => {
    return (
        <ModalWrapper isAppear={isAppear}>
            {isDraw ? (
                <>
                    <h1 className="text-xl font-bold">You have requested to draw this match</h1>
                    <h1 className="text-xl font-bold">Please wait for other player</h1>
                </>
            ) : (
                <>
                    <h1 className="text-xl font-bold">Other player request to draw this match</h1>
                    <p className="text-lg font-bold">Do you draw?</p>
                    <div className="space-x-2">
                        <BtnFunc label="Accept" handleOnClick={handleOnAccept} />
                        <BtnFunc label="Deny" handleOnClick={handleOnDeny} />
                    </div>
                </>
            )}
        </ModalWrapper>
    );
};

export default PanelDraw;
