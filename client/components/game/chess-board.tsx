import * as React from 'react';
import { ChessFlag, ChessMoveRedis } from '../../common/interface/chess.interface';
import ChessCell from './chess-cell';

export interface TTTBoardProps {
    board: ChessFlag[][];
    handleOnClick: (x: number, y: number) => void;
    register: React.LegacyRef<HTMLDivElement> | undefined;
    suggestion: ChessMoveRedis[];
}

const ChessBoard: React.FunctionComponent<TTTBoardProps> = ({ board, handleOnClick, register, suggestion }) => {
    return (
        <div className="flex overflow-x-auto bg-asparagus-500 " ref={register}>
            {board.map((item, index) => {
                return (
                    <div key={index}>
                        {item.map((item2, index2) => {
                            const isEven = 1 === (index + index2) % 2;
                            const isSuggestion = Boolean(suggestion.find((item) => item.x === index && item.y === index2));

                            const isCheckMate = false;
                            return (
                                <ChessCell
                                    isCheckMate={isCheckMate}
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
