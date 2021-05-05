import { Module } from '@nestjs/common';
import { ChessService } from './chess.service';

@Module({
      imports: [],
      providers: [ChessService],
})
export class ChessModule {}
