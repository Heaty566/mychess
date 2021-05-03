import { Injectable } from '@nestjs/common';

//---- Service
import { RedisService } from '../providers/redis/redis.service';
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
            private readonly redisService: RedisService,
            private readonly ticTacToeMoveRepository: TicTacToeMoveRepository,
            private readonly ticTacToeCommonService: TicTacToeCommonService,
      ) {}

      async loadGameToCache(tttId: string) {
            const getGame = await this.ticTacToeRepository.getOneTTTByFiled('tic.id = :id', { id: tttId });
            if (!getGame || getGame.status === TicTacToeStatus.END || getGame.status === TicTacToeStatus.PLAYING) return false;

            const tTTBoard = new TicTacToeBoard(getGame);
            getGame.moves.forEach((item) => (tTTBoard.board[item.x][item.y] = item.flag));

            await this.ticTacToeCommonService.setBoard(getGame.id, tTTBoard);
            return true;
      }

      async toggleReadyStatePlayer(boardId: string, user: User) {
            const board = await this.ticTacToeCommonService.getBoard(boardId);
            if (!board) return false;

            const player = board.users.find((item) => item.id === user.id);
            if (!player) return false;

            if (board.users[0].id && board.users[1].id) {
                  board.users[player.flag].ready = !board.users[player.flag].ready;
            } else return false;

            await this.ticTacToeCommonService.setBoard(boardId, board);
            return true;
      }

      async joinGame(boardId: string, user: User) {
            const board = await this.ticTacToeCommonService.getBoard(boardId);
            if (!board) return false;

            const userIds = board.users.map((item) => item.id);
            if (!userIds.includes(user.id) && (!board.users[0].id || !board.users[1].id)) {
                  if (!board.users[0].id) {
                        board.users[0].id = user.id;
                        board.info.users[0] = user;
                  } else {
                        board.users[1].id = user.id;
                        board.info.users[1] = user;
                  }
            } else return false;

            await this.ticTacToeCommonService.setBoard(boardId, board);
            return true;
      }

      async leaveGame(boardId: string, user: User) {
            const board = await this.ticTacToeCommonService.getBoard(boardId);
            if (!board) return false;
            const userIds = board.users.map((item) => item.id);

            if (userIds.includes(user.id)) {
                  if (board.users[0].id === user.id) {
                        board.users[0].id = board.users[1].id;
                        board.users[1].id = null;
                        board.info.users.shift();
                  } else {
                        board.users[1].id = null;
                        board.info.users.pop();
                  }
            } else return false;

            board.users[0].ready = false;
            board.users[1].ready = false;

            if (!board.users[0].id && !board.users[1].id) {
                  await this.ticTacToeCommonService.deleteBoard(boardId);
                  await this.ticTacToeRepository.createQueryBuilder().delete().where('id = :id', { id: board.info.id }).execute();
            } else {
                  await this.ticTacToeCommonService.saveTicTacToe(board.info);
                  await this.ticTacToeCommonService.setBoard(boardId, board);
            }
            return true;
      }

      async startGame(boardId: string, user: User) {
            const board = await this.ticTacToeCommonService.getBoard(boardId);
            if (!board) return false;

            const player = board.users.find((item) => item.id === user.id);
            if (!player) return false;

            if (board.users[0].ready && board.users[1].ready) {
                  board.info.status = TicTacToeStatus.PLAYING;
                  board.info.startDate = new Date();
                  await this.ticTacToeCommonService.setBoard(boardId, board);
                  return true;
            }
            return false;
      }

      async addMoveToBoard(boardId: string, user: User, x: number, y: number) {
            const tTTBoard = await this.ticTacToeCommonService.getBoard(boardId);
            if (!tTTBoard || !(tTTBoard.info.status === TicTacToeStatus.PLAYING)) return false;

            const player = tTTBoard.users.find((item) => item.id === user.id);
            if (!player) return false;

            const currentTurn = tTTBoard.currentTurn ? 0 : 1;

            if (tTTBoard.board[x][y] === -1 && currentTurn === player.flag) {
                  tTTBoard.board[x][y] = player.flag;
                  tTTBoard.currentTurn = !tTTBoard.currentTurn;
            } else return false;

            await this.ticTacToeCommonService.setBoard(tTTBoard.info.id, tTTBoard);
            return true;
      }

      async isWin(boardId: string) {
            const tTTBoard = await this.ticTacToeCommonService.getBoard(boardId);
            if (!tTTBoard || !(tTTBoard.info.status === TicTacToeStatus.PLAYING)) return false;

            for (let i = 2; i < tTTBoard.board.length - 2; i++)
                  for (let j = 0; j < tTTBoard.board[i].length; j++) {
                        if (tTTBoard.board[i][j] !== -1) {
                              const center: TicTacToeFlag = tTTBoard.board[i][j];

                              if (
                                    // line left -> right
                                    tTTBoard.board[i - 2][j] === center &&
                                    tTTBoard.board[i - 1][j] === center &&
                                    tTTBoard.board[i + 1][j] === center &&
                                    tTTBoard.board[i + 2][j] === center
                              ) {
                                    tTTBoard.info.winner = center;
                                    tTTBoard.info.status = TicTacToeStatus.END;
                                    await this.ticTacToeCommonService.setBoard(boardId, tTTBoard);
                                    return true;
                              }
                        }
                  }
            for (let i = 0; i < tTTBoard.board.length; i++)
                  for (let j = 2; j < tTTBoard.board[i].length - 2; j++) {
                        if (tTTBoard.board[i][j] !== -1) {
                              const center: TicTacToeFlag = tTTBoard.board[i][j];

                              if (
                                    // line top -> bottom
                                    tTTBoard.board[i][j - 2] === center &&
                                    tTTBoard.board[i][j - 1] === center &&
                                    tTTBoard.board[i][j + 1] === center &&
                                    tTTBoard.board[i][j + 2] === center
                              ) {
                                    tTTBoard.info.winner = center;
                                    tTTBoard.info.status = TicTacToeStatus.END;
                                    await this.ticTacToeCommonService.setBoard(boardId, tTTBoard);
                                    return true;
                              }
                        }
                  }

            for (let i = 2; i < tTTBoard.board.length; i++)
                  for (let j = 2; j < tTTBoard.board[i].length; j++) {
                        if (tTTBoard.board[i][j] !== -1) {
                              const center: TicTacToeFlag = tTTBoard.board[i][j];

                              if (
                                    // diagonal line top -> bottom && left -> right
                                    (tTTBoard.board[i - 2][j - 2] === center &&
                                          tTTBoard.board[i - 1][j - 1] === center &&
                                          tTTBoard.board[i + 1][j + 1] === center &&
                                          tTTBoard.board[i + 2][j + 2] === center) ||
                                    // diagonal line bottom -> Top && left -> right
                                    (tTTBoard.board[i - 2][j + 2] === center &&
                                          tTTBoard.board[i - 1][j + 1] === center &&
                                          tTTBoard.board[i + 1][j - 1] === center &&
                                          tTTBoard.board[i + 2][j - 2] === center)
                              ) {
                                    tTTBoard.info.winner = center;
                                    tTTBoard.info.status = TicTacToeStatus.END;
                                    await this.ticTacToeCommonService.setBoard(boardId, tTTBoard);
                                    return true;
                              }
                        }
                  }
            return false;
      }

      async surrender(boardId: string, user: User) {
            const tTTBoard = await this.ticTacToeCommonService.getBoard(boardId);
            if (!tTTBoard || tTTBoard.info.status !== TicTacToeStatus.PLAYING) return false;

            const player = tTTBoard.users.find((item) => item.id === user.id);
            if (!player) return false;

            tTTBoard.info.winner = player.flag === 1 ? 0 : 1;
            tTTBoard.info.status = TicTacToeStatus.END;
            await this.ticTacToeCommonService.setBoard(boardId, tTTBoard);
            return true;
      }

      async updateToDatabase(boardId: string) {
            const tTTBoard = await this.ticTacToeCommonService.getBoard(boardId);
            if (!tTTBoard || !(tTTBoard.info.status === TicTacToeStatus.END)) return false;

            const moves: Array<TicTacToeMove> = [];
            for (let i = 0; i < tTTBoard.board.length; i++)
                  for (let j = 0; j < tTTBoard.board[i].length; j++) {
                        if (tTTBoard.board[i][j] !== -1) {
                              const updateMove = new TicTacToeMove();
                              updateMove.x = i;
                              updateMove.y = j;
                              updateMove.flag = tTTBoard.board[i][j];
                              moves.push(updateMove);
                        }
                  }

            const insertedMoves = await this.ticTacToeMoveRepository.save(moves);
            tTTBoard.info.endDate = new Date();
            tTTBoard.info.moves = insertedMoves;
            await this.redisService.setObjectByKey(`ttt-${boardId}`, tTTBoard, 30);
            return await this.ticTacToeRepository.save(tTTBoard.info);
      }
}
