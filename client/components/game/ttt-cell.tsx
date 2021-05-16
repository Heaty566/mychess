import * as React from 'react';

import { GamePlayerFlag } from '../../common/interface/game.interface';

import XPlayerIcon from '../../public/asset/icons/x-player';
import OPlayerIcon from '../../public/asset/icons/o-player';

export interface TTTCellProps {
    cellFlag: GamePlayerFlag;
    handleOnClick: () => void;
}

const TTTCell: React.FunctionComponent<TTTCellProps> = ({ cellFlag, handleOnClick }) => {
    return (
        <button
            className="w-10 h-10 p-2 duration-200 border cursor-pointer border-warmGray-500 hover:bg-gray-300 focus:outline-none"
            onClick={() => handleOnClick()}
        >
            {cellFlag === GamePlayerFlag.USER2 ? <XPlayerIcon /> : cellFlag === GamePlayerFlag.USER1 ? <OPlayerIcon /> : null}
        </button>
    );
};

export default TTTCell;
