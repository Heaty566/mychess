import * as React from 'react';
import ModalWrapper from '../modal/modal-wrapper';
export interface PanelReadyProps {
    handleOnClick: () => void;
    isReady: boolean;
    isAppear: boolean;
}

const PanelReady: React.FunctionComponent<PanelReadyProps> = ({ handleOnClick, isReady, isAppear }) => {
    return (
        <ModalWrapper isAppear={isAppear}>
            <h1 className="text-xl font-bold">{isReady ? 'Please Wait For Other Ready' : 'Please Ready To Start'}</h1>
            <div>
                <button className="px-4 py-2 font-semibold bg-blue-700 rounded-sm text-mercury " onClick={() => handleOnClick()}>
                    Ready
                </button>
            </div>
        </ModalWrapper>
    );
};

export default PanelReady;
