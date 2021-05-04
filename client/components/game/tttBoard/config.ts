import { User } from '../../../store/auth/interface';

export type TicTacToeFlag = 1 | 0 | -1;

export enum TTTAction {
    TTT_JOIN = 'ttt-join',
    TTT_CREATE = 'ttt-create',
    TTT_GET = 'ttt-get',
    TTT_READY = 'ttt-ready',
    TTT_START = 'ttt-start',
    TTT_LEAVE = 'ttt-leave',
    TTT_SURRENDER = 'ttt-surrender',
    TTT_ADD_MOVE = 'ttt-add-move',
    TTT_WIN = 'ttt-win',
    TTT_BOT_BEST_MOVE = 'ttt-bot-best-move',
}

export enum TicTacToeStatus {
    'NOT-YET' = '-1',
    'END' = '0',
    'PLAYING' = '1',
}

export interface TicTacToePlayer {
    id: string;
    flag: TicTacToeFlag;
    time: number;
    ready: boolean;
}
export interface TicTacToe {
    id: string;
    users: [User, User];
    status: TicTacToeStatus;
    winner: TicTacToeFlag;
    startDate: Date;
    endDate: Date;
}

export interface TicTacToeBoard {
    id: string;
    board: Array<Array<TicTacToeFlag>>;
    currentTurn: boolean;
    users: [TicTacToePlayer, TicTacToePlayer];
    info: TicTacToe;
    isBotMode: boolean;
}
