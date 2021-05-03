import * as React from 'react';
import XPlayerIcon from '../../../public/asset/icons/x-player';
import OPlayerIcon from '../../../public/asset/icons/o-player';
import { TicTacToeFlag } from './config';

export interface TTTCellProps {
    cellFlag: TicTacToeFlag;
    handleOnClick: () => void;
}

const TTTCell: React.FunctionComponent<TTTCellProps> = ({ cellFlag, handleOnClick }) => {
    return (
        <button
            className="w-10 h-10 p-2 duration-200 border cursor-pointer border-warmGray-500 hover:bg-gray-300 focus:outline-none"
            onClick={() => handleOnClick()}
        >
            {cellFlag === 1 ? <XPlayerIcon /> : cellFlag === 0 ? <OPlayerIcon /> : null}
        </button>
    );
};

export default TTTCell;
