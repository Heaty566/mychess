import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChessRepository } from './entity/chess.repository';
import { ChessService } from './chess.service';
import { ChessCommonService } from './chessCommon.service';
import { RedisModule } from '../providers/redis/redis.module';

@Module({
      imports: [TypeOrmModule.forFeature([ChessRepository]), RedisModule],
      providers: [ChessService, ChessCommonService],
})
export class ChessModule {}
