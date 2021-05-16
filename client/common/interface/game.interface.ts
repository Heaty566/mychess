export enum GameStatus {
    'NOT_YET' = 0,
    'PLAYING' = 1,
    'END' = 2,
    'DRAW' = 3,
}

export enum GamePlayerFlag {
    EMPTY = -1,
    USER1 = 0,
    USER2 = 1,
}

export interface GamePlayer {
    flag: GamePlayerFlag.USER2 | GamePlayerFlag.USER1;
    time: number;
    ready: boolean;
    isDraw: boolean;
    id: string;
    username: string;
    name: string;
    avatarUrl: string;
    elo: number;
    createDate: string;
}
