import { Injectable } from '@nestjs/common';
import { ObjectLiteral } from 'typeorm';

//---- Service
import { RedisService } from '../providers/redis/redis.service';

//---- Entity
import { TicTacToe } from './entity/ticTacToe.entity';
import User from '../users/entities/user.entity';
import { TicTacToeStatus } from './entity/ticTacToe.interface';
import { TicTacToeBoard } from './entity/ticTacToeBoard.entity';

//---- Repository
import { TicTacToeRepository } from './entity/ticTacToe.repository';

@Injectable()
export class TicTacToeCommonService {
      constructor(private readonly ticTacToeRepository: TicTacToeRepository, private readonly redisService: RedisService) {}

      async getManyTTTByQuery(where: string, parameters: ObjectLiteral) {
            const res = await this.ticTacToeRepository.getManyTTTByField(where, parameters);

            return res;
      }

      async getOneTTTByFiled(where: string, parameters: ObjectLiteral) {
            const res = await this.ticTacToeRepository.getOneTTTByFiled(where, parameters);

            return res;
      }

      async isExistUser(board: TicTacToeBoard, userId: string) {
            const user = board.info.users.find((item) => item.id === userId);
            return user;
      }

      async createNewGame(user: User, isBotMode: boolean) {
            const tic = new TicTacToe();
            tic.users = [user];
            const tttBoard = new TicTacToeBoard(tic, isBotMode);
            await this.setBoard(tttBoard.id, tttBoard);

            return tttBoard;
      }

      async isPlaying(userId: string) {
            const currentPlay = await this.ticTacToeRepository.getManyTTTByField('tic.status = :status and user.id = :userId', {
                  status: TicTacToeStatus.PLAYING,
                  userId,
            });

            return Boolean(currentPlay.length);
      }

      async saveTicTacToe(ticTacToe: TicTacToe) {
            const res = await this.ticTacToeRepository.save(ticTacToe);
            return res;
      }

      async getBoard(boardId: string) {
            const board = await this.redisService.getObjectByKey<TicTacToeBoard>(`ttt-${boardId}`);

            return board;
      }

      async setBoard(boardId: string, board: TicTacToeBoard) {
            await this.redisService.setObjectByKey(`ttt-${boardId}`, board, 1440);
      }
      async deleteBoard(boardId: string) {
            await this.redisService.deleteByKey(`ttt-${boardId}`);
      }
}
