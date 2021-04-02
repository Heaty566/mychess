import { EntityRepository } from 'typeorm';
import { ObjectId } from 'mongodb';

import { RepositoryService } from '../../../utils/repository/repository.service';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends RepositoryService<User> {
      /**
       *
       *
       * @description get with common information (not include password, email, or phone)
       */
      public async getUserByField(field: keyof User, value: any) {
            if (field === '_id' && typeof value === 'string') {
                  if (!ObjectId.isValid(value)) return null;
                  return await this.findOne({
                        [`${field}`]: new ObjectId(value),
                        select: ['_id', 'username', 'name', 'avatarUrl', 'createDate', 'elo'],
                  });
            }

            return await this.findOne({ [`${field}`]: value, select: ['_id', 'username', 'name', 'avatarUrl', 'createDate', 'elo'] });
      }
}
