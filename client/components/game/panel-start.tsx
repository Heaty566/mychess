import * as React from 'react';
import ModalWrapper from '../modal/modal-wrapper';

export interface PanelStartProps {
    handleOnClick: () => void;
    isAppear: boolean;
}

const PanelStart: React.FunctionComponent<PanelStartProps> = ({ handleOnClick, isAppear }) => {
    return (
        <ModalWrapper isAppear={isAppear}>
            <h1 className="text-xl font-bold">Click Start When You Are Ready</h1>
            <button className="px-4 py-2 font-semibold bg-blue-700 rounded-sm text-mercury " onClick={handleOnClick}>
                Start Game
            </button>
        </ModalWrapper>
    );
};

export default PanelStart;
