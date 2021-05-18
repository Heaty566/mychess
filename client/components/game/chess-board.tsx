import * as React from 'react';

import { ChessFlag, ChessMoveRedis } from '../../common/interface/chess.interface';
import { GamePlayer, GamePlayerFlag } from '../../common/interface/game.interface';

import ChessCell from './chess-cell';

export interface TTTBoardProps {
    board: ChessFlag[][];
    handleOnClick: (x: number, y: number) => void;
    register: React.LegacyRef<HTMLDivElement> | undefined;
    suggestion: ChessMoveRedis[];
    kingCheck: { x: number; y: number } | undefined;
    currentPlayer: GamePlayer;
}

const ChessBoard: React.FunctionComponent<TTTBoardProps> = ({ board, handleOnClick, register, suggestion, kingCheck, currentPlayer }) => {
    return (
        <div className={`flex  overflow-x-auto bg-asparagus-500 `} ref={register}>
            {board.map((item, index) => {
                return (
                    <div key={index} className={`flex ${currentPlayer.flag === GamePlayerFlag.USER1 ? 'flex-col-reverse' : 'flex-col'} `}>
                        {item.map((item2, index2) => {
                            const isEven = 1 === (index + index2) % 2;
                            const isSuggestion = Boolean(suggestion.find((item) => item.x === index && item.y === index2));

                            const isKingCheck = kingCheck ? kingCheck?.x === index && kingCheck?.y === index2 : false;
                            return (
                                <ChessCell
                                    isKingCheck={isKingCheck}
                                    isSuggestion={isSuggestion}
                                    key={`${index}${index2}`}
                                    cellFlag={item2}
                                    handleOnClick={() => handleOnClick(index, index2)}
                                    isEven={isEven}
                                />
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};

export default ChessBoard;
