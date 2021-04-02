import { EntityRepository } from 'typeorm';

import { RepositoryService } from '../../utils/repository/repository.service';
import { ReToken } from './re-token.entity';

@EntityRepository(ReToken)
export class ReTokenRepository extends RepositoryService<ReToken> {}
