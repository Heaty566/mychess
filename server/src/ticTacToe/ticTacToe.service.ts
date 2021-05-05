import { Injectable } from '@nestjs/common';

//---- Service
import { TicTacToeCommonService } from './ticTacToeCommon.service';

//---- Entity
import { TicTacToeStatus } from './entity/ticTacToe.interface';
import { TicTacToeMove } from './entity/ticTacToeMove.entity';
import { TicTacToeFlag } from './entity/ticTacToe.interface';
import { TicTacToeBoard } from './entity/ticTacToeBoard.entity';
import User from '../users/entities/user.entity';

//---- Repository
import { TicTacToeMoveRepository } from './entity/ticTacToeMove.repository';
import { TicTacToeRepository } from './entity/ticTacToe.repository';

@Injectable()
export class TicTacToeService {
      constructor(
            private readonly ticTacToeRepository: TicTacToeRepository,
            private readonly ticTacToeMoveRepository: TicTacToeMoveRepository,
            private readonly ticTacToeCommonService: TicTacToeCommonService,
      ) {}

      async toggleReadyStatePlayer(board: TicTacToeBoard, user: User) {
            const getUser = board.users.find((item) => item.id === user.id);
            if (!getUser) return false;

            board.users[getUser.flag].ready = !board.users[getUser.flag].ready;
            await this.ticTacToeCommonService.setBoard(board.id, board);
            return true;
      }

      async loadUser(board: TicTacToeBoard) {
            if (board.info.users.length === 2) {
                  board.users[0].id = board.info.users[0].id;
                  board.users[1].id = board.info.users[1].id;
                  board.users[0].ready = false;
                  board.users[1].ready = false;

                  await this.ticTacToeCommonService.setBoard(board.id, board);
                  return true;
            }
            return false;
      }

      async leaveGame(board: TicTacToeBoard, user: User) {
            const users = board.info.users.filter((item) => item.id !== user.id);
            board.info.users = users;
            board.users[0].id = null;
            board.users[1].id = null;
            board.users[0].ready = false;
            board.users[1].ready = false;

            if (Boolean(users.length)) {
                  await this.ticTacToeCommonService.setBoard(board.id, board);
            } else await this.ticTacToeCommonService.deleteBoard(board.id);
      }

      async startGame(board: TicTacToeBoard) {
            if (board.users[0].ready && board.users[1].ready) {
                  board.info.status = TicTacToeStatus.PLAYING;
                  board.info.startDate = new Date();
                  board.lastStep = new Date();
                  board.users[0].id = board.info.users[0].id;
                  board.users[1].id = board.info.users[1].id;
                  await this.ticTacToeCommonService.setBoard(board.id, board);
                  return true;
            }
            return false;
      }

      async addMoveToBoard(board: TicTacToeBoard, user: User, x: number, y: number) {
            const player = board.users.find((item) => item.id === user.id);
            if (!player) return false;

            const currentTurn = board.currentTurn ? 0 : 1;

            if (currentTurn === player.flag && board.board[x][y] === -1) {
                  board.board[x][y] = player.flag;
                  board.currentTurn = !board.currentTurn;
                  const currentTime = new Date();
                  const stepTime = currentTime.getTime() - new Date(board.lastStep).getTime();
                  board.users[player.flag].time -= stepTime;
                  board.lastStep = currentTime;
            } else return false;

            await this.ticTacToeCommonService.setBoard(board.id, board);
            return true;
      }

      async surrender(board: TicTacToeBoard, user: User) {
            const player = board.users.find((item) => item.id === user.id);
            if (!player) return false;

            board.info.winner = player.flag === 1 ? 0 : 1;
            board.info.status = TicTacToeStatus.END;

            await this.ticTacToeCommonService.setBoard(board.id, board);
      }

      async isWin(board: TicTacToeBoard) {
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
                                    board.info.winner = center;
                                    board.info.status = TicTacToeStatus.END;
                                    await this.ticTacToeCommonService.setBoard(board.id, board);
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
                                    board.info.winner = center;
                                    board.info.status = TicTacToeStatus.END;
                                    await this.ticTacToeCommonService.setBoard(board.id, board);
                                    return true;
                              }
                        }
                  }

            for (let i = 2; i < board.board.length; i++)
                  for (let j = 2; j < board.board[i].length; j++) {
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
                                    board.info.winner = center;
                                    board.info.status = TicTacToeStatus.END;
                                    await this.ticTacToeCommonService.setBoard(board.id, board);
                                    return true;
                              }
                        }
                  }
            return false;
      }

      async updateToDatabase(board: TicTacToeBoard) {
            const moves: Array<TicTacToeMove> = [];
            for (let i = 0; i < board.board.length; i++)
                  for (let j = 0; j < board.board[i].length; j++) {
                        if (board.board[i][j] !== -1) {
                              const updateMove = new TicTacToeMove();
                              updateMove.x = i;
                              updateMove.y = j;
                              updateMove.flag = board.board[i][j];
                              moves.push(updateMove);
                        }
                  }

            const insertedMoves = await this.ticTacToeMoveRepository.save(moves);
            board.info.endDate = new Date();
            board.info.moves = insertedMoves;
            await this.ticTacToeCommonService.setBoard(board.id, board);
            return await this.ticTacToeRepository.save(board.info);
      }
}
