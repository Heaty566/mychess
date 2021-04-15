import { Repository } from 'typeorm';

export class RepositoryService<T> extends Repository<T> {
      public async findOneByField(field: keyof T, value: any): Promise<T> {
            const results = await this.createQueryBuilder().select('*').where(`${field} = :value`, { value }).execute();
            return results[0];
      }

      public async findManyByField(field: keyof T, value: any) {
            return await this.createQueryBuilder().select('*').where(`${field} = :value`, { value }).execute();
      }

      /**
       *
       * @description return a array of unique value
       */
      private onlyUnique(value: any, index: number, self: Array<any>) {
            return self.indexOf(value) === index;
      }

      public async findManyByArrayValue(field: keyof T, values: Array<any>, isUnique?: boolean) {
            if (!values.length) return [];
            if (isUnique) values = values.filter(this.onlyUnique);

            return await this.createQueryBuilder().select('*').where(`${field} IN (:...values)`, { values }).execute();
      }
}
