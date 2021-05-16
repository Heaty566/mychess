import { Injectable } from '@nestjs/common';

//---- Service
import { ChessCommonService } from './chessCommon.service';

//---- Entity
import { ChessMoveRedis, ChessMoveCoordinates, ChessRole, PlayerFlagEnum, ChessFlag, ChessStatus, ChessPlayer } from './entity/chess.interface';
import { ChessMove } from './entity/chessMove.entity';

@Injectable()
export class ChessService {
      constructor(private readonly chessCommonService: ChessCommonService) {}

      private async pawnAvailableMove(currentPosition: ChessMoveCoordinates, boardId: string) {
            const chessBoard = await this.chessCommonService.getBoard(boardId);
            const result: Array<ChessMoveCoordinates> = [];
            // pawn can not appear on row 0 or 7
            if (currentPosition.y === 0 || currentPosition.y === 7) return result;
            if (chessBoard.board[currentPosition.x][currentPosition.y].flag === PlayerFlagEnum.WHITE) {
                  const x = currentPosition.x;
                  const y = currentPosition.y;
                  // in the first move, pawn can move forward 2 square
                  if (y === 1 && chessBoard.board[x][y + 1].flag === PlayerFlagEnum.EMPTY && chessBoard.board[x][y + 2].flag === PlayerFlagEnum.EMPTY)
                        result.push({ x: x, y: y + 2 });

                  // move forward 1 square
                  if (y + 1 <= 7 && chessBoard.board[x][y + 1].flag === PlayerFlagEnum.EMPTY) result.push({ x: x, y: y + 1 });

                  // eat opposite color piece
                  if (
                        x - 1 >= 0 &&
                        y + 1 <= 7 &&
                        chessBoard.board[x - 1][y + 1].flag >= 0 &&
                        chessBoard.board[x - 1][y + 1].flag !== PlayerFlagEnum.WHITE
                  )
                        result.push({ x: x - 1, y: y + 1 });

                  if (
                        x + 1 <= 7 &&
                        y + 1 <= 7 &&
                        chessBoard.board[x + 1][y + 1].flag >= 0 &&
                        chessBoard.board[x + 1][y + 1].flag !== PlayerFlagEnum.WHITE
                  )
                        result.push({ x: x + 1, y: y + 1 });
            } else if (chessBoard.board[currentPosition.x][currentPosition.y].flag === PlayerFlagEnum.BLACK) {
                  const x = currentPosition.x;
                  const y = currentPosition.y;

                  if (y === 6 && chessBoard.board[x][y - 1].flag === PlayerFlagEnum.EMPTY && chessBoard.board[x][y - 2].flag === PlayerFlagEnum.EMPTY)
                        result.push({ x: x, y: y - 2 });

                  if (y - 1 >= 0 && chessBoard.board[x][y - 1].flag === PlayerFlagEnum.EMPTY) result.push({ x: x, y: y - 1 });

                  if (
                        x - 1 >= 0 &&
                        y - 1 >= 0 &&
                        chessBoard.board[x - 1][y - 1].flag >= 0 &&
                        chessBoard.board[x - 1][y - 1].flag !== PlayerFlagEnum.BLACK
                  )
                        result.push({ x: x - 1, y: y - 1 });

                  if (
                        x + 1 <= 7 &&
                        y - 1 >= 0 &&
                        chessBoard.board[x + 1][y - 1].flag >= 0 &&
                        chessBoard.board[x + 1][y - 1].flag !== PlayerFlagEnum.BLACK
                  )
                        result.push({ x: x + 1, y: y - 1 });
            }
            // en passant
            const lastMove: ChessMove = chessBoard.moves[chessBoard.moves.length - 1];

            if (lastMove) {
                  if (chessBoard.board[currentPosition.x][currentPosition.y].flag === PlayerFlagEnum.WHITE && currentPosition.y === 4) {
                        if (lastMove.chessRole === ChessRole.PAWN && lastMove.fromY === 6 && lastMove.toY === 4) {
                              if (lastMove.toX === currentPosition.x + 1) result.push({ x: currentPosition.x + 1, y: 5 });
                              if (lastMove.toX === currentPosition.x - 1) result.push({ x: currentPosition.x - 1, y: 5 });
                        }
                  }

                  if (chessBoard.board[currentPosition.x][currentPosition.y].flag === PlayerFlagEnum.BLACK && currentPosition.y === 3) {
                        if (lastMove.chessRole === ChessRole.PAWN && lastMove.fromY === 1 && lastMove.toY === 3) {
                              if (lastMove.toX === currentPosition.x + 1) result.push({ x: currentPosition.x + 1, y: 2 });
                              if (lastMove.toX === currentPosition.x - 1) result.push({ x: currentPosition.x - 1, y: 2 });
                        }
                  }
            }

            return result;
      }

