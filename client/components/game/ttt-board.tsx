import * as React from 'react';

import { TicTacToeBoard } from '../../common/interface/tic-tac-toe.interface';

import TTTCell from './ttt-cell';

export interface TTTBoardProps {
    board: TicTacToeBoard;
    handleOnClick: (x: number, y: number) => void;
    register: React.LegacyRef<HTMLDivElement> | undefined;
}

const TTTBoard: React.FunctionComponent<TTTBoardProps> = ({ board, handleOnClick, register }) => {
    return (
        <div className="grid overflow-x-auto bg-warmGray-900 grid-cols-14-ttt" ref={register}>
            {board.board.map((item, index) => {
                return item.map((item2, index2) => {
                    const isCheck =
                        board.moves[board.moves.length - 1] &&
                        board.moves[board.moves.length - 1].x === index &&
                        board.moves[board.moves.length - 1].y === index2;
                    return (
                        <TTTCell key={`${index}${index2}`} cellFlag={item2} handleOnClick={() => handleOnClick(index, index2)} isCheck={isCheck} />
                    );
                });
            })}
        </div>
    );
};

export default TTTBoard;
