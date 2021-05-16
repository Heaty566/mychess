import * as React from 'react';

import { ChessFlag, ChessMove, ChessRole } from '../../common/interface/chess.interface';
import { GamePlayerFlag } from '../../common/interface/game.interface';

import BlackPawn from '../../public/asset/icons/chess/black-pawn-mini';
import WhitePawn from '../../public/asset/icons/chess/white-pawn-mini';
import BlackQueen from '../../public/asset/icons/chess/black-queen-mini';
import WhiteQueen from '../../public/asset/icons/chess/white-queen-mini';
import BlackKnight from '../../public/asset/icons/chess/black-knight-mini';
import WhiteKnight from '../../public/asset/icons/chess/white-knight-mini';
import BlackKing from '../../public/asset/icons/chess/black-king-mini';
import WhiteKing from '../../public/asset/icons/chess/white-king-mini';
import BlackRook from '../../public/asset/icons/chess/black-rook-mini';
import WhiteRook from '../../public/asset/icons/chess/white-rook-mini';
import BlackBishop from '../../public/asset/icons/chess/black-bishop-mini';
import WhiteBishop from '../../public/asset/icons/chess/white-bishop-mini';

export interface ChessStepProps {
    moves: ChessMove[];
}

const ChessStep: React.FunctionComponent<ChessStepProps> = ({ moves }) => {
    const boxRef = React.useRef<any>();

    React.useEffect(() => {
        if (boxRef.current) {
            const newObject = boxRef.current as HTMLDivElement;
            newObject.scrollTop = -9999;
        }
    }, [moves, boxRef]);

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
    return (
        <div className="flex-1 hidden py-1 overflow-auto bg-aths-special-500 max-h-64 fade-in md:block">
            <div className="flex flex-col-reverse px-2 transform rotate-y-180 " ref={boxRef}>
                {moves.map((item, index) => {
                    return (
                        <div
                            className="flex mb-2 font-medium transform rotate-y-180"
                            key={`${item.fromX}${item.fromY}${item.toX}${item.toY}${index}`}
                        >
                            {getChess({ chessRole: item.chessRole, flag: item.flag })}{' '}
                            {` X: ${item.fromX} -> ${item.toX} vs Y: ${item.fromY} -> ${item.toY}`}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ChessStep;
