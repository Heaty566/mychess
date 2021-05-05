import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChessService } from './chess.service';
import { ChessCommonService } from './chessCommon.service';
import { ChessRepository } from './entity/chess.repository';
import { RedisModule } from '../providers/redis/redis.module';

import { ChessTanService } from './chessTan.service';

@Module({
      imports: [TypeOrmModule.forFeature([ChessRepository]), RedisModule],
      providers: [ChessService, ChessCommonService, ChessTanService],
})
export class ChessModule {}
