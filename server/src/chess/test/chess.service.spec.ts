import { INestApplication } from '@nestjs/common';

//---- Helper
import { initTestModule } from '../../test/initTest';

//---- Service
import { RedisService } from '../../utils/redis/redis.service';

//---- Entity
import { User } from '../../user/entities/user.entity';
import { ChessBoard } from '../entity/chessBoard.entity';
import { ChessService } from '../chess.service';
import { ChessRole } from '../entity/chess.interface';

//---- Repository

describe('ChessService', () => {
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

      describe('kingAvailableMove', () => {
            let chessBoard: ChessBoard;
            beforeEach(() => {
                  chessBoard = new ChessBoard(true);
            });

            it('x = 1, y = 1', async () => {
                  const result = chessService['kingAvailableMove']({ flag: 0, x: 1, y: 1, chessRole: ChessRole.KING }, chessBoard);
                  expect(result.length).toBe(8);
            });
            it('x = 1, y = 1', async () => {
                  chessBoard.board[0][0] = {
                        chessRole: ChessRole.PAWN,
                        flag: 0,
                  };

                  const result = chessService['kingAvailableMove']({ flag: 0, x: 1, y: 1, chessRole: ChessRole.KING }, chessBoard);
                  expect(result.length).toBe(7);
            });

            it('x = 0, y = 0', async () => {
                  const result = chessService['kingAvailableMove']({ flag: 0, x: 0, y: 0, chessRole: ChessRole.KING }, chessBoard);

                  expect(result.length).toBe(3);
            });

            it('x = 1, y = 1', async () => {
                  chessBoard.board[0][0] = {
                        chessRole: ChessRole.PAWN,
                        flag: 1,
                  };

                  const result = chessService['kingAvailableMove']({ flag: 0, x: 1, y: 1, chessRole: ChessRole.KING }, chessBoard);

                  expect(result.length).toBe(8);
            });
      });

      describe('knightAvailableMove', () => {
            let chessBoard: ChessBoard;
            ['knightAvailableMove'];
            beforeEach(() => {
                  chessBoard = new ChessBoard(true);
            });

            it('x = 1, y = 1', () => {
                  const result = chessService['knightAvailableMove']({ flag: 0, x: 1, y: 1, chessRole: ChessRole.KNIGHT }, chessBoard);
                  expect(result.length).toBe(4);
            });

            it('x = 7, y = 7', () => {
                  const result = chessService['knightAvailableMove']({ flag: 0, x: 7, y: 7, chessRole: ChessRole.KNIGHT }, chessBoard);
                  expect(result.length).toBe(2);
            });

            it('x = 4, y = 4', () => {
                  const result = chessService['knightAvailableMove']({ flag: 0, x: 4, y: 4, chessRole: ChessRole.KNIGHT }, chessBoard);
                  expect(result.length).toBe(8);
            });

            it('x = 7, y = 7', () => {
                  chessBoard.board[5][6] = {
                        chessRole: ChessRole.BISHOP,
                        flag: 1,
                  };

                  chessBoard.board[6][5] = {
                        chessRole: ChessRole.BISHOP,
                        flag: 1,
                  };

                  const result = chessService['knightAvailableMove']({ flag: 0, x: 7, y: 7, chessRole: ChessRole.KNIGHT }, chessBoard);
                  expect(result.length).toBe(2);
            });

            it('x = 7, y = 7', () => {
                  chessBoard.board[5][6] = {
                        chessRole: ChessRole.BISHOP,
                        flag: 1,
                  };

                  chessBoard.board[6][5] = {
                        chessRole: ChessRole.BISHOP,
                        flag: 0,
                  };

                  const result = chessService['knightAvailableMove']({ flag: 0, x: 7, y: 7, chessRole: ChessRole.KNIGHT }, chessBoard);
                  expect(result.length).toBe(1);
            });
      });

      describe('rookAvailableMove', () => {
            let chessBoard: ChessBoard;
            beforeEach(() => {
                  chessBoard = new ChessBoard(true);
            });

            it('x = 1, y = 1', () => {
                  const result = chessService['rookAvailableMove']({ flag: 0, x: 1, y: 1, chessRole: ChessRole.ROOK }, chessBoard);
                  expect(result.length).toBe(14);
            });

            it('x = 1, y = 1', () => {
                  chessBoard.board[1][5] = {
                        flag: 0,
                        chessRole: ChessRole.KNIGHT,
                  };

                  const result = chessService['rookAvailableMove']({ flag: 0, x: 1, y: 1, chessRole: ChessRole.ROOK }, chessBoard);
                  expect(result.length).toBe(11);
            });

            it('x = 1, y = 1', () => {
                  chessBoard.board[1][0] = {
                        flag: 0,
                        chessRole: ChessRole.KNIGHT,
                  };
                  chessBoard.board[0][1] = {
                        flag: 0,
                        chessRole: ChessRole.KNIGHT,
                  };
                  chessBoard.board[1][2] = {
                        flag: 0,
                        chessRole: ChessRole.KNIGHT,
                  };
                  chessBoard.board[2][1] = {
                        flag: 0,
                        chessRole: ChessRole.KNIGHT,
                  };
                  const result = chessService['rookAvailableMove']({ flag: 0, x: 1, y: 1, chessRole: ChessRole.ROOK }, chessBoard);
                  expect(result.length).toBe(0);
            });

            it('x = 1, y = 1', () => {
                  chessBoard.board[1][0] = {
                        flag: 0,
                        chessRole: ChessRole.KNIGHT,
                  };
                  chessBoard.board[0][1] = {
                        flag: 0,
                        chessRole: ChessRole.KNIGHT,
                  };
                  chessBoard.board[1][2] = {
                        flag: 0,
                        chessRole: ChessRole.KNIGHT,
                  };
                  chessBoard.board[2][1] = {
                        flag: 0,
                        chessRole: ChessRole.KNIGHT,
                  };
                  const result = chessService['rookAvailableMove']({ flag: 1, x: 1, y: 1, chessRole: ChessRole.ROOK }, chessBoard);
                  expect(result.length).toBe(4);
            });
      });

      describe('bishopAvailableMove', () => {
            let chessBoard: ChessBoard;
            beforeEach(() => {
                  chessBoard = new ChessBoard(true);
            });

            it('x = 1, y = 1', () => {
                  const result = chessService['bishopAvailableMove']({ flag: 0, x: 1, y: 1, chessRole: ChessRole.BISHOP }, chessBoard);
                  expect(result.length).toBe(9);
            });

            it('x = 1, y = 1', () => {
                  chessBoard.board[0][0] = {
                        flag: 1,
                        chessRole: ChessRole.KNIGHT,
                  };
                  chessBoard.board[2][2] = {
                        flag: 1,
                        chessRole: ChessRole.KNIGHT,
                  };

                  const result = chessService['bishopAvailableMove']({ flag: 0, x: 1, y: 1, chessRole: ChessRole.BISHOP }, chessBoard);
                  expect(result.length).toBe(4);
            });

            it('x = 1, y = 1', () => {
                  chessBoard.board[0][0] = {
                        flag: 1,
                        chessRole: ChessRole.KNIGHT,
                  };
                  chessBoard.board[2][2] = {
                        flag: 1,
                        chessRole: ChessRole.KNIGHT,
                  };

                  const result = chessService['bishopAvailableMove']({ flag: 1, x: 1, y: 1, chessRole: ChessRole.BISHOP }, chessBoard);
                  expect(result.length).toBe(2);
            });

            it('x = 4, y = 4', () => {
                  const result = chessService['bishopAvailableMove']({ flag: 0, x: 4, y: 4, chessRole: ChessRole.BISHOP }, chessBoard);
                  expect(result.length).toBe(13);
            });
      });

      describe('queenAvailable', () => {
            let chessBoard: ChessBoard;
            beforeEach(() => {
                  chessBoard = new ChessBoard(true);
            });

            it('x = 1, y = 1', () => {
                  const result = chessService['queenAvailableMove']({ flag: 0, x: 1, y: 1, chessRole: ChessRole.QUEEN }, chessBoard);
                  expect(result.length).toBe(23);
            });

            it('x = 4, y = 4', () => {
                  const result = chessService['queenAvailableMove']({ flag: 0, x: 4, y: 4, chessRole: ChessRole.QUEEN }, chessBoard);
                  expect(result.length).toBe(27);
            });

            it('x = 1, y = 1', () => {
                  chessBoard.board[0][0] = {
                        flag: 1,
                        chessRole: ChessRole.BISHOP,
                  };

                  chessBoard.board[0][1] = {
                        flag: 1,
                        chessRole: ChessRole.BISHOP,
                  };

                  chessBoard.board[2][2] = {
                        flag: 1,
                        chessRole: ChessRole.BISHOP,
                  };
                  const result = chessService['queenAvailableMove']({ flag: 0, x: 1, y: 1, chessRole: ChessRole.QUEEN }, chessBoard);
                  expect(result.length).toBe(18);
            });

            it('x = 1, y = 1', () => {
                  chessBoard.board[0][0] = {
                        flag: 1,
                        chessRole: ChessRole.BISHOP,
                  };

                  chessBoard.board[2][1] = {
                        flag: 0,
                        chessRole: ChessRole.BISHOP,
                  };

                  chessBoard.board[2][2] = {
                        flag: 0,
                        chessRole: ChessRole.BISHOP,
                  };
                  const result = chessService['queenAvailableMove']({ flag: 0, x: 1, y: 1, chessRole: ChessRole.QUEEN }, chessBoard);
                  expect(result.length).toBe(11);
            });
      });

      describe('pawnAvailableMove', () => {
            let chessBoard: ChessBoard;
            beforeEach(() => {
                  chessBoard = new ChessBoard(true);
            });

            it('white pawn: x = 0, y = 0', () => {
                  chessBoard.board[0][0] = {
                        chessRole: ChessRole.PAWN,
                        flag: 0,
                  };

                  const result = chessService['pawnAvailableMove']({ x: 0, y: 0, flag: 0, chessRole: ChessRole.PAWN }, chessBoard);
                  expect(result.length).toBe(0);
            });

            it('white pawn: x = 0, y = 1', () => {
                  chessBoard.board[0][1] = {
                        chessRole: ChessRole.PAWN,
                        flag: 0,
                  };

                  const result = chessService['pawnAvailableMove']({ x: 0, y: 1, flag: 0, chessRole: ChessRole.PAWN }, chessBoard);
                  expect(result.length).toBe(2);
            });

            it('white pawn: x = 0, y = 1, have a piece on a3', () => {
                  chessBoard.board[0][1] = {
                        chessRole: ChessRole.PAWN,
                        flag: 0,
                  };
                  chessBoard.board[0][2] = {
                        chessRole: ChessRole.PAWN,
                        flag: 0,
                  };
                  const result = chessService['pawnAvailableMove']({ x: 0, y: 1, flag: 0, chessRole: ChessRole.PAWN }, chessBoard);
                  expect(result.length).toBe(0);
            });

            it('white pawn: x = 0, y = 1, can eat piece on b3', () => {
                  chessBoard.board[0][1] = {
                        chessRole: ChessRole.PAWN,
                        flag: 0,
                  };
                  chessBoard.board[1][2] = {
                        chessRole: ChessRole.PAWN,
                        flag: 1,
                  };
                  const result = chessService['pawnAvailableMove']({ x: 0, y: 1, flag: 0, chessRole: ChessRole.PAWN }, chessBoard);
                  expect(result.length).toBe(3);
            });

            it('white pawn: x = 1, y = 1, can eat piece on a3, c3', () => {
                  chessBoard.board[1][1] = {
                        chessRole: ChessRole.PAWN,
                        flag: 0,
                  };
                  chessBoard.board[2][2] = {
                        chessRole: ChessRole.PAWN,
                        flag: 1,
                  };
                  chessBoard.board[0][2] = {
                        chessRole: ChessRole.PAWN,
                        flag: 1,
                  };
                  const result = chessService['pawnAvailableMove']({ x: 1, y: 1, flag: 0, chessRole: ChessRole.PAWN }, chessBoard);
                  expect(result.length).toBe(4);
            });

            it('white pawn: x = 1, y = 2, can eat piece on a3, c3', () => {
                  chessBoard.board[1][2] = {
                        chessRole: ChessRole.PAWN,
                        flag: 0,
                  };
                  chessBoard.board[2][3] = {
                        chessRole: ChessRole.PAWN,
                        flag: 1,
                  };
                  chessBoard.board[0][3] = {
                        chessRole: ChessRole.PAWN,
                        flag: 1,
                  };
                  const result = chessService['pawnAvailableMove']({ x: 1, y: 2, flag: 0, chessRole: ChessRole.PAWN }, chessBoard);
                  expect(result.length).toBe(3);
            });

            it('black pawn: x = 0, y = 7', () => {
                  chessBoard.board[0][7] = {
                        chessRole: ChessRole.PAWN,
                        flag: 1,
                  };

                  const result = chessService['pawnAvailableMove']({ x: 0, y: 7, flag: 1, chessRole: ChessRole.PAWN }, chessBoard);
                  expect(result.length).toBe(0);
            });

            it('black pawn: x = 0, y = 6', () => {
                  chessBoard.board[0][6] = {
                        chessRole: ChessRole.PAWN,
                        flag: 1,
                  };

                  const result = chessService['pawnAvailableMove']({ x: 0, y: 6, flag: 1, chessRole: ChessRole.PAWN }, chessBoard);
                  expect(result.length).toBe(2);
            });

            it('black pawn: x = 0, y = 6, have a pawn on a6', () => {
                  chessBoard.board[0][6] = {
                        chessRole: ChessRole.PAWN,
                        flag: 1,
                  };
                  chessBoard.board[0][5] = {
                        chessRole: ChessRole.PAWN,
                        flag: 1,
                  };

                  const result = chessService['pawnAvailableMove']({ x: 0, y: 6, flag: 1, chessRole: ChessRole.PAWN }, chessBoard);
                  expect(result.length).toBe(0);
            });

            it('black pawn: x = 0, y = 6, eat a piece on b6', () => {
                  chessBoard.board[0][6] = {
                        chessRole: ChessRole.PAWN,
                        flag: 1,
                  };
                  chessBoard.board[1][5] = {
                        chessRole: ChessRole.PAWN,
                        flag: 0,
                  };

                  const result = chessService['pawnAvailableMove']({ x: 0, y: 6, flag: 1, chessRole: ChessRole.PAWN }, chessBoard);
                  expect(result.length).toBe(3);
            });

            it('black pawn: x = 1, y = 6, eat a piece on a6, c6', () => {
                  chessBoard.board[1][6] = {
                        chessRole: ChessRole.PAWN,
                        flag: 1,
                  };
                  chessBoard.board[0][5] = {
                        chessRole: ChessRole.PAWN,
                        flag: 0,
                  };
                  chessBoard.board[2][5] = {
                        chessRole: ChessRole.PAWN,
                        flag: 0,
                  };

                  const result = chessService['pawnAvailableMove']({ x: 1, y: 6, flag: 1, chessRole: ChessRole.PAWN }, chessBoard);
                  expect(result.length).toBe(4);
            });

            it('black pawn: x = 1, y = 5, eat a piece on a6, c6', () => {
                  chessBoard.board[1][5] = {
                        chessRole: ChessRole.PAWN,
                        flag: 1,
                  };
                  chessBoard.board[0][4] = {
                        chessRole: ChessRole.PAWN,
                        flag: 0,
                  };
                  chessBoard.board[2][4] = {
                        chessRole: ChessRole.PAWN,
                        flag: 0,
                  };

                  const result = chessService['pawnAvailableMove']({ x: 1, y: 5, flag: 1, chessRole: ChessRole.PAWN }, chessBoard);
                  expect(result.length).toBe(3);
            });
      });

      describe('chessRoleLegalMove', () => {
            let chessBoard: ChessBoard;
            beforeEach(() => {
                  chessBoard = new ChessBoard(true);
                  chessBoard.board[4][1] = {
                        chessRole: ChessRole.KING,
                        flag: 0,
                  };
            });

            it('pawn', () => {
                  const legalMove = chessService['chessRoleLegalMove']({ x: 0, y: 2, flag: 0, chessRole: ChessRole.PAWN }, chessBoard);
                  expect(legalMove.length).toBeDefined();
            });

            it('king', () => {
                  const legalMove = chessService['chessRoleLegalMove']({ x: 4, y: 1, flag: 0, chessRole: ChessRole.KING }, chessBoard);
                  expect(legalMove.length).toBeDefined();
            });

            it('queen', () => {
                  const legalMove = chessService['chessRoleLegalMove']({ x: 0, y: 2, flag: 0, chessRole: ChessRole.QUEEN }, chessBoard);
                  expect(legalMove.length).toBeDefined();
            });

            it('knight', () => {
                  const legalMove = chessService['chessRoleLegalMove']({ x: 0, y: 2, flag: 0, chessRole: ChessRole.KNIGHT }, chessBoard);
                  expect(legalMove.length).toBeDefined();
            });

            it('bishop', () => {
                  const legalMove = chessService['chessRoleLegalMove']({ x: 0, y: 2, flag: 0, chessRole: ChessRole.BISHOP }, chessBoard);
                  expect(legalMove.length).toBeDefined();
            });

            it('rook', () => {
                  const legalMove = chessService['chessRoleLegalMove']({ x: 0, y: 2, flag: 0, chessRole: ChessRole.ROOK }, chessBoard);
                  expect(legalMove.length).toBeDefined();
            });
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
