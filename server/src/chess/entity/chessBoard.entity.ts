import { Chess } from './chess.entity';
import { ChessFlag, ChessRole } from './chess.interface';

export class ChessBoard {
      board: Array<Array<ChessFlag>>;
      turn: boolean;
      id: string;

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

      initBoard() {
            // Rook
            this.board[0][0] = {
                  flag: 0,
                  chessRole: ChessRole.ROOK,
            };
            this.board[7][0] = {
                  flag: 0,
                  chessRole: ChessRole.ROOK,
            };
            this.board[7][0] = {
                  flag: 1,
                  chessRole: ChessRole.ROOK,
            };
            this.board[7][7] = {
                  flag: 1,
                  chessRole: ChessRole.ROOK,
            };
            //Knight
            this.board[1][0] = {
                  flag: 0,
                  chessRole: ChessRole.KNIGHT,
            };
            this.board[6][0] = {
                  flag: 0,
                  chessRole: ChessRole.KNIGHT,
            };
            this.board[1][7] = {
                  flag: 1,
                  chessRole: ChessRole.KNIGHT,
            };
            this.board[6][7] = {
                  flag: 1,
                  chessRole: ChessRole.KNIGHT,
            };
            //Bishop
            this.board[2][0] = {
                  flag: 0,
                  chessRole: ChessRole.BISHOP,
            };
            this.board[5][0] = {
                  flag: 0,
                  chessRole: ChessRole.BISHOP,
            };
            this.board[2][7] = {
                  flag: 1,
                  chessRole: ChessRole.BISHOP,
            };
            this.board[5][7] = {
                  flag: 1,
                  chessRole: ChessRole.BISHOP,
            };
            //King
            this.board[4][0] = {
                  flag: 0,
                  chessRole: ChessRole.KING,
            };
            this.board[4][7] = {
                  flag: 1,
                  chessRole: ChessRole.KING,
            };
            //Queen
            this.board[5][0] = {
                  flag: 0,
                  chessRole: ChessRole.QUEEN,
            };
            this.board[5][7] = {
                  flag: 1,
                  chessRole: ChessRole.QUEEN,
            };
            // Pawn
            for (let i = 0; i <= 7; i++) {
                  this.board[i][1] = {
                        flag: 0,
                        chessRole: ChessRole.PAWN,
                  };
                  this.board[i][6] = {
                        flag: 1,
                        chessRole: ChessRole.PAWN,
                  };
            }
      }
}
