import { Injectable } from '@nestjs/common';
import { ObjectLiteral } from 'typeorm';

//---- Service
import { RedisService } from '../providers/redis/redis.service';

//---- Entity
import { TicTacToe } from './entity/ticTacToe.entity';
import User from '../users/entities/user.entity';
import { TicTacToeStatus } from './entity/ticTacToe.interface';
import { TicTacToeBoard } from './entity/ticTacToeBoard.entity';

//---- Repository
import { TicTacToeRepository } from './entity/ticTacToe.repository';

@Injectable()
export class TicTacToeCommonService {
      constructor(private readonly ticTacToeRepository: TicTacToeRepository, private readonly redisService: RedisService) {}

      async getBoard(boardId: string) {
            const newBoardId = `ttt-${boardId}`;
            const board = await this.redisService.getObjectByKey<TicTacToeBoard>(newBoardId);

            return board;
      }

      async setBoard(board: TicTacToeBoard) {
            const boardId = `ttt-${board.id}`;

            return await this.redisService.setObjectByKey(boardId, board, 1440);
      }

      async isExistUser(boardId: string, userId: string) {
            const board = await this.getBoard(boardId);
            const user = board.users.find((item) => item.id === userId);
            return user;
      }
}
