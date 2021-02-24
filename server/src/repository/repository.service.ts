import { ObjectId } from 'mongodb';
import { Repository } from 'typeorm';

export class RepositoryService<T> extends Repository<T> {
      public async getByField(field: keyof T, value: any) {
            if (field === '_id' && typeof value === 'string') {
                  if (!ObjectId.isValid(value)) return null;
                  return await this.findOne({ [field]: new ObjectId(value) });
            }

            return await this.findOne({ [field]: value });
      }
}
