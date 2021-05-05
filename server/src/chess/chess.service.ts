import { Injectable } from '@nestjs/common';
import { AvaibleMove, ChessMove } from './entity/chess.interface';
import { ChessBoard } from './entity/chessBoard.entity';

//---- Repository

@Injectable()
export class ChessService {
      kingAvailableMove(currentPosition: ChessMove, chessBoard: ChessBoard) {
            const result: Array<AvaibleMove> = [];
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
                        result.push({ x, y });
                  }
            }
            return result;
      }

      knightAvailableMove(currentPosition: ChessMove, chessBoard: ChessBoard) {
            const result: Array<AvaibleMove> = [];
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
                        result.push({ x, y });
                  }
            }
            return result;
      }

      rookAvailableMove(currentPosition: ChessMove, chessBoard: ChessBoard) {
            const result: Array<AvaibleMove> = [];
            // Right
            let x = currentPosition.x + 1;
            let y = currentPosition.y;
            while (x >= 0 && x < chessBoard.board.length && y >= 0 && y < chessBoard.board.length) {
                  if (chessBoard.board[x][y].flag === currentPosition.flag) break;

                  if (chessBoard.board[x][y].flag !== currentPosition.flag) {
                        result.push({ x, y });
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
                        result.push({ x, y });
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
                        result.push({ x, y });
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
                        result.push({ x, y });
                        if (chessBoard.board[x][y].flag >= 0) break;
                  }

                  y--;
            }

            return result;
      }

      bishopAvailableMove(currentPosition: ChessMove, chessBoard: ChessBoard) {
            const result: Array<AvaibleMove> = [];
            // Top - Left
            let x = currentPosition.x - 1;
            let y = currentPosition.y + 1;

            while (x >= 0 && x < chessBoard.board.length && y >= 0 && y < chessBoard.board.length) {
                  if (chessBoard.board[x][y].flag === currentPosition.flag) break;

                  if (chessBoard.board[x][y].flag !== currentPosition.flag) {
                        result.push({ x, y });
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
                        result.push({ x, y });
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
                        result.push({ x, y });
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
                        result.push({ x, y });
                        if (chessBoard.board[x][y].flag >= 0) break;
                  }

                  x--;
                  y--;
            }

            return result;
      }

      queenAvailableMove(currentPosition: ChessMove, chessBoard: ChessBoard) {
            const result: Array<AvaibleMove> = [];
            const moveLikeBishop = this.bishopAvailableMove(currentPosition, chessBoard);
            const moveLikeRook = this.rookAvailableMove(currentPosition, chessBoard);
            result.push(...moveLikeBishop);
            result.push(...moveLikeRook);

            return result;
      }
}
