import { EntityRepository, ObjectLiteral } from 'typeorm';

//---- Entity
import { Chess } from './chess.entity';

//---- Service
import { RepositoryService } from '../../utils/repository/repository.service';

@EntityRepository(Chess)
export class ChessRepository extends RepositoryService<Chess> {
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
}
