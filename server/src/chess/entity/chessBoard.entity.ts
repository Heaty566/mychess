import { ChessFlag } from './chess.interface';

export class ChessBoard {
      board: Array<Array<ChessFlag>>;
      turn: boolean;

      constructor() {
            const initCell: ChessFlag = {
                  flag: -1,
                  chessRole: -1,
            };
            const initRow: Array<ChessFlag> = [
                  { ...initCell },
                  { ...initCell },
                  { ...initCell },
                  { ...initCell },
                  { ...initCell },
                  { ...initCell },
                  { ...initCell },
                  { ...initCell },
            ];

            this.board = [[...initRow], [...initRow], [...initRow], [...initRow], [...initRow], [...initRow], [...initRow], [...initRow]];
      }
}
