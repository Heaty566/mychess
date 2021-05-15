import * as React from 'react';

import { ChessFlag, ChessRole } from '../../common/interface/chess.interface';

import BlackBishop from '../../public/asset/icons/chess/black-bishop';
import BlackKing from '../../public/asset/icons/chess/black-king';
import BlackKnight from '../../public/asset/icons/chess/black-knight';
import BlackPawn from '../../public/asset/icons/chess/black-pawn';
import BlackQueen from '../../public/asset/icons/chess/black-queen';
import BlackRook from '../../public/asset/icons/chess/black-rook';
import { GamePlayerFlag } from '../../common/interface/game.interface';
import WhiteBishop from '../../public/asset/icons/chess/white-bishop';
import WhiteKing from '../../public/asset/icons/chess/white-king';
import WhiteKnight from '../../public/asset/icons/chess/white-knight';
import WhitePawn from '../../public/asset/icons/chess/white-pawn';
import WhiteQueen from '../../public/asset/icons/chess/white-queen';
import WhiteRook from '../../public/asset/icons/chess/white-rook';

export interface ChessCellProps {
    cellFlag: ChessFlag;
    isEven: boolean;
    isSuggestion: boolean;
    isKingCheck: boolean;
    handleOnClick: () => void;
}

const ChessCell: React.FunctionComponent<ChessCellProps> = ({ cellFlag, handleOnClick, isEven, isSuggestion, isKingCheck }) => {
    function getChess(input: ChessFlag) {
        switch (input.chessRole) {
            case ChessRole.PAWN:
                switch (input.flag) {
                    case GamePlayerFlag.USER1:
                        return <WhitePawn />;

                    case GamePlayerFlag.USER2:
                        return <BlackPawn />;
                }
            case ChessRole.BISHOP:
                switch (input.flag) {
                    case GamePlayerFlag.USER1:
                        return <WhiteBishop />;

                    case GamePlayerFlag.USER2:
                        return <BlackBishop />;
                }
            case ChessRole.KING:
                switch (input.flag) {
                    case GamePlayerFlag.USER1:
                        return <WhiteKing />;

                    case GamePlayerFlag.USER2:
                        return <BlackKing />;
                }
            case ChessRole.KNIGHT:
                switch (input.flag) {
                    case GamePlayerFlag.USER1:
                        return <WhiteKnight />;

                    case GamePlayerFlag.USER2:
                        return <BlackKnight />;
                }
            case ChessRole.QUEEN:
                switch (input.flag) {
                    case GamePlayerFlag.USER1:
                        return <WhiteQueen />;

                    case GamePlayerFlag.USER2:
                        return <BlackQueen />;
                }
            case ChessRole.ROOK:
                switch (input.flag) {
                    case GamePlayerFlag.USER1:
                        return <WhiteRook />;

                    case GamePlayerFlag.USER2:
                        return <BlackRook />;
                }
        }
    }

    const Chess = getChess(cellFlag);

    return (
        <div className={` ${isEven && !isKingCheck && 'bg-aths-special-700'} ${isKingCheck && 'bg-red-500'}`}>
            <button
                className={`w-16 h-16 p-2 duration-200 cursor-pointer hover:bg-gray-600 focus:outline-none relative ${
                    isSuggestion ? (Boolean(Chess) ? 'bg-blue-700' : 'chess-suggestion') : ''
                }  `}
                onClick={() => handleOnClick()}
            >
                {Chess}
            </button>
        </div>
    );
};

export default ChessCell;
