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

import { ChessFlag, ChessRole } from '../../common/interface/chess.interface';
import { TicTacToeFlag } from '../../common/interface/tic-tac-toe.interface';
export interface ChessCellProps {
    cellFlag: ChessFlag;
    isEven: boolean;
    isSuggestion: boolean;
    isCheckMate: boolean;
    handleOnClick: () => void;
}

const ChessCell: React.FunctionComponent<ChessCellProps> = ({ cellFlag, handleOnClick, isEven, isSuggestion, isCheckMate }) => {
    function getChess(input: ChessFlag) {
        switch (input.chessRole) {
            case ChessRole.PAWN:
                switch (input.flag) {
                    case TicTacToeFlag.RED:
                        return <WhitePawn />;

                    case TicTacToeFlag.BLUE:
                        return <BlackPawn />;
                }
            case ChessRole.BISHOP:
                switch (input.flag) {
                    case TicTacToeFlag.RED:
                        return <WhiteBishop />;

                    case TicTacToeFlag.BLUE:
                        return <BlackBishop />;
                }
            case ChessRole.KING:
                switch (input.flag) {
                    case TicTacToeFlag.RED:
                        return <WhiteKing />;

                    case TicTacToeFlag.BLUE:
                        return <BlackKing />;
                }
            case ChessRole.KNIGHT:
                switch (input.flag) {
                    case TicTacToeFlag.RED:
                        return <WhiteKnight />;

                    case TicTacToeFlag.BLUE:
                        return <BlackKnight />;
                }
            case ChessRole.QUEEN:
                switch (input.flag) {
                    case TicTacToeFlag.RED:
                        return <WhiteQueen />;

                    case TicTacToeFlag.BLUE:
                        return <BlackQueen />;
                }
            case ChessRole.ROOK:
                switch (input.flag) {
                    case TicTacToeFlag.RED:
                        return <WhiteRook />;

                    case TicTacToeFlag.BLUE:
                        return <BlackRook />;
                }
        }
    }

    return (
        <button
            className={`w-16 h-16 p-2 duration-200 cursor-pointer hover:bg-gray-600 focus:outline-none 
            ${isEven && !isSuggestion && 'bg-aths-special-700'} 
            ${isSuggestion && 'bg-yellow-400'}`}
            onClick={() => handleOnClick()}
        >
            {getChess(cellFlag)}
        </button>
    );
};

export default ChessCell;
