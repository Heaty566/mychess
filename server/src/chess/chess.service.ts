import { Injectable } from '@nestjs/common';
import { Chess } from './entity/chess.entity';
import { ChessMove, ChessRole, PlayerFlagEnum } from './entity/chess.interface';
import { ChessBoard } from './entity/chessBoard.entity';

//---- Repository

@Injectable()
export class ChessService {
      private pawnAvailableMove(currentPosition: ChessMove, chessBoard: ChessBoard) {
            const result: Array<ChessMove> = [];
            // pawn can not appear on row 0 or 7
            if (currentPosition.y === 0 || currentPosition.y === 7) return result;
            if (currentPosition.flag === PlayerFlagEnum.WHITE) {
                  const x = currentPosition.x;
                  const y = currentPosition.y;
                  // in the first move, pawn can move forward 2 square
                  if (y === 1 && chessBoard.board[x][y + 1].flag === PlayerFlagEnum.EMPTY && chessBoard.board[x][y + 2].flag === PlayerFlagEnum.EMPTY)
                        result.push({ x: x, y: y + 2, flag: PlayerFlagEnum.EMPTY, chessRole: ChessRole.EMPTY });

                  // move forward 1 square
                  if (y + 1 <= 7 && chessBoard.board[x][y + 1].flag === PlayerFlagEnum.EMPTY)
                        result.push({ x: x, y: y + 1, flag: PlayerFlagEnum.EMPTY, chessRole: ChessRole.EMPTY });

                  // eat opposite color piece
                  if (
                        x - 1 >= 0 &&
                        y + 1 <= 7 &&
                        chessBoard.board[x - 1][y + 1].flag >= 0 &&
                        chessBoard.board[x - 1][y + 1].flag !== currentPosition.flag
                  )
                        result.push({ x: x - 1, y: y + 1, flag: PlayerFlagEnum.BLACK, chessRole: chessBoard.board[x - 1][y + 1].chessRole });

                  if (
                        x + 1 <= 7 &&
                        y + 1 <= 7 &&
                        chessBoard.board[x + 1][y + 1].flag >= 0 &&
                        chessBoard.board[x + 1][y + 1].flag !== currentPosition.flag
                  )
                        result.push({ x: x + 1, y: y + 1, flag: PlayerFlagEnum.BLACK, chessRole: chessBoard.board[x + 1][y + 1].chessRole });
            } else if (currentPosition.flag === PlayerFlagEnum.BLACK) {
                  const x = currentPosition.x;
                  const y = currentPosition.y;

                  if (y === 6 && chessBoard.board[x][y - 1].flag === PlayerFlagEnum.EMPTY && chessBoard.board[x][y - 2].flag === PlayerFlagEnum.EMPTY)
                        result.push({ x: x, y: y - 2, flag: PlayerFlagEnum.EMPTY, chessRole: ChessRole.EMPTY });

                  if (y - 1 >= 0 && chessBoard.board[x][y - 1].flag === PlayerFlagEnum.EMPTY)
                        result.push({ x: x, y: y - 1, flag: PlayerFlagEnum.EMPTY, chessRole: ChessRole.EMPTY });

                  if (
                        x - 1 >= 0 &&
                        y - 1 >= 0 &&
                        chessBoard.board[x - 1][y - 1].flag >= 0 &&
                        chessBoard.board[x - 1][y - 1].flag !== currentPosition.flag
                  )
                        result.push({ x: x - 1, y: y - 1, flag: PlayerFlagEnum.BLACK, chessRole: chessBoard.board[x - 1][y - 1].chessRole });

                  if (
                        x + 1 <= 7 &&
                        y - 1 >= 0 &&
                        chessBoard.board[x + 1][y - 1].flag >= 0 &&
                        chessBoard.board[x + 1][y - 1].flag !== currentPosition.flag
                  )
                        result.push({ x: x + 1, y: y - 1, flag: PlayerFlagEnum.BLACK, chessRole: chessBoard.board[x + 1][y - 1].chessRole });
            }
            return result;
      }

