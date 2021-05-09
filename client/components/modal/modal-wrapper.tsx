import * as React from 'react';

export interface GamePanelProps {
    isAppear: boolean;
}

const GamePanel: React.FunctionComponent<GamePanelProps> = ({ isAppear, children }) => {
    if (!isAppear) return null;
    else
        return (
            <div className="absolute flex items-center justify-center w-full h-full bg-black bg-opacity-90">
                <div className="p-4 m-2 space-y-4 text-center rounded-sm bg-warmGray-50">{children}</div>
            </div>
        );
};

export default GamePanel;
