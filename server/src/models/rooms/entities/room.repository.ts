import { RepositoryService } from '../../../utils/repository/repository.service';
import { EntityRepository } from 'typeorm';
import Room from './room.entity';

@EntityRepository(Room)
export class RoomRepository extends RepositoryService<Room> {
      public async getRoomByField(field: keyof Room, value: any) {
            const results = await this.createQueryBuilder().select('*').where(`${field} = :value`, { value }).execute();
            return results[0];
      }

      public async getRoomByUserId(value: string) {
            const result = await this.createQueryBuilder().select('*').where('user1Id = :value or user2Id = :value', { value }).execute();
            return result[0];
      }
}
