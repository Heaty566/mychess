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
        <div className="grid overflow-x-auto bg-asparagus-500 grid-cols-8-chess" ref={register}>
            {board.map((item, index) => {
                return item.map((item2, index2) => {
                    const isEven = 0 === (index + index2) % 2;
                    const isSuggestion = true;
                    const isCheckMate = Boolean(suggestion.find((item) => item.x === index && item.y === index2));
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
                });
            })}
        </div>
    );
};

export default ChessBoard;
