import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ChatModule } from '../chat/chat.module';
import { UserModule } from '../user/user.module';
import { RedisModule } from '../utils/redis/redis.module';
import { ChessService } from './chess.service';
import { ChessCommonService } from './chessCommon.service';
import { ChessRepository } from './entity/chess.repository';
import { ChessMoveRepository } from './entity/chessMove.repository';

@Module({
      imports: [TypeOrmModule.forFeature([ChessRepository, ChessMoveRepository]), AuthModule, RedisModule, UserModule, ChatModule],
      providers: [ChessService, ChessCommonService],
})
export class ChessModule {}
