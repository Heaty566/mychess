import { Injectable } from '@nestjs/common';
import { ChessMove, ChessRole } from './entity/chess.interface';
import { ChessBoard } from './entity/chessBoard.entity';

//---- Repository

@Injectable()
export class ChessService {
      kingAvailableMove(currentPosition: ChessMove, chessBoard: ChessBoard): Array<ChessMove> {
            const result: Array<ChessMove> = [];
            let kingMoveX = [1, 1, 1, 0, 0, -1, -1, -1];
            let kingMoveY = [1, 0, -1, 1, -1, 1, 0, -1];

            for (let i = 0; i <= 7; i++) {
                  let x = currentPosition.x + kingMoveX[i];
                  let y = currentPosition.y + kingMoveY[i];

                  if (
                        x >= 0 &&
                        x < chessBoard.board.length &&
                        y >= 0 &&
                        y < chessBoard.board.length &&
                        chessBoard.board[x][y].flag !== currentPosition.flag
                  ) {
                        result.push({ x: x, y: y, flag: chessBoard.board[x][y].flag, chessRole: chessBoard.board[x][y].chessRole });
                  }
            }
            return result;
      }

      knightAvailableMove(currentPosition: ChessMove, chessBoard: ChessBoard): Array<ChessMove> {
            const result: Array<ChessMove> = [];
            let knightMoveX = [2, 2, -2, -2, 1, 1, -1, -1];
            let knightMoveY = [1, -1, 1, -1, 2, -2, 2, -2];
            for (let i = 0; i <= 7; i++) {
                  let x = currentPosition.x + knightMoveX[i];
                  let y = currentPosition.y + knightMoveY[i];

                  if (
                        x >= 0 &&
                        x < chessBoard.board.length &&
                        y >= 0 &&
                        y < chessBoard.board.length &&
                        chessBoard.board[x][y].flag !== currentPosition.flag
                  ) {
                        result.push({ x: x, y: y, flag: chessBoard.board[x][y].flag, chessRole: chessBoard.board[x][y].chessRole });
                  }
            }
            return result;
      }

      rookAvailableMove(currentPosition: ChessMove, chessBoard: ChessBoard): Array<ChessMove> {
            const result: Array<ChessMove> = [];
            // Right
            let x = currentPosition.x + 1;
            let y = currentPosition.y;
            while (x >= 0 && x < chessBoard.board.length && y >= 0 && y < chessBoard.board.length) {
                  if (chessBoard.board[x][y].flag === currentPosition.flag) break;

                  if (chessBoard.board[x][y].flag !== currentPosition.flag) {
                        result.push({ x: x, y: y, flag: chessBoard.board[x][y].flag, chessRole: chessBoard.board[x][y].chessRole });
                        if (chessBoard.board[x][y].flag >= 0) break;
                  }

                  x++;
            }

            // Left
            x = currentPosition.x - 1;
            y = currentPosition.y;
            while (x >= 0 && x < chessBoard.board.length && y >= 0 && y < chessBoard.board.length) {
                  if (chessBoard.board[x][y].flag === currentPosition.flag) break;

                  if (chessBoard.board[x][y].flag !== currentPosition.flag) {
                        result.push({ x: x, y: y, flag: chessBoard.board[x][y].flag, chessRole: chessBoard.board[x][y].chessRole });
                        if (chessBoard.board[x][y].flag >= 0) break;
                  }

                  x--;
            }

            // Top
            x = currentPosition.x;
            y = currentPosition.y + 1;
            while (x >= 0 && x < chessBoard.board.length && y >= 0 && y < chessBoard.board.length) {
                  if (chessBoard.board[x][y].flag === currentPosition.flag) break;

                  if (chessBoard.board[x][y].flag !== currentPosition.flag) {
                        result.push({ x: x, y: y, flag: chessBoard.board[x][y].flag, chessRole: chessBoard.board[x][y].chessRole });
                        if (chessBoard.board[x][y].flag >= 0) break;
                  }

                  y++;
            }

            // Bottom
            x = currentPosition.x;
            y = currentPosition.y - 1;
            while (x >= 0 && x < chessBoard.board.length && y >= 0 && y < chessBoard.board.length) {
                  if (chessBoard.board[x][y].flag === currentPosition.flag) break;

                  if (chessBoard.board[x][y].flag !== currentPosition.flag) {
                        result.push({ x: x, y: y, flag: chessBoard.board[x][y].flag, chessRole: chessBoard.board[x][y].chessRole });
                        if (chessBoard.board[x][y].flag >= 0) break;
                  }

                  y--;
            }

            return result;
      }

