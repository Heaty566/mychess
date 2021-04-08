import { RepositoryService } from '../../../utils/repository/repository.service';
import { EntityRepository } from 'typeorm';
import Room from './room.entity';
import User from '../../users/entities/user.entity';

@EntityRepository(Room)
export class RoomRepository extends RepositoryService<Room> {
      public async getRoomByUserId(value: string) {
            const result = await this.createQueryBuilder().select('*').where('user1Id = :value or user2Id = :value', { value }).execute();
            return result[0];
      }
}
