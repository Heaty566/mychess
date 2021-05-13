import { GameStatus, GamePlayerFlag, GamePlayer } from './game.interface';

export enum TTTGatewayAction {
    TTT_JOIN = 'ttt-join',
    TTT_RESTART = 'ttt-restart',
    TTT_COUNTER = 'ttt-counter',
    TTT_GET = 'ttt-get',
}

export interface TicTacToeBoard {
    id: string;
    startDate: Date;
    lastStep: Date;
    status: GameStatus;
    board: Array<Array<GamePlayerFlag>>;
    currentTurn: boolean;
    users: GamePlayer[];
    isBotMode: boolean;
    winner: GamePlayerFlag;
    chatId: string;
}
