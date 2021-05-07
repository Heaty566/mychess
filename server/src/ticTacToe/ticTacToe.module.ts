import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

//---- Gateway
import { TicTacToeGateway } from './ticTacToe.gateway';

//---- Service
import { TicTacToeCommonService } from './ticTacToeCommon.service';
import { TicTacToeBotService } from './ticTacToeBot.service';
import { TicTacToeService } from './ticTacToe.service';

//---- Repository
import { TicTacToeRepository } from './entity/ticTacToe.repository';
import { TicTacToeMoveRepository } from './entity/ticTacToeMove.repository';

//---- Module
import { RedisModule } from '../providers/redis/redis.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../users/user.module';
import { TicTacToeController } from './ticTacToe.controller';
import { ChatsModule } from '../chats/chats.module';
@Module({
      imports: [TypeOrmModule.forFeature([TicTacToeRepository, TicTacToeMoveRepository]), AuthModule, RedisModule, UserModule, ChatsModule],
      providers: [TicTacToeGateway, TicTacToeService, TicTacToeCommonService, TicTacToeBotService],
      controllers: [TicTacToeController],
})
export class TicTacToeModule {}
