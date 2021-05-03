import * as React from 'react';

export interface TTTTurnProps {
    currentTurn: boolean;
    SymbolOne: React.FunctionComponent;
    SymbolTwo: React.FunctionComponent;
}

const GameTurn: React.FunctionComponent<TTTTurnProps> = ({ currentTurn, SymbolOne, SymbolTwo }) => {
    return (
        <div className="px-2 ">
            <h1 className="text-lg font-bold text-center">Turn</h1>
            <div className="w-8 h-8 mx-auto">{currentTurn ? <SymbolOne /> : <SymbolTwo />}</div>
        </div>
    );
};

export default GameTurn;
