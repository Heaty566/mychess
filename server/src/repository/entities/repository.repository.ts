import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';

export class RepositoryRepository<T> extends Repository<T> {
      public async getByField(field: keyof T, value: any) {
            if (field === '_id' && typeof value === 'string') {
                  return await this.findOne({ [field]: new ObjectId(value) });
            }
            return await this.findOne({ [field]: value });
      }
}
