import { EntityRepository, ObjectLiteral } from 'typeorm';

import { Chess } from './chess.entity';
import { RepositoryService } from '../../utils/repository/repository.service';

//---- Entity

//---- Repository

@EntityRepository(Chess)
export class ChessRepository extends RepositoryService<Chess> {
      async getManyChessByField(where: string, parameters: ObjectLiteral) {
            const res = await this.createQueryBuilder('chess')
                  .leftJoinAndSelect('chess.users', 'user')
                  .select([
                        'chess.id',
                        'chess.status',
                        'chess.winner',
                        'chess.startDate',
                        'chess.endDate',
                        'chess.changeOne',
                        'chess.changeTwo',
                        'user.id',
                        'user.name',
                        'user.username',
                        'user.elo',
                        'user.avatarUrl',
                  ])
                  .where(where, parameters)
                  .getMany();

            return res;
      }

      getBoardQuery = () =>
            this.createQueryBuilder('chess')
                  .leftJoinAndSelect('chess.users', 'user')
                  .select([
                        'chess.id',
                        'chess.winner',
                        'chess.startDate',
                        'chess.changeOne',
                        'chess.changeTwo',
                        'chess.endDate',
                        'user.id',
                        'user.name',
                        'user.username',
                        'user.elo',
                        'user.avatarUrl',
                  ])
                  .leftJoinAndSelect('chess.moves', 'chess-move');

      async getOneChessByFiled(where: string, parameters: ObjectLiteral) {
            const res = await this.createQueryBuilder('chess')
                  .leftJoinAndSelect('chess.users', 'user')
                  .select([
                        'chess.id',
                        'chess.status',
                        'chess.winner',
                        'chess.startDate',
                        'chess.endDate',
                        'user.id',
                        'user.name',
                        'user.username',
                        'user.elo',
                  ])
                  .where(where, parameters)
                  .getOne();

            return res;
      }
}
