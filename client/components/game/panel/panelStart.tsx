import * as React from 'react';

export interface PanelStartProps {
    handleOnClick: () => void;
}

const PanelStart: React.FunctionComponent<PanelStartProps> = ({ handleOnClick }) => {
    return (
        <div className="p-4 m-2 space-y-4 text-center rounded-sm bg-warmGray-50">
            <h1 className="text-xl font-bold">Click Start When You Are Ready</h1>
            <button className="px-4 py-2 font-semibold bg-blue-700 rounded-sm text-mercury " onClick={() => handleOnClick()}>
                Start Game
            </button>
        </div>
    );
};

export default PanelStart;
