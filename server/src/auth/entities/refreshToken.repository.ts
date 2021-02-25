import { RepositoryService } from '../../utils/repository/repository.service';
import { EntityRepository } from 'typeorm';
import { RefreshToken } from './refreshToken.entity';

@EntityRepository(RefreshToken)
export class RefreshTokenRepository extends RepositoryService<RefreshToken> {}
