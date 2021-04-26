import { TicTacToe } from './ticTacToe.entity';
import { TicTacToeFlag } from './ticTacToeFlag.type';

export class TicTacToeBoard {
      board: Array<Array<TicTacToeFlag>>;
      readyTotal: number;

      constructor(readonly info: TicTacToe) {
            const initRow: Array<TicTacToeFlag> = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
            this.board = [
                  [...initRow],
                  [...initRow],
                  [...initRow],
                  [...initRow],
                  [...initRow],
                  [...initRow],
                  [...initRow],
                  [...initRow],
                  [...initRow],
                  [...initRow],
                  [...initRow],
                  [...initRow],
                  [...initRow],
                  [...initRow],
            ];
            this.readyTotal = 0;
      }
}
