//---- Helper
import { generatorString } from '../../app/helpers/stringGenerator';

//---- Entity
import { ChessFlag, ChessPlayer, ChessRole, ChessStatus, PlayerFlagEnum, ChessMoveCoordinates } from './chess.interface';
import { ChessMove } from './chessMove.entity';

export class ChessBoard {
      board: Array<Array<ChessFlag>>;
      moves: Array<ChessMove>;
      turn: boolean;
      id: string;
      users: ChessPlayer[];
      winner: PlayerFlagEnum;
      startDate: Date;
      status: ChessStatus;
      chatId: string;
      lastStep: Date;
      eloBlackUser: number;
      eloWhiteUser: number;
      checkedPiece: ChessMoveCoordinates | undefined;

      constructor(readonly isBotMode: boolean) {
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
            this.moves = [];
            this.id = generatorString(8, 'number');
            this.turn = false; // false = 0 = white, true = 1 = black
            this.users = [];
            this.winner = PlayerFlagEnum.EMPTY;
            this.status = ChessStatus.NOT_YET;
            this.checkedPiece = undefined;
      }

      initBoard() {
            // Rook
            this.board[0][0] = {
                  flag: PlayerFlagEnum.WHITE,
                  chessRole: ChessRole.ROOK,
            };
            this.board[7][0] = {
                  flag: PlayerFlagEnum.WHITE,
                  chessRole: ChessRole.ROOK,
            };
            this.board[0][7] = {
                  flag: PlayerFlagEnum.BLACK,
                  chessRole: ChessRole.ROOK,
            };
            this.board[7][7] = {
                  flag: PlayerFlagEnum.BLACK,
                  chessRole: ChessRole.ROOK,
            };
            //Knight
            this.board[1][0] = {
                  flag: PlayerFlagEnum.WHITE,
                  chessRole: ChessRole.KNIGHT,
            };
            this.board[6][0] = {
                  flag: PlayerFlagEnum.WHITE,
                  chessRole: ChessRole.KNIGHT,
            };
            this.board[1][7] = {
                  flag: PlayerFlagEnum.BLACK,
                  chessRole: ChessRole.KNIGHT,
            };
            this.board[6][7] = {
                  flag: PlayerFlagEnum.BLACK,
                  chessRole: ChessRole.KNIGHT,
            };
            //Bishop
            this.board[2][0] = {
                  flag: PlayerFlagEnum.WHITE,
                  chessRole: ChessRole.BISHOP,
            };
            this.board[5][0] = {
                  flag: PlayerFlagEnum.WHITE,
                  chessRole: ChessRole.BISHOP,
            };
            this.board[2][7] = {
                  flag: PlayerFlagEnum.BLACK,
                  chessRole: ChessRole.BISHOP,
            };
            this.board[5][7] = {
                  flag: PlayerFlagEnum.BLACK,
                  chessRole: ChessRole.BISHOP,
            };
            //King
            this.board[4][0] = {
                  flag: PlayerFlagEnum.WHITE,
                  chessRole: ChessRole.KING,
            };
            this.board[4][7] = {
                  flag: PlayerFlagEnum.BLACK,
                  chessRole: ChessRole.KING,
            };
            //Queen
            this.board[3][0] = {
                  flag: PlayerFlagEnum.WHITE,
                  chessRole: ChessRole.QUEEN,
            };
            this.board[3][7] = {
                  flag: PlayerFlagEnum.BLACK,
                  chessRole: ChessRole.QUEEN,
            };
            // Pawn
            for (let i = 0; i <= 7; i++) {
                  this.board[i][1] = {
                        flag: PlayerFlagEnum.WHITE,
                        chessRole: ChessRole.PAWN,
                  };
                  this.board[i][6] = {
                        flag: PlayerFlagEnum.BLACK,
                        chessRole: ChessRole.PAWN,
                  };
            }
      }
}
