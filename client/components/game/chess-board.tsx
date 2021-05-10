import * as React from 'react';
import { ChessFlag } from '../../common/interface/chess.interface';
import ChessCell from './chess-cell';

export interface TTTBoardProps {
    board: ChessFlag[][];
    handleOnClick: (x: number, y: number) => void;
    register: React.LegacyRef<HTMLDivElement> | undefined;
}

const ChessBoard: React.FunctionComponent<TTTBoardProps> = ({ board, handleOnClick, register }) => {
    console.log(board);
    return (
        <div className="grid overflow-x-auto bg-asparagus-500 grid-cols-8-chess" ref={register}>
            {board.map((item, index) => {
                return item.map((item2, index2) => {
                    const isEven = 0 === (index + index2) % 2;

                    return <ChessCell key={`${index}${index2}`} cellFlag={item2} handleOnClick={() => handleOnClick(index, index2)} color={isEven} />;
                });
            })}
        </div>
    );
};

export default ChessBoard;
