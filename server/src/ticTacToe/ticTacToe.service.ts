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

      async startGame(boardId: string, user: User) {
            const board = await this.redisService.getObjectByKey<TicTacToeBoard>(boardId);
            const userIndex = board.info.users.map((item) => item.id).indexOf(user.id);
            // if (userIndex !== -1 && board.readyTotal >= 2) {
            if (userIndex !== -1) {
                  board.info.status = TicTacToeStatus.PLAYING;
                  await this.redisService.setObjectByKey(`ttt-${board.info.id}`, board);
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

            const userIndex = tTTBoard.info.users.map((item) => item.id).indexOf(user.id);

            if (userIndex !== -1 && tTTBoard.board[x][y] === -1) {
                  if (user.id === tTTBoard.info.users[0].id) tTTBoard.board[x][y] = 0;
                  else tTTBoard.board[x][y] = 1;
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
                                    this.redisService.setObjectByKey(`ttt-${tTTBoard.info.id}`, tTTBoard);

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
            this.redisService.setObjectByKey(`ttt-${tTTBoard.info.id}`, tTTBoard, 60);
            return await this.ticTacToeRepository.save(tTTBoard.info);
      }
}
