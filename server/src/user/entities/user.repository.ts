import { EntityRepository } from 'typeorm';
import { RepositoryService } from '../../utils/repository/repository.service';
import { User } from './user.entity';
import { ObjectId } from 'mongodb';

@EntityRepository(User)
export class UserRepository extends RepositoryService<User> {
      public async getUserByField(field: keyof User, value: any) {
            console.log(field === '_id' && typeof value === 'string');
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
