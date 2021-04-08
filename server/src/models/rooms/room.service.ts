import { Injectable } from '@nestjs/common';
import User from '../users/entities/user.entity';
import Room from './entities/room.entity';
import { RoomRepository } from './entities/room.repository';

@Injectable()
export class RoomService {
      constructor(private roomRepository: RoomRepository) {}

      async saveRoom(input: Room): Promise<Room> {
            return await this.roomRepository.save(input);
      }

      async getOneRoomByUserId(input: string) {
            return await this.roomRepository.getRoomByUserId(input);
      }
}
