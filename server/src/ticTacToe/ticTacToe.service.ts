import { Injectable } from '@nestjs/common';

//---- Service
import { TicTacToeCommonService } from './ticTacToeCommon.service';

//---- Entity
import { TicTacToePlayer, TicTacToeStatus } from './entity/ticTacToe.interface';
import { TicTacToeFlag } from './entity/ticTacToe.interface';
import { TicTacToeBoard } from './entity/ticTacToeBoard.entity';
import User from '../users/entities/user.entity';

//---- Repository
import { TicTacToeBotService } from './ticTacToeBot.service';
import { UserService } from '../users/user.service';
import { TicTacToeMove } from './entity/ticTacToeMove.entity';
import { TicTacToe } from './entity/ticTacToe.entity';
import { TicTacToeRepository } from './entity/ticTacToe.repository';

@Injectable()
export class TicTacToeService {
      constructor(
            private readonly ticTacToeCommonService: TicTacToeCommonService,
            private readonly ticTacToeBotService: TicTacToeBotService,
            private readonly userService: UserService,
            private readonly ticTacToeRepository: TicTacToeRepository,
      ) {}

      async joinGame(boardId: string, user: User | TicTacToePlayer) {
            const board = await this.ticTacToeCommonService.getBoard(boardId);

            if (board?.users && board.users.length !== 2) {
                  const userFlag = board.users.length === 0 ? TicTacToeFlag.BLUE : TicTacToeFlag.RED;

                  board.users.push({
                        username: user.username,
                        name: user.name,
                        avatarUrl: user.avatarUrl,
                        elo: user.elo,
                        time: 90000,
                        id: user.id,
                        ready: false,
                        flag: userFlag,
                  });

                  await this.ticTacToeCommonService.setBoard(board);
                  return true;
            }
            return false;
      }

      async createNewGame(user: User, isBotMode: boolean) {
            const newBoard = new TicTacToeBoard(isBotMode);
            await this.ticTacToeCommonService.setBoard(newBoard);

            await this.joinGame(newBoard.id, user);
            if (isBotMode) {
                  const bot = this.ticTacToeBotService.getBotInfo();
                  await this.joinGame(newBoard.id, bot);
            }

            return newBoard.id;
      }
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
                                          await this.ticTacToeCommonService.setBoard(board);
                                          await this.loadToDatabase(boardId);
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
                                          await this.ticTacToeCommonService.setBoard(board);
                                          await this.loadToDatabase(boardId);
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
                                          board.winner = center;
                                          board.status = TicTacToeStatus.END;
                                          await this.ticTacToeCommonService.setBoard(board);
                                          await this.loadToDatabase(boardId);
                                          return true;
                                    }
                              }
                        }
                  return false;
            }
      }

      async findUser(boardId: string, userId: string) {
            const board = await this.ticTacToeCommonService.getBoard(boardId);
            if (board) {
                  const getUser = board.users.find((item) => item.id === userId);
                  return getUser;
            }
      }

      async startGame(boardId: string) {
            const board = await this.ticTacToeCommonService.getBoard(boardId);
            if (board && board.users[0].ready && board.users[1].ready) {
                  board.status = TicTacToeStatus.PLAYING;
                  board.startDate = new Date();
                  board.lastStep = new Date();

                  await this.ticTacToeCommonService.setBoard(board);
                  return true;
            }
            return false;
      }

      async toggleReadyStatePlayer(boardId: string, player: TicTacToePlayer) {
            const board = await this.ticTacToeCommonService.getBoard(boardId);
            board.users[player.flag].ready = !board.users[player.flag].ready;
            await this.ticTacToeCommonService.setBoard(board);
      }

      async addMoveToBoard(boardId: string, player: TicTacToePlayer, x: number, y: number) {
            const board = await this.ticTacToeCommonService.getBoard(boardId);
            if (board) {
                  const currentFlag = board.currentTurn ? TicTacToeFlag.BLUE : TicTacToeFlag.RED;
                  if (currentFlag === player.flag && board.board[x][y] === -1) {
                        board.board[x][y] = player.flag;
                        board.currentTurn = !board.currentTurn;
                        const currentTime = new Date();
                        const stepTime = currentTime.getTime() - new Date(board.lastStep).getTime();
                        board.users[player.flag].time -= stepTime;
                        board.lastStep = currentTime;
                        await this.ticTacToeCommonService.setBoard(board);
                  } else return false;

                  return true;
            }
      }

      async leaveGame(boardId: string, player: TicTacToePlayer) {
            const board = await this.ticTacToeCommonService.getBoard(boardId);
            if (board) {
                  if (board.status === TicTacToeStatus.PLAYING) {
                        await this.surrender(boardId, player);
                        return true;
                  } else if (board.status === TicTacToeStatus['NOT-YET']) {
                        const remainUser = board.users.find((item) => item.id !== player.id);
                        board.users = [];
                        await this.ticTacToeCommonService.setBoard(board);
                        await this.joinGame(board.id, remainUser);
                        return true;
                  }
            }
      }

      async surrender(boardId: string, player: TicTacToePlayer) {
            const board = await this.ticTacToeCommonService.getBoard(boardId);
            if (board) {
                  board.winner = player.flag === TicTacToeFlag.BLUE ? TicTacToeFlag.RED : TicTacToeFlag.BLUE;
                  board.status = TicTacToeStatus.END;

                  await this.ticTacToeCommonService.setBoard(board);
                  await this.loadToDatabase(boardId);
            }
      }

      async loadToDatabase(boardId: string) {
            const board = await this.ticTacToeCommonService.getBoard(boardId);
            if (board && !board.isBotMode && board.status === TicTacToeStatus.END) {
                  const moves: Array<TicTacToeMove> = [];
                  const users = await this.userService.findManyUserByArrayField('id', [board.users[0].id, board.users[1].id]);

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

                  const newTicTacToe = new TicTacToe();
                  newTicTacToe.endDate = new Date();
                  newTicTacToe.moves = moves;
                  newTicTacToe.winner = board.winner;
                  newTicTacToe.users = users;
                  newTicTacToe.startDate = board.startDate;
                  await this.ticTacToeRepository.save(newTicTacToe);
            }
      }
}