      private async kingIsMoved(kingColor: PlayerFlagEnum, boardId: string): Promise<boolean> {
            let kingIsMoved = false;
            const chessBoard = await this.chessCommonService.getBoard(boardId);

            chessBoard.moves.forEach((move) => {
                  if (move.chessRole === ChessRole.KING && move.flag === kingColor) kingIsMoved = true;
            });

            return kingIsMoved;
      }

      private async rookKingSiteIsMoved(rookColor: PlayerFlagEnum, boardId: string): Promise<boolean> {
            let rookKingSiteIsMoved = false;
            const chessBoard = await this.chessCommonService.getBoard(boardId);

            chessBoard.moves.forEach((move) => {
                  if (move.chessRole === ChessRole.ROOK && move.fromX === 7) {
                        if (rookColor === PlayerFlagEnum.WHITE && move.fromY === 0) rookKingSiteIsMoved = true;
                        if (rookColor === PlayerFlagEnum.BLACK && move.fromY === 7) rookKingSiteIsMoved = true;
                  }
            });

            return rookKingSiteIsMoved;
      }

      private async rookQueenSiteIsMoved(rookColor: PlayerFlagEnum, boardId: string): Promise<boolean> {
            let rookQueenSiteIsMoved = false;
            const chessBoard = await this.chessCommonService.getBoard(boardId);

            chessBoard.moves.forEach((move) => {
                  if (move.chessRole === ChessRole.ROOK && move.fromX === 0) {
                        if (rookColor === PlayerFlagEnum.WHITE && move.fromY === 0) rookQueenSiteIsMoved = true;
                        if (rookColor === PlayerFlagEnum.BLACK && move.fromY === 7) rookQueenSiteIsMoved = true;
                  }
            });

            return rookQueenSiteIsMoved;
      }