      bishopAvailableMove(currentPosition: ChessMove, chessBoard: ChessBoard): Array<ChessMove> {
            const result: Array<ChessMove> = [];
            // Top - Left
            let x = currentPosition.x - 1;
            let y = currentPosition.y + 1;

            while (x >= 0 && x < chessBoard.board.length && y >= 0 && y < chessBoard.board.length) {
                  if (chessBoard.board[x][y].flag === currentPosition.flag) break;

                  if (chessBoard.board[x][y].flag !== currentPosition.flag) {
                        result.push({ x: x, y: y, flag: chessBoard.board[x][y].flag, chessRole: chessBoard.board[x][y].chessRole });
                        if (chessBoard.board[x][y].flag >= 0) break;
                  }

                  x--;
                  y++;
            }

            // Top - Right
            x = currentPosition.x + 1;
            y = currentPosition.y + 1;

            while (x >= 0 && x < chessBoard.board.length && y >= 0 && y < chessBoard.board.length) {
                  if (chessBoard.board[x][y].flag === currentPosition.flag) break;

                  if (chessBoard.board[x][y].flag !== currentPosition.flag) {
                        result.push({ x: x, y: y, flag: chessBoard.board[x][y].flag, chessRole: chessBoard.board[x][y].chessRole });
                        if (chessBoard.board[x][y].flag >= 0) break;
                  }

                  x++;
                  y++;
            }

            // Bottom - Right
            x = currentPosition.x + 1;
            y = currentPosition.y - 1;

            while (x >= 0 && x < chessBoard.board.length && y >= 0 && y < chessBoard.board.length) {
                  if (chessBoard.board[x][y].flag === currentPosition.flag) break;

                  if (chessBoard.board[x][y].flag !== currentPosition.flag) {
                        result.push({ x: x, y: y, flag: chessBoard.board[x][y].flag, chessRole: chessBoard.board[x][y].chessRole });
                        if (chessBoard.board[x][y].flag >= 0) break;
                  }

                  x++;
                  y--;
            }

            // Bottom - Left
            x = currentPosition.x - 1;
            y = currentPosition.y - 1;

            while (x >= 0 && x < chessBoard.board.length && y >= 0 && y < chessBoard.board.length) {
                  if (chessBoard.board[x][y].flag === currentPosition.flag) break;

                  if (chessBoard.board[x][y].flag !== currentPosition.flag) {
                        result.push({ x: x, y: y, flag: chessBoard.board[x][y].flag, chessRole: chessBoard.board[x][y].chessRole });
                        if (chessBoard.board[x][y].flag >= 0) break;
                  }

                  x--;
                  y--;
            }

            return result;
      }

      queenAvailableMove(currentPosition: ChessMove, chessBoard: ChessBoard): Array<ChessMove> {
            const result: Array<ChessMove> = [];
            const moveLikeBishop = this.bishopAvailableMove(currentPosition, chessBoard);
            const moveLikeRook = this.rookAvailableMove(currentPosition, chessBoard);
            result.push(...moveLikeBishop);
            result.push(...moveLikeRook);

            return result;
      }

