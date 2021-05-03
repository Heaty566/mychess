import * as React from 'react';

export interface PanelRestartProps {
    handleOnClick: () => void;
    winner: boolean;
    contentPlayerOne: string;
    contentPlayerTWo: string;
}

const PanelRestart: React.FunctionComponent<PanelRestartProps> = ({ handleOnClick, contentPlayerOne, contentPlayerTWo, winner }) => {
    return (
        <div className="p-4 m-2 space-y-4 text-center rounded-sm bg-warmGray-50">
            <h1 className="text-xl font-bold">{winner ? contentPlayerOne : contentPlayerTWo}</h1>
            <button className="px-4 py-2 font-bold bg-blue-700 rounded-sm text-mercury " onClick={() => handleOnClick()}>
                Restart
            </button>
        </div>
    );
};

export default PanelRestart;
