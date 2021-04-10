import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
      constructor(private readonly roomService: RoomService) {}
}
