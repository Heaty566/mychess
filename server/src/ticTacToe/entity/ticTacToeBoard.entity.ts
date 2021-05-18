//---- Entity
import { TicTacToeFlag, TicTacToeStatus, TicTacToePlayer, TTTMoveRedis } from './ticTacToe.interface';

//---- Helper
import { generatorString } from '../../app/helpers/stringGenerator';

export class TicTacToeBoard {
      id: string;
      startDate: Date;
      lastStep: Date;
      status: TicTacToeStatus;
      board: Array<Array<TicTacToeFlag>>;
      currentTurn: boolean;
      users: TicTacToePlayer[];
      winner: TicTacToeFlag;
      chatId: string;
      moves: Array<TTTMoveRedis>;
      eloRedUser: number;
      eloBlueUser: number;

      constructor(readonly isBotMode: boolean) {
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

            this.users = [];
            this.moves = [];
            this.winner = TicTacToeFlag.EMPTY;
            this.id = generatorString(8, 'number');
            this.status = TicTacToeStatus['NOT-YET'];
            this.currentTurn = isBotMode ? true : Boolean(Math.random() < 0.5);
      }
}
