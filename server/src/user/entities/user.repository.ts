import { EntityRepository } from 'typeorm';
import { RepositoryService } from '../../utils/repository/repository.service';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends RepositoryService<User> {}
