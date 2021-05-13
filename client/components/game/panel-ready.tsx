import * as React from 'react';
import BtnFunc from '../btn/btn-func';
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
            <BtnFunc label="Ready" handleOnClick={handleOnClick} />
        </ModalWrapper>
    );
};

export default PanelReady;
