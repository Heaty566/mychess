import * as React from 'react';

export interface PanelRestartProps {
    handleOnClick: () => void;
    winner: boolean;
    userOneName: string;
    userTwoName: string;
}

const PanelRestart: React.FunctionComponent<PanelRestartProps> = ({ handleOnClick, userOneName = '', userTwoName = '', winner }) => {
    return (
        <div className="p-4 m-2 space-y-4 text-center rounded-sm bg-warmGray-50">
            <h1 className="text-xl font-bold capitalize">{winner ? userOneName : userTwoName} Win, Thank You For Playing</h1>
            <button className="px-4 py-2 font-bold bg-blue-700 rounded-sm text-mercury " onClick={() => handleOnClick()}>
                Restart
            </button>
        </div>
    );
};

export default PanelRestart;
