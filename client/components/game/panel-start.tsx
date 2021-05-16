import * as React from 'react';

import ModalWrapper from '../modal/modal-wrapper';
import BtnFunc from '../btn/btn-func';

export interface PanelStartProps {
    handleOnClick: () => void;
    isAppear: boolean;
}

const PanelStart: React.FunctionComponent<PanelStartProps> = ({ handleOnClick, isAppear }) => {
    return (
        <ModalWrapper isAppear={isAppear}>
            <h1 className="text-xl font-bold">Click Start When You Are Ready</h1>
            <BtnFunc label=" Start Game" handleOnClick={handleOnClick} />
        </ModalWrapper>
    );
};

export default PanelStart;
