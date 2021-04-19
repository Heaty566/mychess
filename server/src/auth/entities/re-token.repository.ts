import { EntityRepository } from 'typeorm';

//---- Entity
import { ReToken } from './re-token.entity';
//---- Common
import { RepositoryService } from '../../utils/repository/repository.service';

@EntityRepository(ReToken)
export class ReTokenRepository extends RepositoryService<ReToken> {}
