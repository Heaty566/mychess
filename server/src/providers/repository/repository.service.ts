import { ObjectId } from 'mongodb';
import { Repository, FindManyOptions } from 'typeorm';

export class RepositoryService<T> extends Repository<T> {
      public async getByField(field: keyof T, value: any) {
            if (field === '_id' && typeof value === 'string') {
                  if (!ObjectId.isValid(value)) return null;
                  return await this.findOne({ [`${field}`]: new ObjectId(value) });
            }

            return await this.findOne({ [`${field}`]: value });
      }

      private transformToArrayObjectId(value: Array<string>) {
            return value.map((item) => {
                  if (!ObjectId.isValid(item)) return null;
                  return new ObjectId(item);
            });
      }

      public async findManyByField(field: keyof T, value: Array<any>, options: FindManyOptions<T>) {
            if (!value.length) return [];
            if (field === '_id' && typeof value[0] === 'string') {
                  return await this.find({ where: { ['_id']: { $in: this.transformToArrayObjectId(value) } }, ...options });
            }
            return await this.find({ where: { [`${field}`]: { $in: value } }, ...options });
      }
}
