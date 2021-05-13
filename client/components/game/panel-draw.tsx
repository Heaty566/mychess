import * as React from 'react';
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
                        <button className="px-4 py-2 font-bold bg-blue-700 rounded-sm text-mercury " onClick={handleOnAccept}>
                            Accept
                        </button>
                        <button className="px-4 py-2 font-bold bg-blue-700 rounded-sm text-mercury " onClick={handleOnDeny}>
                            Deny
                        </button>
                    </div>
                </>
            )}
        </ModalWrapper>
    );
};

export default PanelDraw;
