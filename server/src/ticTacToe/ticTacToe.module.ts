import { Module } from '@nestjs/common';
import { TicTacToeService } from './ticTacToe.service';
import { TicTacToeGateway } from './ticTacToe.gateway';
import { AuthModule } from '../auth/auth.module';
import { RedisModule } from '../providers/redis/redis.module';
import { UserModule } from '../users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicTacToeRepository } from './entity/ticTacToe.repository';
import { TicTacToeCommonService } from './ticTacToeCommon.service';
import { TicTacToeMoveRepository } from './entity/ticTacToeMove.repository';
import { TicTacToeBotService } from './ticTacToeBot.service';

@Module({
      imports: [TypeOrmModule.forFeature([TicTacToeRepository, TicTacToeMoveRepository]), AuthModule, RedisModule, UserModule],
      providers: [TicTacToeGateway, TicTacToeService, TicTacToeCommonService, TicTacToeBotService],
})
export class TicTacToeModule {}
