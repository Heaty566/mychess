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
        <div className="h-10 p-2 duration-200 border cursor-pointer border-warmGray-500 hover:bg-gray-300" onClick={() => handleOnClick()}>
            {cellFlag === 1 ? <XPlayerIcon /> : cellFlag === 0 ? <OPlayerIcon /> : null}
        </div>
    );
};

export default TTTCell;
