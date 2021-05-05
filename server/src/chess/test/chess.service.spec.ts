import { INestApplication } from '@nestjs/common';

//---- Helper
import { initTestModule } from '../../test/initTest';

//---- Service
import { RedisService } from '../../providers/redis/redis.service';

//---- Entity
import { User } from '../../users/entities/user.entity';
import { ChessBoard } from '../entity/chessBoard.entity';
import { ChessService } from '../chess.service';
import { ChessRole } from '../entity/chess.interface';

//---- Repository

describe('ticTacToeService', () => {
      let app: INestApplication;
      let user1: User;
      let user2: User;
      let resetDB: any;
      let generateFakeUser: () => Promise<User>;
      let chessService: ChessService;
      let redisService: RedisService;

      beforeAll(async () => {
            const { getApp, module, resetDatabase, getFakeUser } = await initTestModule();
            app = getApp;

            resetDB = resetDatabase;
            generateFakeUser = getFakeUser;
            chessService = module.get<ChessService>(ChessService);
            redisService = module.get<RedisService>(RedisService);
      });

      describe('kingVailableMove', () => {
            let chessBoard: ChessBoard;
            beforeEach(() => {
                  chessBoard = new ChessBoard();
            });

            it('x = 1, y = 1', async () => {
                  const result = chessService.kingVailableMove({ flag: 0, x: 1, y: 1, chessRole: ChessRole.KING }, chessBoard);
                  expect(result.length).toBe(8);
            });
            it('x = 1, y = 1', async () => {
                  chessBoard.board[0][0].chess = ChessRole.PAWN;
                  chessBoard.board[0][0].flag = 0;

                  const result = chessService.kingVailableMove({ flag: 0, x: 1, y: 1, chessRole: ChessRole.KING }, chessBoard);

                  console.log(result);
                  expect(result.length).toBe(7);
            });
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
