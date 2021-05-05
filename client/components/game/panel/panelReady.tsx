import * as React from 'react';

export interface PanelReadyProps {
    handleOnClick: () => void;
    isReady: boolean;
}

const PanelReady: React.FunctionComponent<PanelReadyProps> = ({ handleOnClick, isReady }) => {
    return (
        <div className="p-4 m-2 space-y-4 text-center rounded-sm bg-warmGray-50">
            <h1 className="text-xl font-bold">{isReady ? 'Please Wait For Other Ready' : 'Please Ready To Start'}</h1>
            <div>
                <button className="px-4 py-2 font-semibold bg-blue-700 rounded-sm text-mercury " onClick={() => handleOnClick()}>
                    Ready
                </button>
            </div>
        </div>
    );
};

export default PanelReady;
