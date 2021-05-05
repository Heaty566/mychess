import { Injectable } from '@nestjs/common';
import { RedisService } from '../providers/redis/redis.service';
import { ChessRepository } from './entity/chess.repository';
import { ChessCommonService } from './chessCommon.service';
import { ChessStatus } from './entity/chess.interface';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ChessService {
      constructor(
            private readonly chessRepository: ChessRepository,
            private readonly redisService: RedisService,
            private readonly chessCommonService: ChessCommonService,
      ) {}
      async loadGameToCache(chessId: string) {
            const getGame = await this.chessRepository.getOneTTTByFiled('chess.id = :id', { id: chessId });
            if (!getGame || getGame.status === ChessStatus.END || getGame.status === ChessStatus.PLAYING) return false;

            return true;
      }

      async joinGame(boardId: string, user: User) {
            // const board = await this.ticTacToeCommonService.getBoard(boardId);
            // if (!board) return false;
            // const userIds = board.users.map((item) => item.id);
            // if (!userIds.includes(user.id) && (!board.users[0].id || !board.users[1].id)) {
            //       if (!board.users[0].id) {
            //             board.users[0].id = user.id;
            //       } else board.users[1].id = user.id;
            // } else return false;
            // await this.ticTacToeCommonService.setBoard(boardId, board);
            // return true;
      }
}
