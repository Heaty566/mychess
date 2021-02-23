import { RepositoryService } from '../../repository/repository.service';
import { EntityRepository } from 'typeorm';
import { AuthToken } from './authToken.entity';

@EntityRepository(AuthToken)
export class AuthTokenRepository extends RepositoryService<AuthToken> {}
