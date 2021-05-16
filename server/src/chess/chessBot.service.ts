import { Injectable } from '@nestjs/common';

//---- Service
import { ChessCommonService } from './chessCommon.service';
import { ChessService } from './chess.service';

//---- Entity
import { PlayerFlagEnum, ChessMoveCoordinates, ChessMove, StandardPieceValue, ChessRole } from './entity/chess.interface';

@Injectable()
export class ChessBotService {
      constructor(private readonly chessCommonService: ChessCommonService, private readonly chessService: ChessService) {}

      // random a move in all available in chess board
      async randomMove(boardId: string, playerFlag: PlayerFlagEnum) {
            const possibleMoves = await this.getAllMoves(boardId, playerFlag);
            const randomIndex = Math.floor(Math.random() * possibleMoves.length);
            return possibleMoves[randomIndex];
      }

      // find a best move base on total point
      async findBestMove(boardId: string, playerFlag: PlayerFlagEnum) {
            const possibleMoves = await this.getAllMoves(boardId, playerFlag);

            // Sort moves randomly, so the same move isn't always picked on ties
            possibleMoves.sort(function () {
                  return 0.5 - Math.random();
            });

            // Search for move with highest value
            let bestMoveSoFar = null;
            let bestMoveValue = Number.NEGATIVE_INFINITY;

            for (const move of possibleMoves) {
                  const moveValue = await this.evaluateBoard(boardId, playerFlag, move);
                  if (moveValue > bestMoveValue) {
                        bestMoveSoFar = move;
                        bestMoveValue = moveValue;
                  }
            }

            return bestMoveSoFar;
      }

      // promote pawn move of bot
      async botPromotePawn(promotePos: ChessMoveCoordinates, boardId: string) {
            const board = await this.chessCommonService.getBoard(boardId);
            board.board[promotePos.x][promotePos.y].chessRole = ChessRole.QUEEN;
            await this.chessCommonService.setBoard(board);

            const playerFlag = board.board[promotePos.x][promotePos.y].flag;
            const enemyColor = playerFlag === PlayerFlagEnum.WHITE ? PlayerFlagEnum.BLACK : PlayerFlagEnum.WHITE;
            await this.chessService.executeEnemyKingIsChecked(board.id, enemyColor);
      }

      // get all available move in chess board
      private async getAllMoves(boardId: string, playerFlag: PlayerFlagEnum) {
            const board = await this.chessCommonService.getBoard(boardId);
            const moves: Array<ChessMove> = [];
            if (board) {
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
            }

            return moves;
      }

      // calculate point of a move
      private async evaluateBoard(boardId: string, playerFlag: PlayerFlagEnum, move: ChessMove) {
            const board = await this.chessCommonService.getBoard(boardId);
            let value = 0;
            if (board) {
                  board.board[move.fromX][move.fromY] = {
                        chessRole: ChessRole.EMPTY,
                        flag: PlayerFlagEnum.EMPTY,
                  };
                  board.board[move.toX][move.toY] = {
                        chessRole: move.chessRole,
                        flag: move.flag,
                  };

                  for (let i = 0; i <= 7; i++) {
                        for (let j = 0; j <= 7; j++) {
                              if (board.board[i][j].flag !== PlayerFlagEnum.EMPTY) {
                                    // oponent piece is negative numver
                                    switch (board.board[i][j].chessRole) {
                                          case ChessRole.PAWN: {
                                                value += StandardPieceValue.PAWN * (board.board[i][j].flag === playerFlag ? 1 : -1);
                                                break;
                                          }
                                          case ChessRole.BISHOP: {
                                                value += StandardPieceValue.BISHOP * (board.board[i][j].flag === playerFlag ? 1 : -1);
                                                break;
                                          }
                                          case ChessRole.KNIGHT: {
                                                value += StandardPieceValue.KNIGHT * (board.board[i][j].flag === playerFlag ? 1 : -1);
                                                break;
                                          }
                                          case ChessRole.ROOK: {
                                                value += StandardPieceValue.ROOK * (board.board[i][j].flag === playerFlag ? 1 : -1);
                                                break;
                                          }
                                          case ChessRole.QUEEN: {
                                                value += StandardPieceValue.QUEEN * (board.board[i][j].flag === playerFlag ? 1 : -1);
                                                break;
                                          }
                                          case ChessRole.KING: {
                                                value += StandardPieceValue.KING * (board.board[i][j].flag === playerFlag ? 1 : -1);
                                                break;
                                          }
                                    }
                              }
                        }
                  }
            }

            return value;
      }

      // action move of bot
      async botMove(boardId: string, enemyFlag: PlayerFlagEnum.WHITE | PlayerFlagEnum.BLACK) {
            const board = await this.chessCommonService.getBoard(boardId);
            const bot = await this.chessCommonService.findUser(board.id, 'BOT');

            // choose a move for algorithm
            const botMove = await this.findBestMove(board.id, enemyFlag);
            await this.chessService.playAMove(bot, { x: botMove.fromX, y: botMove.fromY }, { x: botMove.toX, y: botMove.toY }, board.id);

            // check promote pawn move
            const isPromote = await this.chessService.isPromotePawn({ x: botMove.toX, y: botMove.toY }, board.id);
            if (isPromote) await this.botPromotePawn({ x: botMove.toX, y: botMove.toY }, board.id);

            await this.chessService.isWin(enemyFlag, board.id);
      }
}
