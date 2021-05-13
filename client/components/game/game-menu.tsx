import * as React from 'react';
import BtnFunc from '../btn/btn-func';

export interface GameControlMenuProps {
    handleOnDraw: () => void;
    handleOnSurrender: () => void;
    isBotMode: boolean;
}

const GameControlMenu: React.FunctionComponent<GameControlMenuProps> = ({ handleOnDraw, handleOnSurrender, isBotMode }) => {
    return (
        <div className="p-2 m-2 space-x-2 bg-woodsmoke md:m-0">
            {!isBotMode && <BtnFunc label="Draw" handleOnClick={handleOnDraw} />}
            <BtnFunc label="Surrender" handleOnClick={handleOnSurrender} />
        </div>
    );
};

export default GameControlMenu;
