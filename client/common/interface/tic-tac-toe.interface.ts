import { GamePlayer, GamePlayerFlag, GameStatus } from './game.interface';

export enum TTTGatewayAction {
    TTT_JOIN = 'ttt-join',
    TTT_RESTART = 'ttt-restart',
    TTT_COUNTER = 'ttt-counter',
    TTT_GET = 'ttt-get',
}
export interface TTTMoveRedis {
    x: number;
    y: number;
    flag: GamePlayerFlag;
}

export interface TicTacToeBoard {
    id: string;
    startDate: Date;
    lastStep: Date;
    status: GameStatus;
    changeOne: number;
    changeTwo: number;
    board: Array<Array<GamePlayerFlag>>;
    currentTurn: boolean;
    users: GamePlayer[];
    isBotMode: boolean;
    winner: GamePlayerFlag;
    chatId: string;
    moves: Array<TTTMoveRedis>;
}
