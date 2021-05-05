import { Injectable } from '@nestjs/common';
import { AvaibleMove, ChessMove, PlayerFlagEnum } from './entity/chess.interface';
import { ChessBoard } from './entity/chessBoard.entity';

//---- Repository

@Injectable()
export class ChessTanService {
      pawnVailableMove(currentPosition: ChessMove, board: ChessBoard) {
            const result: Array<AvaibleMove> = [];
            let pawnMoveX: Array<number>;
            let pawnMoveY: Array<number>;

            switch (currentPosition.flag) {
                  case PlayerFlagEnum.WHITE: {
                        if (this.isMoved(currentPosition)) {
                              pawnMoveX = [0, 0];
                              pawnMoveY = [1, 2];
                        } else {
                              pawnMoveX = [0];
                              pawnMoveY = [1];
                        }

                        const position: ChessMove = {
                              x: currentPosition.x - 1,
                              y: currentPosition.y + 1,
                              chessRole: currentPosition.chessRole,
                              flag: currentPosition.flag,
                        };

                        if (this.isEnemy(position, board)) {
                              const x = position.x;
                              const y = position.y;
                              result.push({ x, y });
                        }
                        position.x += 2;

                        if (this.isEnemy(position, board)) {
                              const x = position.x;
                              const y = position.y;
                              result.push({ x, y });
                        }
                        break;
                  }

                  case PlayerFlagEnum.BLACK: {
                        if (this.isMoved(currentPosition)) {
                              pawnMoveX = [0, 0];
                              pawnMoveY = [-1, -2];
                        } else {
                              pawnMoveX = [0];
                              pawnMoveY = [-1];
                        }

                        const position: ChessMove = {
                              x: currentPosition.x - 1,
                              y: currentPosition.y - 1,
                              chessRole: currentPosition.chessRole,
                              flag: currentPosition.flag,
                        };

                        if (this.isEnemy(position, board)) {
                              const x = position.x;
                              const y = position.y;
                              result.push({ x, y });
                        }

                        position.x += 2;

                        if (this.isEnemy(position, board)) {
                              const x = position.x;
                              const y = position.y;
                              result.push({ x, y });
                        }
                        break;
                  }
            }

            for (let i = 0; i < pawnMoveX.length; i++) {
                  const x = currentPosition.x + pawnMoveX[i];
                  const y = currentPosition.y + pawnMoveY[i];

                  if (x >= 0 && x < board.board.length && y >= 0 && y < board.board.length && this.isContinue(currentPosition, x, y, board)) {
                        result.push({ x, y });
                  }
            }
            return result;
      }

      private isMoved(currentPosition: ChessMove) {
            if (currentPosition.x === 1 && currentPosition.flag === PlayerFlagEnum.WHITE) return true;
            if (currentPosition.x === 6 && currentPosition.flag === PlayerFlagEnum.BLACK) return true;
            return false;
      }

      private isEnemy(position: ChessMove, board: ChessBoard) {
            if (position.flag === PlayerFlagEnum.WHITE) {
                  if (board.board[position.x][position.y].flag === PlayerFlagEnum.BLACK) return true;
            }
            if (position.flag === PlayerFlagEnum.BLACK) {
                  if (board.board[position.x][position.y].flag === PlayerFlagEnum.WHITE) return true;
            }
            return false;
      }

      private isContinue(currentPosition: ChessMove, x: number, y: number, board: ChessBoard) {
            if (currentPosition.flag === PlayerFlagEnum.WHITE) {
                  for (let i = 1; i <= y - currentPosition.y; i++) {
                        if (board.board[x][y + i].flag !== PlayerFlagEnum.EMPTY) return false;
                  }
            }
            if (currentPosition.flag === PlayerFlagEnum.BLACK) {
                  for (let i = 1; i <= currentPosition.y - y; i++) {
                        if (board.board[x][y - i].flag !== PlayerFlagEnum.EMPTY) return false;
                  }
            }
            return true;
      }
}
