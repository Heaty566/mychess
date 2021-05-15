import * as React from 'react';
import { GamePlayerFlag } from '../../common/interface/game.interface';
import BtnFunc from '../btn/btn-func';
import ModalWrapper from '../modal/modal-wrapper';
export interface PanelRestartProps {
    handleOnClick: () => void;
    winner: GamePlayerFlag;
    userOneName: string;
    userTwoName: string;
    isAppear: boolean;
}

const PanelRestart: React.FunctionComponent<PanelRestartProps> = ({ handleOnClick, userOneName = '', userTwoName = '', winner, isAppear }) => {
    const message = winner === GamePlayerFlag.EMPTY ? 'Draw' : winner === GamePlayerFlag.USER1 ? `${userOneName} win` : `${userTwoName} win`;

    return (
        <ModalWrapper isAppear={isAppear}>
            <h1 className="text-xl font-bold capitalize">{message}</h1>
            <p>Thank You For Playing</p>
            <BtnFunc handleOnClick={handleOnClick} label="Restart" />
        </ModalWrapper>
    );
};

export default PanelRestart;
