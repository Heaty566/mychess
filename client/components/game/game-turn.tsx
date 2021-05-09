import * as React from 'react';
import XPlayerIcon from '../../public/asset/icons/x-player';
import OPlayerIcon from '../../public/asset/icons/o-player';
export interface TTTTurnProps {
    currentTurn: boolean;
    SymbolOne: React.FunctionComponent;
    SymbolTwo: React.FunctionComponent;
    userOneReady: boolean;
    userTwoReady: boolean;
}

const GameTurn: React.FunctionComponent<TTTTurnProps> = ({ currentTurn, SymbolOne, SymbolTwo, userOneReady, userTwoReady }) => {
    return (
        <div className="flex items-center px-2 space-x-4 ">
            <div className="flex items-center justify-center w-8 h-8 border-2 ">{userOneReady && <OPlayerIcon />}</div>
            <div className="">
                <h1 className="text-lg font-bold text-center">Turn</h1>
                <div className="w-8 h-8 mx-auto">{currentTurn ? <SymbolOne /> : <SymbolTwo />}</div>
            </div>
            <div className="flex items-center justify-center w-8 h-8 border-2 ">{userTwoReady && <XPlayerIcon />}</div>
        </div>
    );
};

export default GameTurn;