      private async kingAvailableMove(currentPosition: ChessMoveCoordinates, boardId: string) {
            const chessBoard = await this.chessCommonService.getBoard(boardId);
            const result: Array<ChessMoveCoordinates> = [];
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
                        chessBoard.board[x][y].flag !== chessBoard.board[currentPosition.x][currentPosition.y].flag
                  ) {
                        result.push({ x: x, y: y });
                  }
            }

            // castle
            const kingIsMoved = await this.kingIsMoved(chessBoard.board[currentPosition.x][currentPosition.y].flag, boardId);
            const rookKingSiteIsMoved = await this.rookKingSiteIsMoved(chessBoard.board[currentPosition.x][currentPosition.y].flag, boardId);
            const rookQueenSiteIsMoved = await this.rookQueenSiteIsMoved(chessBoard.board[currentPosition.x][currentPosition.y].flag, boardId);

            if (!kingIsMoved && !rookKingSiteIsMoved) {
                  if (
                        currentPosition.x === 4 &&
                        currentPosition.y === 0 &&
                        chessBoard.board[currentPosition.x][currentPosition.y].flag === PlayerFlagEnum.WHITE &&
                        chessBoard.board[5][0].flag === PlayerFlagEnum.EMPTY &&
                        chessBoard.board[6][0].flag === PlayerFlagEnum.EMPTY &&
                        (await this.canMove({ x: 4, y: 0 }, { x: 5, y: 0 }, boardId))
                  )
                        result.push({ x: 6, y: 0 });

                  if (
                        currentPosition.x === 4 &&
                        currentPosition.y === 7 &&
                        chessBoard.board[currentPosition.x][currentPosition.y].flag === PlayerFlagEnum.BLACK &&
                        chessBoard.board[5][7].flag === PlayerFlagEnum.EMPTY &&
                        chessBoard.board[6][7].flag === PlayerFlagEnum.EMPTY &&
                        (await this.canMove({ x: 4, y: 7 }, { x: 5, y: 7 }, boardId))
                  )
                        result.push({ x: 6, y: 7 });
            }

            if (!kingIsMoved && !rookQueenSiteIsMoved) {
                  if (
                        currentPosition.x === 4 &&
                        currentPosition.y === 0 &&
                        chessBoard.board[currentPosition.x][currentPosition.y].flag === PlayerFlagEnum.WHITE &&
                        chessBoard.board[1][0].flag === PlayerFlagEnum.EMPTY &&
                        chessBoard.board[2][0].flag === PlayerFlagEnum.EMPTY &&
                        chessBoard.board[3][0].flag === PlayerFlagEnum.EMPTY &&
                        (await this.canMove({ x: 4, y: 0 }, { x: 3, y: 0 }, boardId))
                  )
                        result.push({ x: 2, y: 0 });

                  if (
                        currentPosition.x === 4 &&
                        currentPosition.y === 7 &&
                        chessBoard.board[currentPosition.x][currentPosition.y].flag === PlayerFlagEnum.BLACK &&
                        chessBoard.board[1][7].flag === PlayerFlagEnum.EMPTY &&
                        chessBoard.board[2][7].flag === PlayerFlagEnum.EMPTY &&
                        chessBoard.board[3][7].flag === PlayerFlagEnum.EMPTY &&
                        (await this.canMove({ x: 4, y: 7 }, { x: 3, y: 7 }, boardId))
                  )
                        result.push({ x: 2, y: 7 });
            }
            return result;
      }

      private async knightAvailableMove(currentPosition: ChessMoveCoordinates, boardId: string) {
            const chessBoard = await this.chessCommonService.getBoard(boardId);
            const result: Array<ChessMoveCoordinates> = [];
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
                        chessBoard.board[x][y].flag !== chessBoard.board[currentPosition.x][currentPosition.y].flag
                  ) {
                        result.push({ x: x, y: y });
                  }
            }
            return result;
      }

      private async rookAvailableMove(currentPosition: ChessMoveCoordinates, boardId: string) {
            const chessBoard = await this.chessCommonService.getBoard(boardId);
            const result: Array<ChessMoveCoordinates> = [];
            // Right
            let x = currentPosition.x + 1;
            let y = currentPosition.y;
            while (x >= 0 && x < chessBoard.board.length && y >= 0 && y < chessBoard.board.length) {
                  if (chessBoard.board[x][y].flag === chessBoard.board[currentPosition.x][currentPosition.y].flag) break;

                  if (chessBoard.board[x][y].flag !== chessBoard.board[currentPosition.x][currentPosition.y].flag) {
                        result.push({ x: x, y: y });
                        if (chessBoard.board[x][y].flag >= 0) break;
                  }

                  x++;
            }

            // Left
            x = currentPosition.x - 1;
            y = currentPosition.y;
            while (x >= 0 && x < chessBoard.board.length && y >= 0 && y < chessBoard.board.length) {
                  if (chessBoard.board[x][y].flag === chessBoard.board[currentPosition.x][currentPosition.y].flag) break;

                  if (chessBoard.board[x][y].flag !== chessBoard.board[currentPosition.x][currentPosition.y].flag) {
                        result.push({ x: x, y: y });
                        if (chessBoard.board[x][y].flag >= 0) break;
                  }

                  x--;
            }

            // Top
            x = currentPosition.x;
            y = currentPosition.y + 1;
            while (x >= 0 && x < chessBoard.board.length && y >= 0 && y < chessBoard.board.length) {
                  if (chessBoard.board[x][y].flag === chessBoard.board[currentPosition.x][currentPosition.y].flag) break;

                  if (chessBoard.board[x][y].flag !== chessBoard.board[currentPosition.x][currentPosition.y].flag) {
                        result.push({ x: x, y: y });
                        if (chessBoard.board[x][y].flag >= 0) break;
                  }

                  y++;
            }

            // Bottom
            x = currentPosition.x;
            y = currentPosition.y - 1;
            while (x >= 0 && x < chessBoard.board.length && y >= 0 && y < chessBoard.board.length) {
                  if (chessBoard.board[x][y].flag === chessBoard.board[currentPosition.x][currentPosition.y].flag) break;

                  if (chessBoard.board[x][y].flag !== chessBoard.board[currentPosition.x][currentPosition.y].flag) {
                        result.push({ x: x, y: y });
                        if (chessBoard.board[x][y].flag >= 0) break;
                  }

                  y--;
            }

            return result;
      }

      private async bishopAvailableMove(currentPosition: ChessMoveCoordinates, boardId: string) {
            const chessBoard = await this.chessCommonService.getBoard(boardId);
            const result: Array<ChessMoveCoordinates> = [];
            // Top - Left
            let x = currentPosition.x - 1;
            let y = currentPosition.y + 1;

            while (x >= 0 && x < chessBoard.board.length && y >= 0 && y < chessBoard.board.length) {
                  if (chessBoard.board[x][y].flag === chessBoard.board[currentPosition.x][currentPosition.y].flag) break;

                  if (chessBoard.board[x][y].flag !== chessBoard.board[currentPosition.x][currentPosition.y].flag) {
                        result.push({ x: x, y: y });
                        if (chessBoard.board[x][y].flag >= 0) break;
                  }

                  x--;
                  y++;
            }

            // Top - Right
            x = currentPosition.x + 1;
            y = currentPosition.y + 1;

            while (x >= 0 && x < chessBoard.board.length && y >= 0 && y < chessBoard.board.length) {
                  if (chessBoard.board[x][y].flag === chessBoard.board[currentPosition.x][currentPosition.y].flag) break;

                  if (chessBoard.board[x][y].flag !== chessBoard.board[currentPosition.x][currentPosition.y].flag) {
                        result.push({ x: x, y: y });
                        if (chessBoard.board[x][y].flag >= 0) break;
                  }

                  x++;
                  y++;
            }

            // Bottom - Right
            x = currentPosition.x + 1;
            y = currentPosition.y - 1;

            while (x >= 0 && x < chessBoard.board.length && y >= 0 && y < chessBoard.board.length) {
                  if (chessBoard.board[x][y].flag === chessBoard.board[currentPosition.x][currentPosition.y].flag) break;

                  if (chessBoard.board[x][y].flag !== chessBoard.board[currentPosition.x][currentPosition.y].flag) {
                        result.push({ x: x, y: y });
                        if (chessBoard.board[x][y].flag >= 0) break;
                  }

                  x++;
                  y--;
            }

            // Bottom - Left
            x = currentPosition.x - 1;
            y = currentPosition.y - 1;

            while (x >= 0 && x < chessBoard.board.length && y >= 0 && y < chessBoard.board.length) {
                  if (chessBoard.board[x][y].flag === chessBoard.board[currentPosition.x][currentPosition.y].flag) break;

                  if (chessBoard.board[x][y].flag !== chessBoard.board[currentPosition.x][currentPosition.y].flag) {
                        result.push({ x: x, y: y });
                        if (chessBoard.board[x][y].flag >= 0) break;
                  }

                  x--;
                  y--;
            }

            return result;
      }

      private async queenAvailableMove(currentPosition: ChessMoveCoordinates, boardId: string) {
            const chessBoard = await this.chessCommonService.getBoard(boardId);
            const result: Array<ChessMoveCoordinates> = [];
            const moveLikeBishop = await this.bishopAvailableMove(currentPosition, chessBoard.id);
            const moveLikeRook = await this.rookAvailableMove(currentPosition, chessBoard.id);
            result.push(...moveLikeBishop);
            result.push(...moveLikeRook);

            return result;
      }

      async getKing(kingColor: PlayerFlagEnum, boardId: string) {
            const chessBoard = await this.chessCommonService.getBoard(boardId);

            for (let i = 0; i <= 7; i++) {
                  for (let j = 0; j <= 7; j++) {
                        if (chessBoard.board[i][j].flag === kingColor && chessBoard.board[i][j].chessRole === ChessRole.KING) {
                              return {
                                    x: i,
                                    y: j,
                                    flag: chessBoard.board[i][j].flag,
                                    chessRole: ChessRole.KING,
                              };
                        }
                  }
            }

            return null;
      }

      async kingIsChecked(currentPosition: ChessMoveRedis, boardId: string): Promise<boolean> {
            const chessBoard = await this.chessCommonService.getBoard(boardId);

            // Check rook, queen
            // Right
            let x = currentPosition.x + 1;
            let y = currentPosition.y;

            while (x >= 0 && x < chessBoard.board.length && y >= 0 && y < chessBoard.board.length) {
                  if (chessBoard.board[x][y].flag !== PlayerFlagEnum.EMPTY) {
                        if (
                              chessBoard.board[x][y].flag !== currentPosition.flag &&
                              (chessBoard.board[x][y].chessRole === ChessRole.ROOK || chessBoard.board[x][y].chessRole === ChessRole.QUEEN)
                        )
                              return true;

                        break;
                  }

                  x++;
            }
            // Left
            x = currentPosition.x - 1;
            y = currentPosition.y;
            while (x >= 0 && x < chessBoard.board.length && y >= 0 && y < chessBoard.board.length) {
                  if (chessBoard.board[x][y].flag !== PlayerFlagEnum.EMPTY) {
                        if (
                              chessBoard.board[x][y].flag !== currentPosition.flag &&
                              (chessBoard.board[x][y].chessRole === ChessRole.ROOK || chessBoard.board[x][y].chessRole === ChessRole.QUEEN)
                        )
                              return true;

                        break;
                  }

                  x--;
            }
            // Top
            x = currentPosition.x;
            y = currentPosition.y + 1;
            while (x >= 0 && x < chessBoard.board.length && y >= 0 && y < chessBoard.board.length) {
                  if (chessBoard.board[x][y].flag !== PlayerFlagEnum.EMPTY) {
                        if (
                              chessBoard.board[x][y].flag !== currentPosition.flag &&
                              (chessBoard.board[x][y].chessRole === ChessRole.ROOK || chessBoard.board[x][y].chessRole === ChessRole.QUEEN)
                        )
                              return true;

                        break;
                  }

                  y++;
            }
            // Bottom
            x = currentPosition.x;
            y = currentPosition.y - 1;
            while (x >= 0 && x < chessBoard.board.length && y >= 0 && y < chessBoard.board.length) {
                  if (chessBoard.board[x][y].flag !== PlayerFlagEnum.EMPTY) {
                        if (
                              chessBoard.board[x][y].flag !== currentPosition.flag &&
                              (chessBoard.board[x][y].chessRole === ChessRole.ROOK || chessBoard.board[x][y].chessRole === ChessRole.QUEEN)
                        )
                              return true;

                        break;
                  }

                  y--;
            }

            // Check bishop, queen
            // Top - left
            x = currentPosition.x - 1;
            y = currentPosition.y + 1;
            while (x >= 0 && x < chessBoard.board.length && y >= 0 && y < chessBoard.board.length) {
                  if (chessBoard.board[x][y].flag !== PlayerFlagEnum.EMPTY) {
                        if (
                              chessBoard.board[x][y].flag !== currentPosition.flag &&
                              (chessBoard.board[x][y].chessRole === ChessRole.BISHOP || chessBoard.board[x][y].chessRole === ChessRole.QUEEN)
                        )
                              return true;

                        break;
                  }

                  x--;
                  y++;
            }
            // Top - right
            x = currentPosition.x + 1;
            y = currentPosition.y + 1;
            while (x >= 0 && x < chessBoard.board.length && y >= 0 && y < chessBoard.board.length) {
                  if (chessBoard.board[x][y].flag !== PlayerFlagEnum.EMPTY) {
                        if (
                              chessBoard.board[x][y].flag !== currentPosition.flag &&
                              (chessBoard.board[x][y].chessRole === ChessRole.BISHOP || chessBoard.board[x][y].chessRole === ChessRole.QUEEN)
                        )
                              return true;

                        break;
                  }

                  x++;
                  y++;
            }
            // Bottom - right
            x = currentPosition.x + 1;
            y = currentPosition.y - 1;
            while (x >= 0 && x < chessBoard.board.length && y >= 0 && y < chessBoard.board.length) {
                  if (chessBoard.board[x][y].flag !== PlayerFlagEnum.EMPTY) {
                        if (
                              chessBoard.board[x][y].flag !== currentPosition.flag &&
                              (chessBoard.board[x][y].chessRole === ChessRole.BISHOP || chessBoard.board[x][y].chessRole === ChessRole.QUEEN)
                        )
                              return true;

                        break;
                  }

                  x++;
                  y--;
            }
            // Bottom - left
            x = currentPosition.x - 1;
            y = currentPosition.y - 1;
            while (x >= 0 && x < chessBoard.board.length && y >= 0 && y < chessBoard.board.length) {
                  if (chessBoard.board[x][y].flag !== PlayerFlagEnum.EMPTY) {
                        if (
                              chessBoard.board[x][y].flag !== currentPosition.flag &&
                              (chessBoard.board[x][y].chessRole === ChessRole.BISHOP || chessBoard.board[x][y].chessRole === ChessRole.QUEEN)
                        )
                              return true;

                        break;
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

      private async isCastleKingSite(curPos: ChessMoveCoordinates, desPos: ChessMoveCoordinates, boardId: string): Promise<boolean> {
            const chessBoard = await this.chessCommonService.getBoard(boardId);
            let result = false;
            const kingIsMoved = await this.kingIsMoved(chessBoard.board[curPos.x][curPos.y].flag, boardId);
            const rookKingSiteIsMoved = await this.rookKingSiteIsMoved(chessBoard.board[curPos.x][curPos.y].flag, boardId);

            if (chessBoard.board[curPos.x][curPos.y].chessRole === ChessRole.KING && !kingIsMoved && !rookKingSiteIsMoved) {
                  if (chessBoard.board[curPos.x][curPos.y].flag === PlayerFlagEnum.WHITE && desPos.x === 6 && desPos.y === 0) result = true;
                  if (chessBoard.board[curPos.x][curPos.y].flag === PlayerFlagEnum.BLACK && desPos.x === 6 && desPos.y === 7) result = true;
            }
            return result;
      }

      private async isCaslteQueenSite(curPos: ChessMoveCoordinates, desPos: ChessMoveCoordinates, boardId: string): Promise<boolean> {
            const chessBoard = await this.chessCommonService.getBoard(boardId);
            let result = false;
            const kingIsMoved = await this.kingIsMoved(chessBoard.board[curPos.x][curPos.y].flag, boardId);
            const rookQueenSiteIsMoved = await this.rookQueenSiteIsMoved(chessBoard.board[curPos.x][curPos.y].flag, boardId);
            if (chessBoard.board[curPos.x][curPos.y].chessRole === ChessRole.KING && !kingIsMoved && !rookQueenSiteIsMoved) {
                  if (chessBoard.board[curPos.x][curPos.y].flag === PlayerFlagEnum.WHITE && desPos.x === 2 && desPos.y === 0) result = true;
                  if (chessBoard.board[curPos.x][curPos.y].flag === PlayerFlagEnum.BLACK && desPos.x === 2 && desPos.y === 7) result = true;
            }
            return result;
      }

      private async isEnPassant(curPos: ChessMoveCoordinates, desPos: ChessMoveCoordinates, boardId: string): Promise<boolean> {
            const chessBoard = await this.chessCommonService.getBoard(boardId);
            let result = false;
            if (
                  chessBoard.board[curPos.x][curPos.y].chessRole === ChessRole.PAWN &&
                  chessBoard.board[curPos.x][curPos.y].flag === PlayerFlagEnum.WHITE &&
                  curPos.y === 4
            ) {
                  if (
                        chessBoard.board[desPos.x][desPos.y].flag === PlayerFlagEnum.EMPTY &&
                        desPos.y === curPos.y + 1 &&
                        (desPos.x === curPos.x + 1 || desPos.x === curPos.x - 1)
                  )
                        result = true;
            }
            if (
                  chessBoard.board[curPos.x][curPos.y].chessRole === ChessRole.PAWN &&
                  chessBoard.board[curPos.x][curPos.y].flag === PlayerFlagEnum.BLACK &&
                  curPos.y === 3
            ) {
                  if (
                        chessBoard.board[desPos.x][desPos.y].flag === PlayerFlagEnum.EMPTY &&
                        desPos.y === curPos.y - 1 &&
                        (desPos.x === curPos.x + 1 || desPos.x === curPos.x - 1)
                  )
                        result = true;
            }
            return result;
      }

      async canMove(curPos: ChessMoveCoordinates, desPos: ChessMoveCoordinates, boardId: string) {
            const chessBoard = await this.chessCommonService.getBoard(boardId);

            const kingColor = chessBoard.board[curPos.x][curPos.y].flag;
            // back up date before fake move
            const tmpDestinationPosition: ChessFlag = {
                  flag: chessBoard.board[desPos.x][desPos.y].flag,
                  chessRole: chessBoard.board[desPos.x][desPos.y].chessRole,
            };
            let tmpForEnPassant: ChessFlag;
            const isEnPassant = await this.isEnPassant(curPos, desPos, boardId);
            if (isEnPassant) {
                  if (chessBoard.board[curPos.x][curPos.y].flag === PlayerFlagEnum.WHITE)
                        tmpForEnPassant = {
                              flag: PlayerFlagEnum.BLACK,
                              chessRole: ChessRole.PAWN,
                        };
                  if (chessBoard.board[curPos.x][curPos.y].flag === PlayerFlagEnum.BLACK)
                        tmpForEnPassant = {
                              flag: PlayerFlagEnum.WHITE,
                              chessRole: ChessRole.PAWN,
                        };
            }

            // fake move to check the move is valid or not
            let canMove = true;

            // en passant
            if (isEnPassant)
                  chessBoard.board[desPos.x][curPos.y] = {
                        flag: PlayerFlagEnum.EMPTY,
                        chessRole: ChessRole.EMPTY,
                  };

            chessBoard.board[desPos.x][desPos.y] = chessBoard.board[curPos.x][curPos.y];

            chessBoard.board[curPos.x][curPos.y] = {
                  flag: PlayerFlagEnum.EMPTY,
                  chessRole: ChessRole.EMPTY,
            };

            await this.chessCommonService.setBoard(chessBoard);

            const kingPosition: ChessMoveRedis = await this.getKing(kingColor, chessBoard.id);
            if (kingPosition) if (await this.kingIsChecked(kingPosition, chessBoard.id)) canMove = false;

            // restore data
            if (isEnPassant) chessBoard.board[desPos.x][curPos.y] = tmpForEnPassant;
            chessBoard.board[curPos.x][curPos.y] = chessBoard.board[desPos.x][desPos.y];

            chessBoard.board[desPos.x][desPos.y] = {
                  flag: tmpDestinationPosition.flag,
                  chessRole: tmpDestinationPosition.chessRole,
            };

            await this.chessCommonService.setBoard(chessBoard);

            return canMove;
      }

      private async chessRoleLegalMove(currentPosition: ChessMoveCoordinates, boardId: string) {
            const chessBoard = await this.chessCommonService.getBoard(boardId);
            let availableMove: Array<ChessMoveCoordinates>;

            const role = chessBoard.board[currentPosition.x][currentPosition.y].chessRole;

            switch (role) {
                  case ChessRole.BISHOP: {
                        availableMove = await this.bishopAvailableMove(currentPosition, chessBoard.id);
                        break;
                  }
                  case ChessRole.ROOK: {
                        availableMove = await this.rookAvailableMove(currentPosition, chessBoard.id);
                        break;
                  }
                  case ChessRole.QUEEN: {
                        availableMove = await this.queenAvailableMove(currentPosition, chessBoard.id);
                        break;
                  }
                  case ChessRole.KNIGHT: {
                        availableMove = await this.knightAvailableMove(currentPosition, chessBoard.id);
                        break;
                  }
                  case ChessRole.PAWN: {
                        availableMove = await this.pawnAvailableMove(currentPosition, chessBoard.id);
                        break;
                  }
                  case ChessRole.KING: {
                        availableMove = await this.kingAvailableMove(currentPosition, chessBoard.id);
                        break;
                  }
                  case ChessRole.EMPTY: {
                        availableMove = [];
                        break;
                  }
            }

            const legalMove: Array<ChessMoveCoordinates> = [];

            for (const move of availableMove) {
                  if (await this.canMove(currentPosition, move, chessBoard.id)) legalMove.push(move);
            }

            return legalMove;
      }

      async legalMove(currentPosition: ChessMoveCoordinates, boardId: string) {
            return await this.chessRoleLegalMove(currentPosition, boardId);
      }

      async checkmate(flag: PlayerFlagEnum.WHITE | PlayerFlagEnum.BLACK, boardId: string): Promise<boolean> {
            const chessBoard = await this.chessCommonService.getBoard(boardId);
            const kingPosition: ChessMoveRedis = await this.getKing(flag, chessBoard.id);

            const kingIsChecked: boolean = await this.kingIsChecked(kingPosition, chessBoard.id);
            if (!kingIsChecked) return false;

            for (let i = 0; i <= 7; i++) {
                  for (let j = 0; j <= 7; j++) {
                        if (chessBoard.board[i][j].flag === flag) {
                              const legalMove: Array<ChessMoveCoordinates> = await this.legalMove({ x: i, y: j }, chessBoard.id);
                              if (legalMove.length > 0) return false;
                        }
                  }
            }
            chessBoard.winner = 1 - flag;
            chessBoard.status = ChessStatus.END;
            const eloCalculator = this.chessCommonService.calculateElo(chessBoard.winner, chessBoard.users[0], chessBoard.users[1]);
            chessBoard.users[0].elo += eloCalculator.whiteElo;
            chessBoard.users[1].elo += eloCalculator.blackElo;
            chessBoard.eloBlackUser = eloCalculator.blackElo;
            chessBoard.eloWhiteUser = eloCalculator.whiteElo;
            await this.chessCommonService.setBoard(chessBoard);
            await this.chessCommonService.saveChessFromCacheToDb(chessBoard.id);
            return true;
      }

      async stalemate(flag: PlayerFlagEnum.WHITE | PlayerFlagEnum.BLACK, boardId: string): Promise<boolean> {
            const chessBoard = await this.chessCommonService.getBoard(boardId);
            const kingPosition: ChessMoveRedis = await this.getKing(flag, chessBoard.id);
            if (await this.kingIsChecked(kingPosition, chessBoard.id)) return false;

            for (let i = 0; i <= 7; i++) {
                  for (let j = 0; j <= 7; j++) {
                        if (chessBoard.board[i][j].flag === flag) {
                              const legalMove: Array<ChessMoveCoordinates> = await this.legalMove({ x: i, y: j }, chessBoard.id);
                              if (legalMove.length > 0) return false;
                        }
                  }
            }
            chessBoard.winner = PlayerFlagEnum.EMPTY;
            chessBoard.status = ChessStatus.END;
            const eloCalculator = this.chessCommonService.calculateElo(chessBoard.winner, chessBoard.users[0], chessBoard.users[1]);
            chessBoard.users[0].elo += eloCalculator.whiteElo;

            chessBoard.users[1].elo += eloCalculator.blackElo;
            chessBoard.eloBlackUser = eloCalculator.blackElo;
            chessBoard.eloWhiteUser = eloCalculator.whiteElo;
            await this.chessCommonService.setBoard(chessBoard);
            await this.chessCommonService.saveChessFromCacheToDb(chessBoard.id);
            return true;
      }

      async isWin(flag: PlayerFlagEnum.WHITE | PlayerFlagEnum.BLACK, boardId: string): Promise<boolean> {
            const isCheckmate = await this.checkmate(flag, boardId);
            const isStalemate = await this.stalemate(flag, boardId);
            if (isCheckmate || isStalemate) return true;
            return false;
      }

      async playAMove(player: ChessPlayer, curPos: ChessMoveCoordinates, desPos: ChessMoveCoordinates, boardId: string) {
            const chessBoard = await this.chessCommonService.getBoard(boardId);
            if (chessBoard) {
                  const currentFlag = chessBoard.turn ? PlayerFlagEnum.BLACK : PlayerFlagEnum.WHITE;
                  if (currentFlag === player.flag) {
                        const newChessMove = new ChessMove();
                        newChessMove.fromX = curPos.x;
                        newChessMove.fromY = curPos.y;
                        newChessMove.toX = desPos.x;
                        newChessMove.toY = desPos.y;
                        newChessMove.flag = chessBoard.board[curPos.x][curPos.y].flag;
                        newChessMove.chessRole = chessBoard.board[curPos.x][curPos.y].chessRole;

                        const isEnPassant = await this.isEnPassant(curPos, desPos, boardId);
                        if (isEnPassant)
                              chessBoard.board[desPos.x][curPos.y] = {
                                    flag: PlayerFlagEnum.EMPTY,
                                    chessRole: ChessRole.EMPTY,
                              };

                        const isCastleKingSite = await this.isCastleKingSite(curPos, desPos, boardId);
                        if (isCastleKingSite) {
                              if (chessBoard.board[curPos.x][curPos.y].flag === PlayerFlagEnum.WHITE) {
                                    chessBoard.board[5][0] = {
                                          flag: PlayerFlagEnum.WHITE,
                                          chessRole: ChessRole.ROOK,
                                    };
                                    chessBoard.board[7][0] = {
                                          flag: PlayerFlagEnum.EMPTY,
                                          chessRole: ChessRole.EMPTY,
                                    };
                              }
                              if (chessBoard.board[curPos.x][curPos.y].flag === PlayerFlagEnum.BLACK) {
                                    chessBoard.board[5][7] = {
                                          flag: PlayerFlagEnum.BLACK,
                                          chessRole: ChessRole.ROOK,
                                    };
                                    chessBoard.board[7][7] = {
                                          flag: PlayerFlagEnum.EMPTY,
                                          chessRole: ChessRole.EMPTY,
                                    };
                              }
                        }

                        const isCaslteQueenSite = await this.isCaslteQueenSite(curPos, desPos, boardId);
                        if (isCaslteQueenSite) {
                              if (chessBoard.board[curPos.x][curPos.y].flag === PlayerFlagEnum.WHITE) {
                                    chessBoard.board[3][0] = {
                                          flag: PlayerFlagEnum.WHITE,
                                          chessRole: ChessRole.ROOK,
                                    };
                                    chessBoard.board[0][0] = {
                                          flag: PlayerFlagEnum.EMPTY,
                                          chessRole: ChessRole.EMPTY,
                                    };
                              }
                              if (chessBoard.board[curPos.x][curPos.y].flag === PlayerFlagEnum.BLACK) {
                                    chessBoard.board[3][7] = {
                                          flag: PlayerFlagEnum.BLACK,
                                          chessRole: ChessRole.ROOK,
                                    };
                                    chessBoard.board[0][7] = {
                                          flag: PlayerFlagEnum.EMPTY,
                                          chessRole: ChessRole.EMPTY,
                                    };
                              }
                        }

                        chessBoard.board[desPos.x][desPos.y] = chessBoard.board[curPos.x][curPos.y];

                        chessBoard.board[curPos.x][curPos.y] = {
                              flag: PlayerFlagEnum.EMPTY,
                              chessRole: ChessRole.EMPTY,
                        };
                        chessBoard.turn = !chessBoard.turn;
                        const currentTime = new Date();
                        const stepTime = currentTime.getTime() - new Date(chessBoard.lastStep).getTime();
                        chessBoard.users[newChessMove.flag].time -= stepTime;
                        chessBoard.lastStep = currentTime;
                        chessBoard.moves.push(newChessMove);
                        await this.chessCommonService.setBoard(chessBoard);

                        const enemyColor = player.flag === PlayerFlagEnum.WHITE ? PlayerFlagEnum.BLACK : PlayerFlagEnum.WHITE;
                        await this.executeEnemyKingIsChecked(chessBoard.id, enemyColor);
                  } else return false;

                  return true;
            }
      }

      async isPromotePawn(desPos: ChessMoveCoordinates, boardId: string): Promise<boolean> {
            const chessBoard = await this.chessCommonService.getBoard(boardId);
            if (chessBoard.board[desPos.x][desPos.y].chessRole !== ChessRole.PAWN) return false;
            if (chessBoard.board[desPos.x][desPos.y].flag === PlayerFlagEnum.WHITE && desPos.y === 7) return true;
            if (chessBoard.board[desPos.x][desPos.y].flag === PlayerFlagEnum.BLACK && desPos.y === 0) return true;
            return false;
      }

      // action promote move
      async promoteMove(promotePos: ChessMoveCoordinates, role: ChessRole, boardId: string) {
            const board = await this.chessCommonService.getBoard(boardId);
            board.board[promotePos.x][promotePos.y].chessRole = role;
            await this.chessCommonService.setBoard(board);

            // check enemy king is checked or not
            const playerFlag = board.board[promotePos.x][promotePos.y].flag;
            const enemyColor = playerFlag === PlayerFlagEnum.WHITE ? PlayerFlagEnum.BLACK : PlayerFlagEnum.WHITE;
            await this.executeEnemyKingIsChecked(board.id, enemyColor);
      }

      // check enemy king is checked or not and execute
      async executeEnemyKingIsChecked(boardId: string, enemyColor: PlayerFlagEnum.BLACK | PlayerFlagEnum.WHITE) {
            const board = await this.chessCommonService.getBoard(boardId);
            const enemyKingPosition = await this.getKing(enemyColor, board.id);

            if (await this.kingIsChecked(enemyKingPosition, board.id)) {
                  board.checkedPiece = {
                        x: enemyKingPosition.x,
                        y: enemyKingPosition.y,
                  };
            } else board.checkedPiece = undefined;
            await this.chessCommonService.setBoard(board);
      }
}