      private kingAvailableMove(currentPosition: ChessMove, chessBoard: ChessBoard): Array<ChessMove> {
            const result: Array<ChessMove> = [];
            const kingMoveX = [1, 1, 1, 0, 0, -1, -1, -1];
            const kingMoveY = [1, 0, -1, 1, -1, 1, 0, -1];

            for (let i = 0; i <= 7; i++) {
                  const x = currentPosition.x + kingMoveX[i];
                  const y = currentPosition.y + kingMoveY[i];

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

      private knightAvailableMove(currentPosition: ChessMove, chessBoard: ChessBoard): Array<ChessMove> {
            const result: Array<ChessMove> = [];
            const knightMoveX = [2, 2, -2, -2, 1, 1, -1, -1];
            const knightMoveY = [1, -1, 1, -1, 2, -2, 2, -2];
            for (let i = 0; i <= 7; i++) {
                  const x = currentPosition.x + knightMoveX[i];
                  const y = currentPosition.y + knightMoveY[i];

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

      private rookAvailableMove(currentPosition: ChessMove, chessBoard: ChessBoard): Array<ChessMove> {
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

      private bishopAvailableMove(currentPosition: ChessMove, chessBoard: ChessBoard): Array<ChessMove> {
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

      private queenAvailableMove(currentPosition: ChessMove, chessBoard: ChessBoard): Array<ChessMove> {
            const result: Array<ChessMove> = [];
            const moveLikeBishop = this.bishopAvailableMove(currentPosition, chessBoard);
            const moveLikeRook = this.rookAvailableMove(currentPosition, chessBoard);
            result.push(...moveLikeBishop);
            result.push(...moveLikeRook);

            return result;
      }

      getKing(flag, chessBoard: ChessBoard): ChessMove {
            for (let i = 0; i <= 7; i++) {
                  for (let j = 0; j <= 7; j++) {
                        if (chessBoard.board[i][j].flag === flag && chessBoard.board[i][j].chessRole === ChessRole.KING) {
                              return {
                                    x: i,
                                    y: j,
                                    flag: flag,
                                    chessRole: ChessRole.KING,
                              };
                        }
                  }
            }

            return null;
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
            const knightX = [2, 2, -2, -2, 1, 1, -1, -1];
            const knightY = [1, -1, 1, -1, 2, -2, 2, -2];
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
                  const pawnX = [1, -1];
                  const pawnY = [1, 1];
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
                  const pawnX = [1, -1];
                  const pawnY = [-1, -1];
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
            const kingX = [1, 1, 1, 0, 0, -1, -1, -1];
            const kingY = [1, 0, -1, 1, -1, 1, 0, -1];
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

      canMove(curPos: ChessMove, desPos: ChessMove, chessBoard: ChessBoard): boolean {
            const tmpDestinationPosition = desPos;
            let canMove = true;
            chessBoard.board[desPos.x][desPos.y] = chessBoard.board[curPos.x][curPos.y];

            chessBoard.board[curPos.x][curPos.y] = {
                  flag: -1,
                  chessRole: ChessRole.EMPTY,
            };

            const kingPosition: ChessMove = this.getKing(curPos.flag, chessBoard);
            if (this.kingIsChecked(kingPosition, chessBoard)) canMove = false;

            chessBoard.board[curPos.x][curPos.y] = chessBoard.board[desPos.x][desPos.y];

            chessBoard.board[desPos.x][desPos.y] = {
                  flag: tmpDestinationPosition.flag,
                  chessRole: tmpDestinationPosition.chessRole,
            };

            return canMove;
      }

      private rookLegalMove(currentPosition: ChessMove, chessBoard: ChessBoard): Array<ChessMove> {
            const availableMove = this.rookAvailableMove(currentPosition, chessBoard);
            const legalMove: Array<ChessMove> = [];
            availableMove.forEach((move) => {
                  if (this.canMove(currentPosition, move, chessBoard)) legalMove.push(move);
            });

            return legalMove;
      }

      private bishopLegalMove(currentPosition: ChessMove, chessBoard: ChessBoard): Array<ChessMove> {
            const availableMove = this.bishopAvailableMove(currentPosition, chessBoard);
            const legalMove: Array<ChessMove> = [];
            availableMove.forEach((move) => {
                  if (this.canMove(currentPosition, move, chessBoard)) legalMove.push(move);
            });

            return legalMove;
      }

      private queenLegalMove(currentPosition: ChessMove, chessBoard: ChessBoard): Array<ChessMove> {
            const availableMove = this.queenAvailableMove(currentPosition, chessBoard);
            const legalMove: Array<ChessMove> = [];
            availableMove.forEach((move) => {
                  if (this.canMove(currentPosition, move, chessBoard)) legalMove.push(move);
            });

            return legalMove;
      }

      private knightLegalMove(currentPosition: ChessMove, chessBoard: ChessBoard): Array<ChessMove> {
            const availableMove = this.knightAvailableMove(currentPosition, chessBoard);
            const legalMove: Array<ChessMove> = [];
            availableMove.forEach((move) => {
                  if (this.canMove(currentPosition, move, chessBoard)) legalMove.push(move);
            });

            return legalMove;
      }

      private kingLegalMove(currentPosition: ChessMove, chessBoard: ChessBoard): Array<ChessMove> {
            const availableMove = this.kingAvailableMove(currentPosition, chessBoard);
            const legalMove: Array<ChessMove> = [];
            availableMove.forEach((move) => {
                  if (this.canMove(currentPosition, move, chessBoard)) legalMove.push(move);
            });

            return legalMove;
      }

      private pawnLegalMove(currentPosition: ChessMove, chessBoard: ChessBoard): Array<ChessMove> {
            const availableMove = this.pawnAvailableMove(currentPosition, chessBoard);
            const legalMove: Array<ChessMove> = [];
            availableMove.forEach((move) => {
                  if (this.canMove(currentPosition, move, chessBoard)) legalMove.push(move);
            });

            return legalMove;
      }

      legalMove(currentPosition: ChessMove, chessBoard: ChessBoard): Array<ChessMove> {
            switch (currentPosition.chessRole) {
                  case ChessRole.BISHOP:
                        return this.bishopLegalMove(currentPosition, chessBoard);
                  case ChessRole.ROOK:
                        return this.rookLegalMove(currentPosition, chessBoard);
                  case ChessRole.QUEEN:
                        return this.queenLegalMove(currentPosition, chessBoard);
                  case ChessRole.KNIGHT:
                        return this.knightLegalMove(currentPosition, chessBoard);
                  case ChessRole.PAWN:
                        return this.pawnLegalMove(currentPosition, chessBoard);
                  case ChessRole.KING:
                        return this.kingLegalMove(currentPosition, chessBoard);
                  case ChessRole.EMPTY:
                        return [];
            }
      }

      checkmate(flag: 0 | 1, chessBoard: ChessBoard): boolean {
            const kingPosition: ChessMove = this.getKing(flag, chessBoard);
            if (!this.kingIsChecked(kingPosition, chessBoard)) return false;

            for (let i = 0; i <= 7; i++) {
                  for (let j = 0; j <= 7; j++) {
                        if (chessBoard.board[i][j].flag === flag) {
                              const legalMove: Array<ChessMove> = this.legalMove(
                                    { x: i, y: j, flag: chessBoard.board[i][j].flag, chessRole: chessBoard.board[i][j].chessRole },
                                    chessBoard,
                              );
                              if (legalMove.length > 0) return false;
                        }
                  }
            }

            return true;
      }

      stalemate(flag: 0 | 1, chessBoard: ChessBoard): boolean {
            const kingPosition: ChessMove = this.getKing(flag, chessBoard);
            if (this.kingIsChecked(kingPosition, chessBoard)) return false;

            for (let i = 0; i <= 7; i++) {
                  for (let j = 0; j <= 7; j++) {
                        if (chessBoard.board[i][j].flag === flag) {
                              const legalMove: Array<ChessMove> = this.legalMove(
                                    { x: i, y: j, flag: chessBoard.board[i][j].flag, chessRole: chessBoard.board[i][j].chessRole },
                                    chessBoard,
                              );
                              if (legalMove.length > 0) return false;
                        }
                  }
            }

            return true;
      }

      playAMove(curPos: ChessMove, desPos: ChessMove, chessBoard: ChessBoard) {
            chessBoard.board[desPos.x][desPos.y] = chessBoard.board[curPos.x][curPos.y];

            chessBoard.board[curPos.x][curPos.y] = {
                  flag: -1,
                  chessRole: ChessRole.EMPTY,
            };
      }
}
