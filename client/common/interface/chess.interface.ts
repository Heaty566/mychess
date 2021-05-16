import { GamePlayer, GamePlayerFlag, GameStatus } from './game.interface';

export enum ChessRole {
    KING = 1,
    QUEEN = 2,
    ROOK = 3,
    KNIGHT = 4,
    BISHOP = 5,
    PAWN = 6,
    EMPTY = -1,
}
export interface ChessFlag {
    chessRole: ChessRole;
    flag: GamePlayerFlag;
}

export enum ChessGatewayAction {
    CHESS_JOIN = 'chess-join',
    CHESS_GET = 'chess-get',
    CHESS_PROMOTE_PAWN = 'chess-promote-pawn',
    CHESS_COUNTER = 'chess-counter',
    CHESS_RESTART = 'chess-restart',
}

export interface ChessMove {
    fromX: number;
    toX: number;
    fromY: number;
    toY: number;
    chessRole: ChessRole;
    flag: GamePlayerFlag;
}
export interface ChessMoveRedis {
    x: number;
    y: number;
    chessRole: ChessRole;
    flag: GamePlayerFlag;
}

export interface ChessBoard {
    board: Array<Array<ChessFlag>>;
    moves: Array<ChessMove>;
    turn: boolean;
    id: string;
    isBotMode: boolean;
    users: GamePlayer[];
    winner: GamePlayerFlag;
    changeOne: number;
    changeTwo: number;
    startDate: Date;
    status: GameStatus;
    chatId: string;
    checkedPiece: { x: number; y: number } | undefined;
}
