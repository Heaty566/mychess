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
import { ChessTanService } from '../chessTan.service';

//---- Repository

describe('ChessTanService', () => {
      let app: INestApplication;
      let user1: User;
      let user2: User;
      let resetDB: any;
      let generateFakeUser: () => Promise<User>;
      let chessService: ChessService;
      let redisService: RedisService;
      let chessTanService: ChessTanService;

      beforeAll(async () => {
            const { getApp, module, resetDatabase, getFakeUser } = await initTestModule();
            app = getApp;

            resetDB = resetDatabase;
            generateFakeUser = getFakeUser;
            chessService = module.get<ChessService>(ChessService);
            chessTanService = module.get<ChessTanService>(ChessTanService);
            redisService = module.get<RedisService>(RedisService);
      });

      describe('pawnVailableMove', () => {
            let chessBoard: ChessBoard;
            beforeEach(() => {
                  chessBoard = new ChessBoard();
            });

            it('x = 1, y = 1', async () => {
                  chessBoard.board[0][2].chess = ChessRole.PAWN;
                  chessBoard.board[0][2].flag = 1;
                  chessBoard.board[2][2].chess = ChessRole.PAWN;
                  chessBoard.board[2][2].flag = 1;
                  const result = chessTanService.pawnVailableMove({ flag: 0, x: 1, y: 1, chessRole: ChessRole.PAWN }, chessBoard);

                  expect(result.length).toBe(4);
            });

            it('x = 1, y = 1', async () => {
                  chessBoard.board[0][2].chess = ChessRole.PAWN;
                  chessBoard.board[0][2].flag = 1;
                  chessBoard.board[2][2].chess = ChessRole.PAWN;
                  chessBoard.board[2][2].flag = 1;
                  chessBoard.board[1][3].chess = ChessRole.PAWN;
                  chessBoard.board[1][3].flag = 0;

                  const result = chessTanService.pawnVailableMove({ flag: 0, x: 1, y: 1, chessRole: ChessRole.PAWN }, chessBoard);

                  expect(result.length).toBe(3);
            });
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
