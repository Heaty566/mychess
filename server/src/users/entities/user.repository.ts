import { EntityRepository } from 'typeorm';

import { RepositoryService } from '../../utils/repository/repository.service';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends RepositoryService<User> {
      /**
       *
       *
       * @description get with common information (not include password, email, or phone)
       */
      public async getUserByField(field: keyof User, value: any) {
            const results = await this.createQueryBuilder()
                  .select('id, username, name, avatarUrl, createDate, elo')
                  .where(`${field} = :value`, { value })
                  .execute();
            return results[0];
      }
}
