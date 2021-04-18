import { EntityRepository } from 'typeorm';

//---- Entity
import { User } from './user.entity';

//---- Service
import { RepositoryService } from '../../utils/repository/repository.service';

@EntityRepository(User)
export class UserRepository extends RepositoryService<User> {
      /**
       *
       *
       * @description get with common information (not include password, email, or phone)
       */
}
