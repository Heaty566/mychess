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
import { RedisModule } from '../utils/redis/redis.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { ChatModule } from '../chat/chat.module';

//---- Controller
import { TicTacToeController } from './ticTacToe.controller';

@Module({
      imports: [TypeOrmModule.forFeature([TicTacToeRepository, TicTacToeMoveRepository]), AuthModule, RedisModule, UserModule, ChatModule],
      providers: [TicTacToeGateway, TicTacToeService, TicTacToeCommonService, TicTacToeBotService],
      controllers: [TicTacToeController],
})
export class TicTacToeModule {}
