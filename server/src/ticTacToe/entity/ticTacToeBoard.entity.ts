import { TicTacToe } from './ticTacToe.entity';
import { TicTacToeFlag } from './ticTacToeFlag.type';

export class TicTacToeBoard {
      board: Array<Array<TicTacToeFlag>>;

      constructor(readonly info: TicTacToe) {
            const initRow: Array<TicTacToeFlag> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            this.board = [
                  initRow,
                  initRow,
                  initRow,
                  initRow,
                  initRow,
                  initRow,
                  initRow,
                  initRow,
                  initRow,
                  initRow,
                  initRow,
                  initRow,
                  initRow,
                  initRow,
            ];
      }
}
