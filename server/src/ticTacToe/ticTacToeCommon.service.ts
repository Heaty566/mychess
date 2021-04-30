import { Injectable } from '@nestjs/common';

import { TicTacToeRepository } from './entity/ticTacToe.repository';
import { ObjectLiteral } from 'typeorm';
import { TicTacToe } from './entity/ticTacToe.entity';
import { TicTacToeStatus } from './entity/ticTacToe.interface';
import User from '../users/entities/user.entity';
import { RedisService } from '../providers/redis/redis.service';
import { TicTacToeBoard } from './entity/ticTacToeBoard.entity';

@Injectable()
export class TicTacToeCommonService {
      constructor(private readonly ticTacToeRepository: TicTacToeRepository, private readonly redisService: RedisService) {
            //
      }

      async getManyMatchByQuery(where: string, parameters: ObjectLiteral) {
            const res = await this.ticTacToeRepository.getManyTTTByField(where, parameters);

            return res;
      }

      async getOneMatchByFiled(where: string, parameters: ObjectLiteral) {
            const res = await this.ticTacToeRepository.getOneTTTByFiled(where, parameters);

            return res;
      }

      async createNewGame(user: User) {
            const tic = new TicTacToe();
            tic.users = [user];
            const insertNewTTT = await this.saveTicTacToe(tic);

            return insertNewTTT.id;
      }

      async isPlaying(userId: string) {
            const currentPlay = await this.ticTacToeRepository.getManyTTTByField('tic.status = :status and user.id = :userId', {
                  status: TicTacToeStatus.PLAYING,
                  userId,
            });

            return Boolean(currentPlay.length);
      }

      async saveTicTacToe(ticTacToe: TicTacToe) {
            return await this.ticTacToeRepository.save(ticTacToe);
      }

      async getBoard(boardId: string) {
            const board = await this.redisService.getObjectByKey<TicTacToeBoard>(`ttt-${boardId}`);

            return board;
      }

      async setBoard(boardId: string, board: TicTacToeBoard) {
            await this.redisService.setObjectByKey(`ttt-${boardId}`, board);
      }
}
