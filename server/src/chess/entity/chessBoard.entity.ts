import { generatorString } from '../../app/helpers/stringGenerator';
import { ChessFlag, ChessPlayer, ChessRole, ChessStatus, PlayerFlagEnum } from './chess.interface';
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
            this.turn = isBotMode ? true : Boolean(Math.random() < 0.5);
            this.users = [];
            this.winner = PlayerFlagEnum.EMPTY;
            this.status = ChessStatus.NOT_YET;
      }

      initBoard() {
            // Rook
            this.board[0][0] = {
                  flag: 0,
                  chessRole: ChessRole.ROOK,
            };
            this.board[0][7] = {
                  flag: 0,
                  chessRole: ChessRole.ROOK,
            };
            this.board[7][0] = {
                  flag: PlayerFlagEnum.BLACK,
                  chessRole: ChessRole.ROOK,
            };
            this.board[7][7] = {
                  flag: PlayerFlagEnum.BLACK,
                  chessRole: ChessRole.ROOK,
            };
            //Knight
            this.board[0][1] = {
                  flag: PlayerFlagEnum.WHITE,
                  chessRole: ChessRole.KNIGHT,
            };
            this.board[0][6] = {
                  flag: PlayerFlagEnum.WHITE,
                  chessRole: ChessRole.KNIGHT,
            };
            this.board[7][1] = {
                  flag: PlayerFlagEnum.BLACK,
                  chessRole: ChessRole.KNIGHT,
            };
            this.board[7][6] = {
                  flag: PlayerFlagEnum.BLACK,
                  chessRole: ChessRole.KNIGHT,
            };
            //Bishop
            this.board[0][2] = {
                  flag: PlayerFlagEnum.WHITE,
                  chessRole: ChessRole.BISHOP,
            };
            this.board[0][5] = {
                  flag: PlayerFlagEnum.WHITE,
                  chessRole: ChessRole.BISHOP,
            };
            this.board[7][2] = {
                  flag: PlayerFlagEnum.BLACK,
                  chessRole: ChessRole.BISHOP,
            };
            this.board[7][5] = {
                  flag: PlayerFlagEnum.BLACK,
                  chessRole: ChessRole.BISHOP,
            };
            //King
            this.board[0][4] = {
                  flag: PlayerFlagEnum.WHITE,
                  chessRole: ChessRole.KING,
            };
            this.board[7][4] = {
                  flag: PlayerFlagEnum.BLACK,
                  chessRole: ChessRole.KING,
            };
            //Queen
            this.board[0][3] = {
                  flag: PlayerFlagEnum.WHITE,
                  chessRole: ChessRole.QUEEN,
            };
            this.board[7][3] = {
                  flag: PlayerFlagEnum.BLACK,
                  chessRole: ChessRole.QUEEN,
            };
            // Pawn
            for (let i = 0; i <= 7; i++) {
                  this.board[1][i] = {
                        flag: PlayerFlagEnum.WHITE,
                        chessRole: ChessRole.PAWN,
                  };
                  this.board[6][i] = {
                        flag: PlayerFlagEnum.BLACK,
                        chessRole: ChessRole.PAWN,
                  };
            }
      }
}
