import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChessRepository } from './entity/chess.repository';
import { ChessService } from './chess.service';
import { ChessCommonService } from './chessCommon.service';
import { RedisService } from '../providers/redis/redis.service';

@Module({
      imports: [TypeOrmModule.forFeature([ChessRepository])],
      providers: [ChessService, ChessCommonService, RedisService],
})
export class ChessModule {}
