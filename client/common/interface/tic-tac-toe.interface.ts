import { PublicUser } from './user.interface';

export enum TicTacToeFlag {
    EMPTY = -1,
    RED = 0,
    BLUE = 1,
}

export enum TTTGatewayAction {
    TTT_JOIN = 'ttt-join',
    TTT_RESTART = 'ttt-restart',
    TTT_COUNTER = 'ttt-counter',
    TTT_GET = 'ttt-get',
}

export enum TicTacToeStatus {
    'NOT-YET' = 0,
    'PLAYING' = 1,
    'END' = 2,
}

export interface TicTacToePlayer extends PublicUser {
    flag: TicTacToeFlag.BLUE | TicTacToeFlag.RED;
    time: number;
    ready: boolean;
}

export interface TicTacToeBoard {
    id: string;
    startDate: Date;
    lastStep: Date;
    status: TicTacToeStatus;
    board: Array<Array<TicTacToeFlag>>;
    currentTurn: boolean;
    users: TicTacToePlayer[];
    isBotMode: boolean;
    winner: TicTacToeFlag;
    chatId: string;
}
