import { Injectable } from '@nestjs/common';

//---- Service
import { ChessCommonService } from './chessCommon.service';
import { ChessService } from './chess.service';
import { PlayerFlagEnum, ChessMoveCoordinates, ChessMove } from './entity/chess.interface';

//---- Entity

@Injectable()
export class ChessBotService {
      constructor(private readonly chessCommonService: ChessCommonService, private readonly chessService: ChessService) {}

      async randomMove(boardId: string, playerFlag: PlayerFlagEnum) {
            const possibleMoves = await this.getAllMoves(boardId, playerFlag);
            const randomIndex = Math.floor(Math.random() * possibleMoves.length);
            return possibleMoves[randomIndex];
      }

      private async getAllMoves(boardId: string, playerFlag: PlayerFlagEnum) {
            const board = await this.chessCommonService.getBoard(boardId);
            const moves: Array<ChessMove> = [];

            for (let i = 0; i <= 7; i++) {
                  for (let j = 0; j <= 7; j++) {
                        if (board.board[i][j].flag === playerFlag) {
                              const legalMoves: ChessMoveCoordinates[] = await this.chessService.legalMove({ x: i, y: j }, board.id);
                              if (legalMoves.length !== 0) {
                                    for (const move of legalMoves) {
                                          moves.push({
                                                chessRole: board.board[i][j].chessRole,
                                                flag: playerFlag,
                                                fromX: i,
                                                fromY: j,
                                                toX: move.x,
                                                toY: move.y,
                                          });
                                    }
                              }
                        }
                  }
            }

            return moves;
      }
}
