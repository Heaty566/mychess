import * as React from 'react';

import { ChessRole } from '../../common/interface/chess.interface';
import { PromoteChessRole } from '../../common/interface/dto/chess.dto';
import { GamePlayerFlag } from '../../common/interface/game.interface';

import BlackQueen from '../../public/asset/icons/chess/black-queen';
import WhiteQueen from '../../public/asset/icons/chess/white-queen';
import BlackKnight from '../../public/asset/icons/chess/black-knight';
import WhiteKnight from '../../public/asset/icons/chess/white-knight';
import BlackRook from '../../public/asset/icons/chess/black-rook';
import WhiteRook from '../../public/asset/icons/chess/white-rook';
import BlackBishop from '../../public/asset/icons/chess/black-bishop';
import WhiteBishop from '../../public/asset/icons/chess/white-bishop';
import ModalWrapper from '../modal/modal-wrapper';
export interface PanelPromoteProps {
    handleOnClick: (role: PromoteChessRole) => void;
    isAppear: boolean;
    currentFlag: GamePlayerFlag;
}

const PanelPromote: React.FunctionComponent<PanelPromoteProps> = ({ handleOnClick, isAppear, currentFlag }) => {
    const chess: Array<{ value: PromoteChessRole; Component: any }> = [
        {
            value: ChessRole.BISHOP,
            Component: currentFlag === GamePlayerFlag.USER1 ? WhiteBishop : BlackBishop,
        },
        {
            value: ChessRole.KNIGHT,
            Component: currentFlag === GamePlayerFlag.USER1 ? WhiteKnight : BlackKnight,
        },
        {
            value: ChessRole.QUEEN,
            Component: currentFlag === GamePlayerFlag.USER1 ? WhiteQueen : BlackQueen,
        },
        {
            value: ChessRole.ROOK,
            Component: currentFlag === GamePlayerFlag.USER1 ? WhiteRook : BlackRook,
        },
    ];

    return (
        <ModalWrapper isAppear={isAppear}>
            <div className="space-y-2 text-center">
                <h1 className="text-xl font-bold capitalize">Please choose your new chess</h1>
                <div>
                    {chess.map((item, index) => {
                        return (
                            <button className="p-2 duration-200 hover:bg-blue-600" key={index} onClick={() => handleOnClick(item.value)}>
                                {<item.Component />}
                            </button>
                        );
                    })}
                </div>
            </div>
        </ModalWrapper>
    );
};

export default PanelPromote;
