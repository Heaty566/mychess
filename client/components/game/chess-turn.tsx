import * as React from 'react';
import BlackKingIcon from '../../public/asset/icons/chess/black-king';
import WhiteKingIcon from '../../public/asset/icons/chess/white-king';

export interface TTTTurnProps {
    currentTurn: boolean;
    userOneReady: boolean;
    userTwoReady: boolean;
}

const ChessTurn: React.FunctionComponent<TTTTurnProps> = ({ currentTurn, userOneReady, userTwoReady }) => {
    return (
        <div className="flex items-center px-2 space-x-4 ">
            <div className="flex items-center justify-center w-8 h-8 border-2 ">{userOneReady && <WhiteKingIcon />}</div>
            <div className="">
                <h1 className="text-lg font-bold text-center">Turn</h1>
                <div className="flex w-12 h-14 ">{currentTurn ? <BlackKingIcon /> : <WhiteKingIcon />}</div>
            </div>
            <div className="flex items-center justify-center w-8 h-8 border-2 ">{userTwoReady && <BlackKingIcon />}</div>
        </div>
    );
};

export default ChessTurn;
