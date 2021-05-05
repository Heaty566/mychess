//---- Entity
import { TicTacToe } from './ticTacToe.entity';
import { TicTacToeFlag } from './ticTacToe.interface';
import { TicTacToePlayer } from './ticTacToe.interface';
import { generatorString } from '../../app/helpers/stringGenerator';

export class TicTacToeBoard {
      id: string;
      board: Array<Array<TicTacToeFlag>>;
      currentTurn: boolean;
      users: [TicTacToePlayer, TicTacToePlayer];
      isBotMode: boolean;
      lastStep: Date;

      constructor(readonly info: TicTacToe, isBotMode: boolean) {
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
            this.id = generatorString(8, 'number');
            this.users = [
                  { id: null, ready: false, flag: 0, time: playingTime },
                  { id: null, ready: false, flag: 1, time: playingTime },
            ];
            this.isBotMode = isBotMode;
            this.currentTurn = Boolean(Math.random() < 0.5);
      }
}
