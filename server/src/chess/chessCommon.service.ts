import { Injectable } from '@nestjs/common';
import { ChessRepository } from './entity/chess.repository';
import { ChessStatus } from './entity/chess.interface';
import { Chess } from './entity/chess.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ChessCommonService {
      constructor(private readonly chessRepository: ChessRepository) {}

      async isPlaying(userId: string) {
            const currentPlay = await this.chessRepository.getManyTTTByField('chess.status = :status and user.id = :userId', {
                  status: ChessStatus.PLAYING,
                  userId,
            });

            console.log(currentPlay);

            return Boolean(currentPlay.length);
      }

      async createNewGame(user: User) {
            const chess = new Chess();
            chess.users = [user];
            const insertNewChess = await this.saveChess(chess);

            return insertNewChess.id;
      }

      async saveChess(chess: Chess) {
            return await this.chessRepository.save(chess);
      }
}
