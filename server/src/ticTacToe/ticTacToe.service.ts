import { TicTacToePlayer, TicTacToeStatus } from './entity/ticTacToe.interface';

import { Injectable } from '@nestjs/common';
import { TicTacToeCommonService } from './ticTacToeCommon.service';
import { TicTacToeFlag } from './entity/ticTacToe.interface';

//---- Service

//---- Entity

//---- Repository

@Injectable()
export class TicTacToeService {
      constructor(private readonly ticTacToeCommonService: TicTacToeCommonService) {}

      async isWin(boardId: string) {
            const board = await this.ticTacToeCommonService.getBoard(boardId);
            if (board) {
                  for (let i = 2; i < board.board.length - 2; i++)
                        for (let j = 0; j < board.board[i].length; j++) {
                              if (board.board[i][j] !== -1) {
                                    const center: TicTacToeFlag = board.board[i][j];

                                    if (
                                          // line left -> right
                                          board.board[i - 2][j] === center &&
                                          board.board[i - 1][j] === center &&
                                          board.board[i + 1][j] === center &&
                                          board.board[i + 2][j] === center
                                    ) {
                                          board.winner = center;
                                          board.status = TicTacToeStatus.END;
                                          const eloCalculator = this.ticTacToeCommonService.calculateElo(
                                                board.winner,
                                                board.users[0],
                                                board.users[1],
                                          );
                                          board.users[0].elo += eloCalculator.blueElo;
                                          board.users[1].elo += eloCalculator.redElo;
                                          board.eloBlueUser = eloCalculator.blueElo;
                                          board.eloRedUser = eloCalculator.redElo;
                                          await this.ticTacToeCommonService.setBoard(board);
                                          await this.ticTacToeCommonService.saveTTTFromCacheToDb(boardId);
                                          return true;
                                    }
                              }
                        }
                  for (let i = 0; i < board.board.length; i++)
                        for (let j = 2; j < board.board[i].length - 2; j++) {
                              if (board.board[i][j] !== -1) {
                                    const center: TicTacToeFlag = board.board[i][j];

                                    if (
                                          // line top -> bottom
                                          board.board[i][j - 2] === center &&
                                          board.board[i][j - 1] === center &&
                                          board.board[i][j + 1] === center &&
                                          board.board[i][j + 2] === center
                                    ) {
                                          board.winner = center;
                                          board.status = TicTacToeStatus.END;
                                          const eloCalculator = this.ticTacToeCommonService.calculateElo(
                                                board.winner,
                                                board.users[0],
                                                board.users[1],
                                          );
                                          board.users[0].elo += eloCalculator.blueElo;
                                          board.users[1].elo += eloCalculator.redElo;
                                          board.eloBlueUser = eloCalculator.blueElo;
                                          board.eloRedUser = eloCalculator.redElo;
                                          await this.ticTacToeCommonService.setBoard(board);
                                          await this.ticTacToeCommonService.saveTTTFromCacheToDb(boardId);
                                          return true;
                                    }
                              }
                        }

                  for (let i = 2; i < board.board.length - 2; i++)
                        for (let j = 2; j < board.board[i].length - 2; j++) {
                              if (board.board[i][j] !== -1) {
                                    const center: TicTacToeFlag = board.board[i][j];

                                    if (
                                          // diagonal line top -> bottom && left -> right
                                          (board.board[i - 2][j - 2] === center &&
                                                board.board[i - 1][j - 1] === center &&
                                                board.board[i + 1][j + 1] === center &&
                                                board.board[i + 2][j + 2] === center) ||
                                          // diagonal line bottom -> Top && left -> right
                                          (board.board[i - 2][j + 2] === center &&
                                                board.board[i - 1][j + 1] === center &&
                                                board.board[i + 1][j - 1] === center &&
                                                board.board[i + 2][j - 2] === center)
                                    ) {
                                          board.winner = center;
                                          board.status = TicTacToeStatus.END;
                                          const eloCalculator = this.ticTacToeCommonService.calculateElo(
                                                board.winner,
                                                board.users[0],
                                                board.users[1],
                                          );
                                          board.users[0].elo += eloCalculator.blueElo;
                                          board.users[1].elo += eloCalculator.redElo;
                                          board.eloBlueUser = eloCalculator.blueElo;
                                          board.eloRedUser = eloCalculator.redElo;
                                          await this.ticTacToeCommonService.setBoard(board);
                                          await this.ticTacToeCommonService.saveTTTFromCacheToDb(boardId);
                                          return true;
                                    }
                              }
                        }
                  return false;
            }
      }

      async addMoveToBoard(boardId: string, player: TicTacToePlayer, x: number, y: number) {
            const board = await this.ticTacToeCommonService.getBoard(boardId);
            if (board) {
                  const currentFlag = board.currentTurn ? TicTacToeFlag.BLUE : TicTacToeFlag.RED;
                  if (currentFlag === player.flag && board.board[x][y] === -1) {
                        board.board[x][y] = player.flag;
                        board.currentTurn = !board.currentTurn;
                        board.moves.push({ x, y, flag: player.flag });
                        const currentTime = new Date();
                        const stepTime = currentTime.getTime() - new Date(board.lastStep).getTime();
                        board.users[player.flag].time -= stepTime;
                        board.lastStep = currentTime;
                        await this.ticTacToeCommonService.setBoard(board);
                  } else return false;

                  return true;
            }
      }
}
