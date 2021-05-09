import { EntityRepository } from 'typeorm';

//---- Service
import { RepositoryService } from '../../utils/repository/repository.service';

//---- Entity
import { Chess } from './chess.entity';
import { ChessMoveDB } from './chessMove.entity';

@EntityRepository(Chess)
export class ChessMoveRepository extends RepositoryService<ChessMoveDB> {}
