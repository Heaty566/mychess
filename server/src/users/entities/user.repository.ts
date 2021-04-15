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
      public async getUserByField(field: keyof User, value: any) {
            const results = await this.createQueryBuilder()
                  .select('id, username, name, avatarUrl, createDate, elo')
                  .where(`${field} = :value`, { value })
                  .execute();
            return results[0];
      }

      public async getAllUsers() {
            const results = await this.createQueryBuilder().select('id, username, name, avatarUrl, createDate, elo').execute();
            return results;
      }
}
