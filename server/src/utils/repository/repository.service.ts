import { ObjectId } from 'mongodb';
import { Repository, FindManyOptions } from 'typeorm';

export class RepositoryService<T> extends Repository<T> {
      public async findOneByField(field: keyof T, value: any) {
            if (field === '_id' && typeof value === 'string') {
                  if (!ObjectId.isValid(value)) return null;
                  value = new ObjectId(value);
            }

            return await this.findOne({ [`${field}`]: value });
      }

      public async findManyByField(field: keyof T, value: any) {
            if (field === '_id' && typeof value === 'string') {
                  if (!ObjectId.isValid(value)) return null;
                  value = new ObjectId(value);
            }

            return await this.find({ [`${field}`]: value });
      }

      private transformToArrayObjectId(value: Array<string>) {
            return value.map((item) => {
                  if (!ObjectId.isValid(item)) return null;
                  return new ObjectId(item);
            });
      }

      /**
       *
       * @description return a array of unique value
       */
      private onlyUnique(value: any, index: number, self: Array<any>) {
            return self.indexOf(value) === index;
      }

      public async findManyByArrayValue(field: keyof T, value: Array<any>, options: FindManyOptions<T>, isUnique?: boolean) {
            if (!value.length) return [];
            if (isUnique) value = value.filter(this.onlyUnique);
            if (field === '_id' && typeof value[0] === 'string') {
                  return await this.find({ where: { ['_id']: { $in: this.transformToArrayObjectId(value) } }, ...options });
            }
            return await this.find({ where: { [`${field}`]: { $in: value } }, ...options });
      }
}
