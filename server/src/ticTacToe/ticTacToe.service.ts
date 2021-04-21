import { Injectable } from '@nestjs/common';

import { UserRepository } from '../users/entities/user.repository';
import User from '../users/entities/user.entity';
import { UserService } from '../users/user.service';
import { TicTacToeRepository } from './entity/ticTacToe.repository';
import { ObjectLiteral } from 'typeorm';
import { TicTacToe } from './entity/ticTacToe.entity';

@Injectable()
export class TicTacToeService {
      constructor(
            private readonly userService: UserService,
            private readonly ticTacToeRepository: TicTacToeRepository,
            private readonly userRepository: UserRepository,
      ) {
            //
      }

      async getMatchByQuery(where: string, parameters: ObjectLiteral) {
            const res = await this.ticTacToeRepository
                  .createQueryBuilder('tic')
                  .leftJoinAndSelect('tic.users', 'user')
                  .where(where, parameters)
                  .getMany();
            return res;
      }
      async saveTicTacToe(ticTacToe: TicTacToe) {
            return await this.ticTacToeRepository.save(ticTacToe);
      }

      async calculateElo(user: User, eloStatus: 'win' | 'loss' | 'draw') {
            switch (eloStatus) {
                  case 'loss':
                        user.elo -= 5;
                  case 'win':
                        user.elo += 5;
            }

            return await this.userService.saveUser(user);
      }
}
