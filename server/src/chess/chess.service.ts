import { Injectable } from '@nestjs/common';
import { AvaibleMove, ChessMove } from './entity/chess.interface';
import { ChessBoard } from './entity/chessBoard.entity';

//---- Repository

@Injectable()
export class ChessService {
      kingVailableMove(currentPosition: ChessMove, board: ChessBoard) {
            const result: Array<AvaibleMove> = [];
            let kingMoveX = [1, 1, 1, 0, 0, -1, -1, -1];
            let kingMoveY = [1, 0, -1, 1, -1, 1, 0, -1];
            for (let i = 0; i <= 7; i++) {
                  let x = currentPosition.x + kingMoveX[i];
                  let y = currentPosition.y + kingMoveY[i];
                  if (x >= 0 && x < board.board.length && y >= 0 && y < board.board.length && board.board[x][y].flag !== currentPosition.flag) {
                        result.push({ x, y });
                  }
            }
            return result;
      }
}
