import { Injectable } from '@nestjs/common';

import { TicTacToeRepository } from './entity/ticTacToe.repository';
import { TicTacToeStatus } from './entity/ticTacToeStatus';
import { TicTacToeMove } from './entity/ticTacToeMove.entity';
import { TicTacToeBoard } from './entity/ticTacToeBoard.entity';
import { RedisService } from '../providers/redis/redis.service';
import User from '../users/entities/user.entity';
import { TicTacToeFlag } from './entity/ticTacToeFlag.type';

@Injectable()
export class TicTacToeService {
      constructor(private readonly ticTacToeRepository: TicTacToeRepository, private readonly redisService: RedisService) {}

      async loadGameToCache(id: string) {
            const getGame = await this.ticTacToeRepository
                  .createQueryBuilder('tic')
                  .leftJoinAndSelect('tic.users', 'user')
                  .leftJoinAndSelect('tic.moves', 'tic-tac-toe-move')
                  .where('tic.id = :id', { id })
                  .getOne();

            if (!getGame || getGame.status === TicTacToeStatus.END || getGame.status === TicTacToeStatus.PLAYING) return false;

            const tTTBoard = new TicTacToeBoard(getGame);
            getGame.moves.forEach((item) => (tTTBoard.board[item.x][item.y] = item.flag));

            this.redisService.setObjectByKey(`ttt-${getGame.id}`, tTTBoard);
            return true;
      }

      async toggleReadyStatePlayer(boardId: string, user: User) {
            const board = await this.redisService.getObjectByKey<TicTacToeBoard>(boardId);
            if (!board) return false;

            const player = board.users.find((item) => item.id === user.id);
            if (!player) return false;

            if (board.users[0].id && board.users[1].id) {
                  board.users[player.flag].ready = !board.users[player.flag].ready;
            } else return false;

            this.redisService.setObjectByKey(boardId, board);
            return true;
      }

      async joinGame(boardId: string, user: User) {
            const board = await this.redisService.getObjectByKey<TicTacToeBoard>(boardId);
            if (!board) return false;
            const userIds = board.users.map((item) => item.id);

            if (!userIds.includes(user.id) && (!board.users[0].id || !board.users[1].id)) {
                  if (!board.users[0].id) {
                        board.users[0].id = user.id;
                  } else board.users[1].id = user.id;
            } else return false;

            this.redisService.setObjectByKey(boardId, board);
            return true;
      }

      async leaveGame(boardId: string, user: User) {
            const board = await this.redisService.getObjectByKey<TicTacToeBoard>(boardId);
            if (!board) return false;
            const userIds = board.users.map((item) => item.id);

            if (userIds.includes(user.id)) {
                  if (board.users[0].id === user.id) {
                        board.users[0].id = null;
                  } else board.users[1].id = null;
            } else return false;

            board.users[0].ready = false;
            board.users[1].ready = false;

            if (!board.users[0].id && !board.users[1].id) {
                  this.redisService.deleteByKey(boardId);
                  await this.ticTacToeRepository.createQueryBuilder().delete().where('id = :id', { id: board.info.id }).execute();
            } else this.redisService.setObjectByKey(boardId, board);
            return true;
      }

      async startGame(boardId: string, user: User) {
            const board = await this.redisService.getObjectByKey<TicTacToeBoard>(boardId);
            if (!board) return false;

            const player = board.users.find((item) => item.id === user.id);
            if (!player) return false;

            if (board.users[0].ready && board.users[1].ready) {
                  board.info.status = TicTacToeStatus.PLAYING;
                  board.info.startDate = new Date();
                  await this.redisService.setObjectByKey(boardId, board);
                  return true;
            }
            return false;
      }

      async getBoard(boardId: string) {
            return await this.redisService.getObjectByKey<TicTacToeBoard>(boardId);
      }

      async addMoveToBoard(boardId: string, user: User, x: number, y: number) {
            const tTTBoard = await this.redisService.getObjectByKey<TicTacToeBoard>(boardId);
            if (!tTTBoard || !(tTTBoard.info.status === TicTacToeStatus.PLAYING)) return false;

            const player = tTTBoard.users.find((item) => item.id === user.id);
            if (!player) return false;
            const currentTurn = tTTBoard.currentTurn ? 0 : 1;

            if (tTTBoard.board[x][y] === -1 && currentTurn === player.flag) {
                  tTTBoard.board[x][y] = player.flag;
                  tTTBoard.currentTurn = !tTTBoard.currentTurn;
            } else return false;

            await this.redisService.setObjectByKey(`ttt-${tTTBoard.info.id}`, tTTBoard);
            return true;
      }

      async isWin(boardId: string) {
            const tTTBoard = await this.redisService.getObjectByKey<TicTacToeBoard>(boardId);

            for (let i = 2; i < tTTBoard.board.length; i++)
                  for (let j = 2; j < tTTBoard.board[i].length; j++) {
                        if (!tTTBoard[i][j]) {
                              const center: TicTacToeFlag = tTTBoard[i][j];
                              if (
                                    // diagonal line top -> bottom && left -> right
                                    (tTTBoard[i - 2][j - 2] === center &&
                                          tTTBoard[i - 1][j - 2] === center &&
                                          tTTBoard[i + 1][j + 1] === center &&
                                          tTTBoard[i + 2][j + 2] === center) ||
                                    // diagonal line bottom -> Top && left -> right
                                    (tTTBoard[i - 2][j + 2] === center &&
                                          tTTBoard[i - 1][j + 1] === center &&
                                          tTTBoard[i + 1][j - 1] === center &&
                                          tTTBoard[i + 2][j - 2] === center) ||
                                    // line top -> bottom
                                    (tTTBoard[i][j - 2] === center &&
                                          tTTBoard[i][j - 1] === center &&
                                          tTTBoard[i][j + 1] === center &&
                                          tTTBoard[i][j + 2] === center) ||
                                    // line left -> right
                                    (tTTBoard[i - 2][j] === center &&
                                          tTTBoard[i - 1][j] === center &&
                                          tTTBoard[i + 1][j] === center &&
                                          tTTBoard[i + 2][j] === center)
                              ) {
                                    tTTBoard.info.winner = center;
                                    tTTBoard.info.status = TicTacToeStatus.END;
                                    this.redisService.setObjectByKey(boardId, tTTBoard);

                                    return true;
                              }
                        }
                  }
            return false;
      }

      async updateToDatabase(boardId: string) {
            const tTTBoard = await this.redisService.getObjectByKey<TicTacToeBoard>(boardId);
            for (let i = 0; i < tTTBoard.board.length; i++)
                  for (let j = 0; j < tTTBoard.board[i].length; j++) {
                        if (tTTBoard[i][j]) {
                              const updateMove = new TicTacToeMove();
                              updateMove.x = i;
                              updateMove.y = j;
                              updateMove.flag = tTTBoard[i][j];
                        }
                  }

            tTTBoard.info.endDate = new Date();
            this.redisService.setObjectByKey(boardId, tTTBoard, 60);
            return await this.ticTacToeRepository.save(tTTBoard.info);
      }
}
