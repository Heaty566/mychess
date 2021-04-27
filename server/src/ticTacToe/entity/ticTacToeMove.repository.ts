import { EntityRepository } from 'typeorm';

import { RepositoryService } from '../../utils/repository/repository.service';
import { TicTacToeMove } from './ticTacToeMove.entity';

@EntityRepository(TicTacToeMove)
export class TicTacToeMoveRepository extends RepositoryService<TicTacToeMove> {}
