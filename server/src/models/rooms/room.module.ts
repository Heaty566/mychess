import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomRepository } from './entities/room.repository';

@Module({
      imports: [TypeOrmModule.forFeature([RoomRepository])],
      controllers: [RoomController],
      providers: [RoomService],
})
export class RoomModule {}
