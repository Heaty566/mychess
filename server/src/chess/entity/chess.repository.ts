import { EntityRepository, ObjectLiteral } from 'typeorm';

//---- Entity
import { Chess } from './chess.entity';

//---- Repository
import { RepositoryService } from '../../utils/repository/repository.service';

@EntityRepository(Chess)
export class ChessRepository extends RepositoryService<Chess> {
      async getManyTTTByField(where: string, parameters: ObjectLiteral) {
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
                  .getMany();

            return res;
      }

      async getOneTTTByFiled(where: string, parameters: ObjectLiteral) {
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
