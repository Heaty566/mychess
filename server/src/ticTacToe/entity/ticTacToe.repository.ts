import { EntityRepository } from 'typeorm';

//---- Entity
import { TicTacToe } from './ticTacToe.entity';

//---- Repository
import { RepositoryService } from '../../utils/repository/repository.service';

@EntityRepository(TicTacToe)
export class TicTacToeRepository extends RepositoryService<TicTacToe> {}
