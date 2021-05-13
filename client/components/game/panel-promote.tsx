import * as React from 'react';
import BlackPawn from '../../public/asset/icons/chess/black-pawn';
import WhitePawn from '../../public/asset/icons/chess/white-pawn';
import BlackQueen from '../../public/asset/icons/chess/black-queen';
import WhiteQueen from '../../public/asset/icons/chess/white-queen';
import BlackKnight from '../../public/asset/icons/chess/black-knight';
import WhiteKnight from '../../public/asset/icons/chess/white-knight';
import BlackKing from '../../public/asset/icons/chess/black-king';
import WhiteKing from '../../public/asset/icons/chess/white-king';
import BlackRook from '../../public/asset/icons/chess/black-rook';
import WhiteRook from '../../public/asset/icons/chess/white-rook';
import BlackBishop from '../../public/asset/icons/chess/black-bishop';
import WhiteBishop from '../../public/asset/icons/chess/white-bishop';
import ModalWrapper from '../modal/modal-wrapper';
import { ChessFlag, ChessRole } from '../../common/interface/chess.interface';
import { TicTacToeFlag } from '../../common/interface/tic-tac-toe.interface';
export interface PanelPromoteProps {
    handleOnClick: (role: ChessRole.KNIGHT | ChessRole.QUEEN | ChessRole.ROOK | ChessRole.BISHOP) => void;
    isAppear: boolean;
    currentFlag: TicTacToeFlag;
}

const PanelPromote: React.FunctionComponent<PanelPromoteProps> = ({ handleOnClick, isAppear, currentFlag }) => {
    const chess: Array<{ value: ChessRole.KNIGHT | ChessRole.QUEEN | ChessRole.ROOK | ChessRole.BISHOP; Component: any }> = [
        {
            value: ChessRole.BISHOP,
            Component: currentFlag === TicTacToeFlag.BLUE ? WhiteBishop : BlackBishop,
        },
        {
            value: ChessRole.KNIGHT,
            Component: currentFlag === TicTacToeFlag.BLUE ? WhiteKnight : BlackKnight,
        },
        {
            value: ChessRole.QUEEN,
            Component: currentFlag === TicTacToeFlag.BLUE ? WhiteQueen : BlackQueen,
        },
        {
            value: ChessRole.ROOK,
            Component: currentFlag === TicTacToeFlag.BLUE ? WhiteRook : BlackRook,
        },
    ];

    return (
        <ModalWrapper isAppear={isAppear}>
            <div>
                {chess.map((item) => {
                    return <button onClick={() => handleOnClick(item.value)}>{<item.Component />}</button>;
                })}
            </div>
        </ModalWrapper>
    );
};

export default PanelPromote;