      kingIsChecked(currentPosition: ChessMove, chessBoard: ChessBoard): boolean {
            // Check rook, queen
            // Right
            let x = currentPosition.x + 1;
            let y = currentPosition.y;
            while (x >= 0 && x < chessBoard.board.length && y >= 0 && y < chessBoard.board.length) {
                  if (chessBoard.board[x][y].flag === currentPosition.flag) break;
                  else if (
                        chessBoard.board[x][y].flag !== currentPosition.flag &&
                        chessBoard.board[x][y].flag >= 0 &&
                        (chessBoard.board[x][y].chessRole === ChessRole.ROOK || chessBoard.board[x][y].chessRole === ChessRole.QUEEN)
                  ) {
                        return true;
                  }
                  x++;
            }
            // Left
            x = currentPosition.x - 1;
            y = currentPosition.y;
            while (x >= 0 && x < chessBoard.board.length && y >= 0 && y < chessBoard.board.length) {
                  if (chessBoard.board[x][y].flag === currentPosition.flag) break;
                  else if (
                        chessBoard.board[x][y].flag !== currentPosition.flag &&
                        chessBoard.board[x][y].flag >= 0 &&
                        (chessBoard.board[x][y].chessRole === ChessRole.ROOK || chessBoard.board[x][y].chessRole === ChessRole.QUEEN)
                  ) {
                        return true;
                  }
                  x--;
            }
            // Top
            x = currentPosition.x;
            y = currentPosition.y + 1;
            while (x >= 0 && x < chessBoard.board.length && y >= 0 && y < chessBoard.board.length) {
                  if (chessBoard.board[x][y].flag === currentPosition.flag) break;
                  else if (
                        chessBoard.board[x][y].flag !== currentPosition.flag &&
                        chessBoard.board[x][y].flag >= 0 &&
                        (chessBoard.board[x][y].chessRole === ChessRole.ROOK || chessBoard.board[x][y].chessRole === ChessRole.QUEEN)
                  ) {
                        return true;
                  }
                  y++;
            }
            // Bottom
            x = currentPosition.x;
            y = currentPosition.y - 1;
            while (x >= 0 && x < chessBoard.board.length && y >= 0 && y < chessBoard.board.length) {
                  if (chessBoard.board[x][y].flag === currentPosition.flag) break;
                  else if (
                        chessBoard.board[x][y].flag !== currentPosition.flag &&
                        chessBoard.board[x][y].flag >= 0 &&
                        (chessBoard.board[x][y].chessRole === ChessRole.ROOK || chessBoard.board[x][y].chessRole === ChessRole.QUEEN)
                  ) {
                        return true;
                  }
                  y--;
            }

            // Check bishop, queen
            // Top - left
            x = currentPosition.x - 1;
            y = currentPosition.y + 1;
            while (x >= 0 && x < chessBoard.board.length && y >= 0 && y < chessBoard.board.length) {
                  if (chessBoard.board[x][y].flag === currentPosition.flag) break;
                  else if (
                        chessBoard.board[x][y].flag !== currentPosition.flag &&
                        chessBoard.board[x][y].flag >= 0 &&
                        (chessBoard.board[x][y].chessRole === ChessRole.BISHOP || chessBoard.board[x][y].chessRole === ChessRole.QUEEN)
                  ) {
                        return true;
                  }
                  x--;
                  y++;
            }
            // Top - right
            x = currentPosition.x + 1;
            y = currentPosition.y + 1;
            while (x >= 0 && x < chessBoard.board.length && y >= 0 && y < chessBoard.board.length) {
                  if (chessBoard.board[x][y].flag === currentPosition.flag) break;
                  else if (
                        chessBoard.board[x][y].flag !== currentPosition.flag &&
                        chessBoard.board[x][y].flag >= 0 &&
                        (chessBoard.board[x][y].chessRole === ChessRole.BISHOP || chessBoard.board[x][y].chessRole === ChessRole.QUEEN)
                  ) {
                        return true;
                  }
                  x++;
                  y++;
            }
            // Bottom - right
            x = currentPosition.x + 1;
            y = currentPosition.y - 1;
            while (x >= 0 && x < chessBoard.board.length && y >= 0 && y < chessBoard.board.length) {
                  if (chessBoard.board[x][y].flag === currentPosition.flag) break;
                  else if (
                        chessBoard.board[x][y].flag !== currentPosition.flag &&
                        chessBoard.board[x][y].flag >= 0 &&
                        (chessBoard.board[x][y].chessRole === ChessRole.BISHOP || chessBoard.board[x][y].chessRole === ChessRole.QUEEN)
                  ) {
                        return true;
                  }
                  x++;
                  y--;
            }
            // Bottom - left
            x = currentPosition.x - 1;
            y = currentPosition.y - 1;
            while (x >= 0 && x < chessBoard.board.length && y >= 0 && y < chessBoard.board.length) {
                  if (chessBoard.board[x][y].flag === currentPosition.flag) break;
                  else if (
                        chessBoard.board[x][y].flag !== currentPosition.flag &&
                        chessBoard.board[x][y].flag >= 0 &&
                        (chessBoard.board[x][y].chessRole === ChessRole.BISHOP || chessBoard.board[x][y].chessRole === ChessRole.QUEEN)
                  ) {
                        return true;
                  }
                  x--;
                  y--;
            }

            // Check knight
            let knightX = [2, 2, -2, -2, 1, 1, -1, -1];
            let knightY = [1, -1, 1, -1, 2, -2, 2, -2];
            for (let i = 0; i <= 7; i++) {
                  x = currentPosition.x + knightX[i];
                  y = currentPosition.y + knightY[i];
                  if (x >= 0 && x < chessBoard.board.length && y >= 0 && y < chessBoard.board.length) {
                        if (
                              chessBoard.board[x][y].flag >= 0 &&
                              chessBoard.board[x][y].flag != currentPosition.flag &&
                              chessBoard.board[x][y].chessRole === ChessRole.KNIGHT
                        ) {
                              return true;
                        }
                  }
            }

            // Check pawn
            if (currentPosition.flag === 0) {
                  // white king
                  let pawnX = [1, -1];
                  let pawnY = [1, 1];
                  for (let i = 0; i <= 1; i++) {
                        x = currentPosition.x + pawnX[i];
                        y = currentPosition.y + pawnY[i];
                        if (x >= 0 && x < chessBoard.board.length && y >= 0 && y < chessBoard.board.length) {
                              if (
                                    chessBoard.board[x][y].flag >= 0 &&
                                    chessBoard.board[x][y].flag != currentPosition.flag &&
                                    chessBoard.board[x][y].chessRole === ChessRole.PAWN
                              ) {
                                    return true;
                              }
                        }
                  }
            } else {
                  // black king
                  let pawnX = [1, -1];
                  let pawnY = [-1, -1];
                  for (let i = 0; i <= 1; i++) {
                        x = currentPosition.x + pawnX[i];
                        y = currentPosition.y + pawnY[i];
                        if (x >= 0 && x < chessBoard.board.length && y >= 0 && y < chessBoard.board.length) {
                              if (
                                    chessBoard.board[x][y].flag >= 0 &&
                                    chessBoard.board[x][y].flag != currentPosition.flag &&
                                    chessBoard.board[x][y].chessRole === ChessRole.PAWN
                              ) {
                                    return true;
                              }
                        }
                  }
            }

            // Check king
            let kingX = [1, 1, 1, 0, 0, -1, -1, -1];
            let kingY = [1, 0, -1, 1, -1, 1, 0, -1];
            for (let i = 0; i <= 7; i++) {
                  x = currentPosition.x + kingX[i];
                  y = currentPosition.y + kingY[i];
                  if (x >= 0 && x < chessBoard.board.length && y >= 0 && y < chessBoard.board.length) {
                        if (
                              chessBoard.board[x][y].flag >= 0 &&
                              chessBoard.board[x][y].flag != currentPosition.flag &&
                              chessBoard.board[x][y].chessRole === ChessRole.KING
                        ) {
                              return true;
                        }
                  }
            }
            return false;
      }

      playAMove(currentPosition: ChessMove, destinationPosition: ChessMove, chessBoard: ChessBoard) {
            chessBoard.board[destinationPosition.x][destinationPosition.y] = {
                  flag: currentPosition.flag,
                  chessRole: currentPosition.chessRole,
            };

            chessBoard.board[currentPosition.x][currentPosition.y] = {
                  flag: -1,
                  chessRole: ChessRole.EMPTY,
            };
      }
}
