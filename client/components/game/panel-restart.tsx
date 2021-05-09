import * as React from 'react';
import ModalWrapper from '../modal/modal-wrapper';
export interface PanelRestartProps {
    handleOnClick: () => void;
    winner: boolean;
    userOneName: string;
    userTwoName: string;
    isAppear: boolean;
}

const PanelRestart: React.FunctionComponent<PanelRestartProps> = ({ handleOnClick, userOneName = '', userTwoName = '', winner, isAppear }) => {
    return (
        <ModalWrapper isAppear={isAppear}>
            <h1 className="text-xl font-bold capitalize">{winner ? userOneName : userTwoName} Win, Thank You For Playing</h1>
            <button className="px-4 py-2 font-bold bg-blue-700 rounded-sm text-mercury " onClick={() => handleOnClick()}>
                Restart
            </button>
        </ModalWrapper>
    );
};

export default PanelRestart;
