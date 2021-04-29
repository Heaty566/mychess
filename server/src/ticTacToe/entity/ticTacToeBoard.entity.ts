import { TicTacToe } from './ticTacToe.entity';
import { TicTacToeFlag } from './ticTacToe.interface';
import { TicTacToePlayer } from './ticTacToe.interface';
export class TicTacToeBoard {
      board: Array<Array<TicTacToeFlag>>;
      currentTurn: boolean;
      users: [TicTacToePlayer, TicTacToePlayer];

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
            const playingTime = 15 * 1000 * 60;
            this.users = [
                  { id: null, ready: false, flag: 0, time: playingTime },
                  { id: null, ready: false, flag: 1, time: playingTime },
            ];

            this.currentTurn = Boolean(Math.random() < 0.5);
      }
}
