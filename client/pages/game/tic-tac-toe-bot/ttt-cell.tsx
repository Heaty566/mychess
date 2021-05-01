import * as React from 'react';
import XPlayerIcon from '../../../public/asset/icons/x-player';
import OPlayerIcon from '../../../public/asset/icons/o-player';
import { TicTacToeFlag } from './config';

export interface TTTCellProps {
    cellFlag: TicTacToeFlag;
}

const TTTCell: React.FunctionComponent<TTTCellProps> = ({ cellFlag }) => {
    return (
        <div className="h-10 p-2 duration-300 border cursor-pointer border-trueGray-900 hover:bg-gray-600">
            {cellFlag === 1 ? <XPlayerIcon /> : cellFlag === 0 ? <OPlayerIcon /> : null}
        </div>
    );
};

export default TTTCell;
