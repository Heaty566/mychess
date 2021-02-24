import { EntityRepository } from 'typeorm';
import { RepositoryService } from '../../providers/repository/repository.service';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends RepositoryService<User> {}
