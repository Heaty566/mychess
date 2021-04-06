import { RepositoryService } from '../../../utils/repository/repository.service';
import { EntityRepository } from 'typeorm';
import Room from './room.entity';

@EntityRepository(Room)
export class RoomRepository extends RepositoryService<Room> {}
