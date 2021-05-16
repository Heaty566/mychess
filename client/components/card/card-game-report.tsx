import * as React from 'react';

import { GamePlayer, GamePlayerFlag } from '../../common/interface/game.interface';

export interface CardGameReportProps {
    currentPlayer: GamePlayer | undefined;
    otherPlayer: GamePlayer | undefined;
    time: {
        mmYY: string;
        mmHH: string;
    };
    changeOne: number;
    changeTwo: number;
    isWin: boolean;
    winner: GamePlayerFlag;
}

const CardGameReport: React.FunctionComponent<CardGameReportProps> = ({ currentPlayer, otherPlayer, time, isWin, winner, changeOne, changeTwo }) => {
    return (
        <div className="flex items-stretch text-mercury bg-woodsmoke fade-in ">
            <div className={`w-2  ${winner === -1 ? 'bg-yellow-500' : isWin ? 'bg-green-600' : 'bg-red-500'} `}></div>
            <div className="flex items-center justify-between flex-1 p-2 space-x-2">
                <div className="flex space-x-2">
                    <img src={currentPlayer?.avatarUrl} alt={currentPlayer?.name} className="hidden object-cover w-16 h-16 md:block" />
                    <div>
                        <p className="font-semibold capitalize">{currentPlayer?.name}</p>
                        <p>Elo: {currentPlayer?.elo}</p>
                    </div>
                </div>
                <div className="text-center">
                    <p>{time.mmYY}</p>
                    <p>{time.mmHH}</p>
                </div>
                <div className="text-center">
                    <p className={`${changeOne === 0 ? 'text-yellow-500' : changeOne > 0 ? 'text-green-500' : 'text-red-500'}`}>{changeOne}</p>
                    <p className={`${changeTwo === 0 ? 'text-yellow-500' : changeTwo > 0 ? 'text-green-500' : 'text-red-500'}`}>{changeTwo}</p>
                </div>

                <div className="flex flex-row-reverse ">
                    <img src={otherPlayer?.avatarUrl} alt={otherPlayer?.name} className="hidden object-cover w-16 h-16 ml-2 md:block" />
                    <div className="ml-2 text-right">
                        <p className="font-semibold capitalize">{otherPlayer?.name}</p>
                        <p>Elo: {otherPlayer?.elo}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardGameReport;
