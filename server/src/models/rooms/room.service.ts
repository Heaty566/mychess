import { Injectable } from '@nestjs/common';
import Room from './entities/room.entity';
import { RoomRepository } from './entities/room.repository';

@Injectable()
export class RoomService {
      constructor(private roomRepository: RoomRepository) {}

      async saveRoom(input: Room): Promise<Room> {
            return await this.roomRepository.save(input);
      }

      async getOneRoomByUserId(input: string): Promise<Room> {
            return await this.roomRepository.getRoomByUserId(input);
      }

      async getOneRoomByField(field: keyof Room, value: any): Promise<Room> {
            return this.roomRepository.getRoomByField(field, value);
      }
}
