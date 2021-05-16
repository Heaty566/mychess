import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

//---- Gateway
import { ChessGateway } from './chess.gateway';

//---- Module
import { AuthModule } from '../auth/auth.module';
import { ChatModule } from '../chat/chat.module';
import { UserModule } from '../user/user.module';
import { RedisModule } from '../utils/redis/redis.module';

//---- Repository
import { ChessRepository } from './entity/chess.repository';
import { ChessMoveRepository } from './entity/chessMove.repository';

//---- Service
import { ChessService } from './chess.service';
import { ChessCommonService } from './chessCommon.service';
import { ChessBotService } from './chessBot.service';

//---- Controller
import { ChessController } from './chess.controller';

@Module({
      imports: [TypeOrmModule.forFeature([ChessRepository, ChessMoveRepository]), AuthModule, RedisModule, UserModule, ChatModule],
      providers: [ChessService, ChessCommonService, ChessGateway, ChessBotService],
      controllers: [ChessController],
})
export class ChessModule {}
