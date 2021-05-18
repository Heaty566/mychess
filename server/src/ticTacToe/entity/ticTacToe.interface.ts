export interface TicTacToePlayer {
      id: string;
      flag: TicTacToeFlag.BLUE | TicTacToeFlag.RED;
      time: number;
      ready: boolean;
      username: string;
      elo: number;
      avatarUrl: string;
      name: string;
      isDraw: boolean;
}

export interface TicTacToeBotMovePoint {
      x: number;
      y: number;
      point: number;
}
export enum TicTacToeFlag {
      EMPTY = -1,
      BLUE = 0,
      RED = 1,
}

export enum TicTacToeStatus {
      'NOT-YET' = 0,
      'PLAYING' = 1,
      'END' = 2,
      'DRAW' = 3,
}

export interface EloCalculator {
      redElo: number;
      blueElo: number;
}
export interface TTTMoveRedis {
      x: number;
      y: number;
      flag: TicTacToeFlag;
}
