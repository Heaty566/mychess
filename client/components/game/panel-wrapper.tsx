import * as React from 'react';

export interface GamePanelProps {
    isAppear: boolean;
}

const GamePanel: React.FunctionComponent<GamePanelProps> = ({ isAppear, children }) => {
    if (!isAppear) return null;
    else return <div className="absolute flex items-center justify-center w-full h-full bg-black bg-opacity-90">{children}</div>;
};

export default GamePanel;
