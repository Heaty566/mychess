import * as React from 'react';

export interface GameControlMenuProps {
    handleOnDraw: () => void;
    handleOnSurrender: () => void;
}

const GameControlMenu: React.FunctionComponent<GameControlMenuProps> = ({ handleOnDraw, handleOnSurrender }) => {
    return (
        <div className="p-2 space-x-2 bg-woodsmoke">
            <button className="px-4 py-2 font-semibold bg-blue-700 rounded-sm text-mercury" onClick={handleOnDraw}>
                Draw
            </button>
            <button className="px-4 py-2 font-semibold bg-blue-700 rounded-sm text-mercury" onClick={handleOnSurrender}>
                Surrender
            </button>
        </div>
    );
};

export default GameControlMenu;
