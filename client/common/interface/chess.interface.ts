import { PublicUser } from './user.interface';
import { TicTacToeFlag } from './tic-tac-toe.interface';

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
    flag: TicTacToeFlag;
}

export enum ChessGatewayAction {
    CHESS_JOIN = 'chess-join',
    CHESS_GET = 'chess-get',
    CHESS_PROMOTE_PAWN = 'chess-promote-pawn',
    CHESS_COUNTER = 'chess-counter',
    CHESS_RESTART = 'chess-restart',
}

export enum ChessStatus {
    'NOT_YET' = 0,
    'PLAYING' = 1,
    'END' = 2,
}

export interface ChessPlayer extends PublicUser {
    flag: TicTacToeFlag.BLUE | TicTacToeFlag.RED;
    time: number;
    ready: boolean;
}
export interface ChessMoveRedis {
    x: number;
    y: number;
    chessRole: ChessRole;
    flag: TicTacToeFlag;
}

export interface ChessBoard {
    board: Array<Array<ChessFlag>>;
    moves: Array<ChessMoveRedis>;
    turn: boolean;
    id: string;
    isBotMode: boolean;
    users: ChessPlayer[];
    winner: TicTacToeFlag;
    startDate: Date;
    status: ChessStatus;
    chatId: string;
}
