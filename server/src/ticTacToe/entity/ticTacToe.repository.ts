import { EntityRepository, ObjectLiteral } from 'typeorm';

//---- Entity
import { TicTacToe } from './ticTacToe.entity';

//---- Service
import { RepositoryService } from '../../utils/repository/repository.service';

@EntityRepository(TicTacToe)
export class TicTacToeRepository extends RepositoryService<TicTacToe> {
      getBoardQuery = () =>
            this.createQueryBuilder('tic')
                  .leftJoinAndSelect('tic.users', 'user')
                  .select([
                        'tic.id',
                        'tic.winner',
                        'tic.changeOne',
                        'tic.changeTwo',
                        'tic.startDate',
                        'tic.endDate',
                        'user.id',
                        'user.name',
                        'user.username',
                        'user.elo',
                        'user.avatarUrl',
                  ])
                  .leftJoinAndSelect('tic.moves', 'tic-tac-toe-move');
}
