export interface TicTacToePlayer {
      id: string;
      flag: TicTacToeFlag;
      time: number;
      ready: boolean;
}

export interface TicTacToeMovePoint {
      x: number;
      y: number;
      point: number;
}
export type TicTacToeFlag = -1 | 0 | 1;

export enum TicTacToeStatus {
      'NOT-YET' = '-1',
      'END' = '0',
      'PLAYING' = '1',
}
