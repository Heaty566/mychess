import { Module } from '@nestjs/common';
import { TicTacToeService } from './ticTacToe.service';
import { TicTacToeGateway } from './ticTacToe.gateway';
import { AuthModule } from '../auth/auth.module';
import { RedisModule } from '../providers/redis/redis.module';
import { UserModule } from '../users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicTacToeRepository } from './entity/ticTacToe.repository';

@Module({
      imports: [TypeOrmModule.forFeature([TicTacToeRepository]), AuthModule, RedisModule, UserModule],
      providers: [TicTacToeGateway, TicTacToeService],
})
export class TicTacToeModule {}
