import { TicTacToeFlag } from './ticTacToeFlag.type';

export interface TicTacToePlayer {
      id: string;
      flag: TicTacToeFlag;
      time: number;
      ready: boolean;
}
