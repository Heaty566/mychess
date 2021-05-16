import * as React from 'react';

import { GamePlayerFlag } from '../../common/interface/game.interface';

import TTTCell from './ttt-cell';

export interface TTTBoardProps {
    board: GamePlayerFlag[][];
    handleOnClick: (x: number, y: number) => void;
    register: React.LegacyRef<HTMLDivElement> | undefined;
}

const TTTBoard: React.FunctionComponent<TTTBoardProps> = ({ board, handleOnClick, register }) => {
    return (
        <div className="grid overflow-x-auto bg-warmGray-900 grid-cols-14-ttt" ref={register}>
            {board.map((item, index) => {
                return item.map((item2, index2) => {
                    return <TTTCell key={`${index}${index2}`} cellFlag={item2} handleOnClick={() => handleOnClick(index, index2)} />;
                });
            })}
        </div>
    );
};

export default TTTBoard;
