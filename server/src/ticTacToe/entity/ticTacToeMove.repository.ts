import { EntityRepository } from 'typeorm';

//---- Service
import { RepositoryService } from '../../utils/repository/repository.service';

//---- Entity
import { TicTacToeMove } from './ticTacToeMove.entity';

@EntityRepository(TicTacToeMove)
export class TicTacToeMoveRepository extends RepositoryService<TicTacToeMove> {}
