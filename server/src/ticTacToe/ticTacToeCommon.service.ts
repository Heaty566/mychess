import { Injectable } from '@nestjs/common';

import { TicTacToeRepository } from './entity/ticTacToe.repository';
import { ObjectLiteral } from 'typeorm';
import { TicTacToe } from './entity/ticTacToe.entity';
import { TicTacToeStatus } from './entity/ticTacToeStatus';

@Injectable()
export class TicTacToeCommonService {
      constructor(private readonly ticTacToeRepository: TicTacToeRepository) {
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

      async isFull(tTT: TicTacToe, capacity: number) {
            return tTT.users.length >= capacity;
      }

      async isPlaying(userId: string) {
            const currentPlay = await this.ticTacToeRepository.getManyTTTByField('status = :status and user.id = :userId', {
                  status: TicTacToeStatus.PLAYING,
                  userId,
            });

            return Boolean(currentPlay.length);
      }

      async saveTicTacToe(ticTacToe: TicTacToe) {
            return await this.ticTacToeRepository.save(ticTacToe);
      }
}
