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
                  chessBoard = new ChessBoard();
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
                  chessBoard = new ChessBoard();
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
                  chessBoard = new ChessBoard();
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
                  chessBoard = new ChessBoard();
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
                  chessBoard = new ChessBoard();
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

      describe('kingIsChecked', () => {
            let chessBoard: ChessBoard;
            beforeEach(() => {
                  chessBoard = new ChessBoard();
            });

            it('check by rook, queen', () => {
                  chessBoard.board[0][6] = {
                        chessRole: ChessRole.ROOK,
                        flag: 1,
                  };
                  const result = chessService.kingIsChecked({ flag: 0, x: 0, y: 0, chessRole: ChessRole.KING }, chessBoard);
                  expect(result).toBeTruthy();
            });

            it('check by rook, queen', () => {
                  chessBoard.board[0][6] = {
                        chessRole: ChessRole.QUEEN,
                        flag: 1,
                  };
                  chessBoard.board[0][3] = {
                        chessRole: ChessRole.ROOK,
                        flag: 0,
                  };
                  const result = chessService.kingIsChecked({ flag: 0, x: 0, y: 0, chessRole: ChessRole.KING }, chessBoard);
                  expect(result).toBeFalsy();
            });

            it('check by rook, queen', () => {
                  chessBoard.board[0][0] = {
                        chessRole: ChessRole.ROOK,
                        flag: 1,
                  };
                  chessBoard.board[0][6] = {
                        chessRole: ChessRole.ROOK,
                        flag: 1,
                  };
                  chessBoard.board[0][3] = {
                        chessRole: ChessRole.ROOK,
                        flag: 0,
                  };
                  const result = chessService.kingIsChecked({ flag: 0, x: 0, y: 2, chessRole: ChessRole.KING }, chessBoard);
                  expect(result).toBeTruthy();
            });

            it('check by rook, queen', () => {
                  chessBoard.board[7][7] = {
                        chessRole: ChessRole.ROOK,
                        flag: 1,
                  };
                  chessBoard.board[0][4] = {
                        chessRole: ChessRole.QUEEN,
                        flag: 1,
                  };

                  const result = chessService.kingIsChecked({ flag: 0, x: 0, y: 2, chessRole: ChessRole.KING }, chessBoard);
                  expect(result).toBeTruthy();
            });

            it('check by rook, queen', () => {
                  chessBoard.board[0][7] = {
                        chessRole: ChessRole.ROOK,
                        flag: 0,
                  };
                  chessBoard.board[0][2] = {
                        chessRole: ChessRole.ROOK,
                        flag: 1,
                  };

                  const result = chessService.kingIsChecked({ flag: 0, x: 0, y: 0, chessRole: ChessRole.KING }, chessBoard);
                  expect(result).toBeTruthy();
            });

            it('check by bishop, queen', () => {
                  chessBoard.board[7][7] = {
                        chessRole: ChessRole.QUEEN,
                        flag: 0,
                  };

                  const result = chessService.kingIsChecked({ flag: 1, x: 0, y: 0, chessRole: ChessRole.KING }, chessBoard);
                  expect(result).toBeTruthy();
            });

            it('check by bishop, queen', () => {
                  chessBoard.board[7][7] = {
                        chessRole: ChessRole.QUEEN,
                        flag: 0,
                  };

                  chessBoard.board[4][4] = {
                        chessRole: ChessRole.BISHOP,
                        flag: 1,
                  };

                  const result = chessService.kingIsChecked({ flag: 1, x: 0, y: 0, chessRole: ChessRole.KING }, chessBoard);
                  expect(result).toBeFalsy();
            });

            it('check by bishop, queen', () => {
                  chessBoard.board[7][1] = {
                        chessRole: ChessRole.QUEEN,
                        flag: 0,
                  };

                  chessBoard.board[3][5] = {
                        chessRole: ChessRole.BISHOP,
                        flag: 1,
                  };

                  const result = chessService.kingIsChecked({ flag: 1, x: 4, y: 4, chessRole: ChessRole.KING }, chessBoard);
                  expect(result).toBeTruthy();
            });

            it('check by bishop, queen', () => {
                  chessBoard.board[7][1] = {
                        chessRole: ChessRole.QUEEN,
                        flag: 0,
                  };

                  chessBoard.board[3][5] = {
                        chessRole: ChessRole.BISHOP,
                        flag: 1,
                  };

                  chessBoard.board[6][2] = {
                        chessRole: ChessRole.PAWN,
                        flag: 0,
                  };

                  const result = chessService.kingIsChecked({ flag: 1, x: 4, y: 4, chessRole: ChessRole.KING }, chessBoard);
                  expect(result).toBeTruthy();
            });

            it('check by knight', () => {
                  chessBoard.board[6][2] = {
                        chessRole: ChessRole.KNIGHT,
                        flag: 0,
                  };

                  const result = chessService.kingIsChecked({ flag: 1, x: 0, y: 0, chessRole: ChessRole.KING }, chessBoard);
                  expect(result).toBeFalsy();
            });

            it('check by knight', () => {
                  chessBoard.board[2][1] = {
                        chessRole: ChessRole.KNIGHT,
                        flag: 0,
                  };

                  const result = chessService.kingIsChecked({ flag: 1, x: 0, y: 0, chessRole: ChessRole.KING }, chessBoard);
                  expect(result).toBeTruthy();
            });

            it('check by knight', () => {
                  chessBoard.board[1][2] = {
                        chessRole: ChessRole.KNIGHT,
                        flag: 0,
                  };

                  const result = chessService.kingIsChecked({ flag: 1, x: 0, y: 0, chessRole: ChessRole.KING }, chessBoard);
                  expect(result).toBeTruthy();
            });

            it('check by knight', () => {
                  chessBoard.board[1][2] = {
                        chessRole: ChessRole.KNIGHT,
                        flag: 0,
                  };

                  const result = chessService.kingIsChecked({ flag: 1, x: 3, y: 3, chessRole: ChessRole.KING }, chessBoard);
                  expect(result).toBeTruthy();
            });

            it('check by pawn', () => {
                  chessBoard.board[4][4] = {
                        chessRole: ChessRole.PAWN,
                        flag: 1,
                  };

                  const result = chessService.kingIsChecked({ flag: 0, x: 3, y: 3, chessRole: ChessRole.KING }, chessBoard);
                  expect(result).toBeTruthy();
            });

            it('check by pawn', () => {
                  chessBoard.board[2][4] = {
                        chessRole: ChessRole.PAWN,
                        flag: 1,
                  };

                  const result = chessService.kingIsChecked({ flag: 0, x: 3, y: 3, chessRole: ChessRole.KING }, chessBoard);
                  expect(result).toBeTruthy();
            });

            it('check by pawn', () => {
                  chessBoard.board[2][2] = {
                        chessRole: ChessRole.PAWN,
                        flag: 0,
                  };

                  const result = chessService.kingIsChecked({ flag: 1, x: 3, y: 3, chessRole: ChessRole.KING }, chessBoard);
                  expect(result).toBeTruthy();
            });

            it('check by pawn', () => {
                  chessBoard.board[4][2] = {
                        chessRole: ChessRole.PAWN,
                        flag: 0,
                  };

                  const result = chessService.kingIsChecked({ flag: 1, x: 3, y: 3, chessRole: ChessRole.KING }, chessBoard);
                  expect(result).toBeTruthy();
            });

            it('check by king', () => {
                  chessBoard.board[4][3] = {
                        chessRole: ChessRole.KING,
                        flag: 0,
                  };

                  const result = chessService.kingIsChecked({ flag: 1, x: 3, y: 3, chessRole: ChessRole.KING }, chessBoard);
                  expect(result).toBeTruthy();
            });

            it('check by king', () => {
                  chessBoard.board[3][4] = {
                        chessRole: ChessRole.KING,
                        flag: 0,
                  };

                  const result = chessService.kingIsChecked({ flag: 1, x: 3, y: 3, chessRole: ChessRole.KING }, chessBoard);
                  expect(result).toBeTruthy();
            });

            it('check by king', () => {
                  chessBoard.board[3][2] = {
                        chessRole: ChessRole.KING,
                        flag: 0,
                  };

                  const result = chessService.kingIsChecked({ flag: 1, x: 3, y: 3, chessRole: ChessRole.KING }, chessBoard);
                  expect(result).toBeTruthy();
            });

            it('check by king', () => {
                  chessBoard.board[2][2] = {
                        chessRole: ChessRole.KING,
                        flag: 0,
                  };

                  const result = chessService.kingIsChecked({ flag: 1, x: 3, y: 3, chessRole: ChessRole.KING }, chessBoard);
                  expect(result).toBeTruthy();
            });
      });

      describe('canMove', () => {
            let chessBoard: ChessBoard;
            beforeEach(() => {
                  chessBoard = new ChessBoard();
            });

            it('rook move', () => {
                  chessBoard.board[0][0] = {
                        chessRole: ChessRole.KING,
                        flag: 0,
                  };

                  chessBoard.board[2][2] = {
                        chessRole: ChessRole.ROOK,
                        flag: 0,
                  };

                  const result = chessService.canMove(
                        { x: 2, y: 2, flag: 0, chessRole: ChessRole.ROOK },
                        { x: 2, y: 7, flag: -1, chessRole: ChessRole.EMPTY },
                        chessBoard,
                  );
                  expect(result).toBeTruthy();
            });

            it('Rook is pinned by bishop', () => {
                  chessBoard.board[0][0] = {
                        chessRole: ChessRole.KING,
                        flag: 0,
                  };
                  chessBoard.board[1][1] = {
                        chessRole: ChessRole.ROOK,
                        flag: 0,
                  };
                  chessBoard.board[4][4] = {
                        chessRole: ChessRole.BISHOP,
                        flag: 1,
                  };

                  const result = chessService.canMove(
                        { x: 1, y: 1, flag: 0, chessRole: ChessRole.ROOK },
                        { x: 2, y: 7, flag: -1, chessRole: ChessRole.EMPTY },
                        chessBoard,
                  );

                  expect(result).toBeFalsy();
            });
      });

      describe('rookLegalMove', () => {
            let chessBoard: ChessBoard;
            beforeEach(() => {
                  chessBoard = new ChessBoard();
            });

            it('Rook is pinned by rook', () => {
                  chessBoard.board[0][0] = {
                        chessRole: ChessRole.KING,
                        flag: 0,
                  };
                  chessBoard.board[0][1] = {
                        chessRole: ChessRole.ROOK,
                        flag: 0,
                  };
                  chessBoard.board[0][4] = {
                        chessRole: ChessRole.ROOK,
                        flag: 1,
                  };

                  const legalMove = chessService['rookLegalMove']({ x: 0, y: 1, flag: 0, chessRole: ChessRole.ROOK }, chessBoard);
                  expect(legalMove.length).toBe(3);
            });

            it('Rook is pinned by bishop', () => {
                  chessBoard.board[0][0] = {
                        chessRole: ChessRole.KING,
                        flag: 0,
                  };
                  chessBoard.board[1][1] = {
                        chessRole: ChessRole.ROOK,
                        flag: 0,
                  };
                  chessBoard.board[4][4] = {
                        chessRole: ChessRole.BISHOP,
                        flag: 1,
                  };

                  const legalMove = chessService['rookLegalMove']({ x: 1, y: 1, flag: 0, chessRole: ChessRole.ROOK }, chessBoard);
                  expect(legalMove.length).toBe(0);
            });
      });

      describe('bishopLegalMove', () => {
            let chessBoard: ChessBoard;
            beforeEach(() => {
                  chessBoard = new ChessBoard();
            });

            it('Bishop is pinned by rook', () => {
                  chessBoard.board[0][0] = {
                        chessRole: ChessRole.KING,
                        flag: 0,
                  };
                  chessBoard.board[0][1] = {
                        chessRole: ChessRole.BISHOP,
                        flag: 0,
                  };
                  chessBoard.board[0][4] = {
                        chessRole: ChessRole.ROOK,
                        flag: 1,
                  };

                  const legalMove = chessService['bishopLegalMove']({ x: 0, y: 1, flag: 0, chessRole: ChessRole.BISHOP }, chessBoard);
                  expect(legalMove.length).toBe(0);
            });

            it('Bishop is pinned by bishop', () => {
                  chessBoard.board[0][0] = {
                        chessRole: ChessRole.KING,
                        flag: 0,
                  };
                  chessBoard.board[1][1] = {
                        chessRole: ChessRole.BISHOP,
                        flag: 0,
                  };
                  chessBoard.board[4][4] = {
                        chessRole: ChessRole.BISHOP,
                        flag: 1,
                  };

                  const legalMove = chessService['bishopLegalMove']({ x: 1, y: 1, flag: 0, chessRole: ChessRole.BISHOP }, chessBoard);
                  expect(legalMove.length).toBe(3);
            });
      });

      describe('queenLegalMove', () => {
            let chessBoard: ChessBoard;
            beforeEach(() => {
                  chessBoard = new ChessBoard();
            });

            it('Queen is pinned by rook', () => {
                  chessBoard.board[0][0] = {
                        chessRole: ChessRole.KING,
                        flag: 0,
                  };
                  chessBoard.board[0][2] = {
                        chessRole: ChessRole.QUEEN,
                        flag: 0,
                  };
                  chessBoard.board[0][4] = {
                        chessRole: ChessRole.ROOK,
                        flag: 1,
                  };

                  const legalMove = chessService['queenLegalMove']({ x: 0, y: 2, flag: 0, chessRole: ChessRole.QUEEN }, chessBoard);
                  expect(legalMove.length).toBe(3);
            });

            it('Queen is pinned by Bishop', () => {
                  chessBoard.board[0][0] = {
                        chessRole: ChessRole.KING,
                        flag: 0,
                  };
                  chessBoard.board[2][2] = {
                        chessRole: ChessRole.QUEEN,
                        flag: 0,
                  };
                  chessBoard.board[4][4] = {
                        chessRole: ChessRole.BISHOP,
                        flag: 1,
                  };

                  const legalMove = chessService['queenLegalMove']({ x: 2, y: 2, flag: 0, chessRole: ChessRole.QUEEN }, chessBoard);
                  expect(legalMove.length).toBe(3);
            });
      });

      describe('knightLegalMove', () => {
            let chessBoard: ChessBoard;
            beforeEach(() => {
                  chessBoard = new ChessBoard();
            });

            it('Knight is pinned by rook', () => {
                  chessBoard.board[0][0] = {
                        chessRole: ChessRole.KING,
                        flag: 0,
                  };
                  chessBoard.board[0][2] = {
                        chessRole: ChessRole.KNIGHT,
                        flag: 0,
                  };
                  chessBoard.board[0][4] = {
                        chessRole: ChessRole.ROOK,
                        flag: 1,
                  };

                  const legalMove = chessService['knightLegalMove']({ x: 0, y: 2, flag: 0, chessRole: ChessRole.KNIGHT }, chessBoard);
                  expect(legalMove.length).toBe(0);
            });

            it('Knight is pinned by Bishop', () => {
                  chessBoard.board[0][0] = {
                        chessRole: ChessRole.KING,
                        flag: 0,
                  };
                  chessBoard.board[2][2] = {
                        chessRole: ChessRole.KNIGHT,
                        flag: 0,
                  };
                  chessBoard.board[4][4] = {
                        chessRole: ChessRole.BISHOP,
                        flag: 1,
                  };

                  const legalMove = chessService['knightLegalMove']({ x: 2, y: 2, flag: 0, chessRole: ChessRole.KNIGHT }, chessBoard);
                  expect(legalMove.length).toBe(0);
            });
      });

      describe('kingLegalMove', () => {
            let chessBoard: ChessBoard;
            beforeEach(() => {
                  chessBoard = new ChessBoard();
            });

            it('Ka1 vs Rb8', () => {
                  chessBoard.board[0][0] = {
                        chessRole: ChessRole.KING,
                        flag: 0,
                  };
                  chessBoard.board[1][7] = {
                        chessRole: ChessRole.ROOK,
                        flag: 1,
                  };
                  const legalMove = chessService['kingLegalMove']({ x: 0, y: 0, flag: 0, chessRole: ChessRole.KING }, chessBoard);
                  expect(legalMove.length).toBe(1);
            });

            it('Ka1 vs Rb8, Rh2', () => {
                  chessBoard.board[0][0] = {
                        chessRole: ChessRole.KING,
                        flag: 0,
                  };
                  chessBoard.board[1][7] = {
                        chessRole: ChessRole.ROOK,
                        flag: 1,
                  };

                  chessBoard.board[7][1] = {
                        chessRole: ChessRole.ROOK,
                        flag: 1,
                  };
                  const legalMove = chessService['kingLegalMove']({ x: 0, y: 0, flag: 0, chessRole: ChessRole.KING }, chessBoard);
                  expect(legalMove.length).toBe(0);
            });

            it('Kc3 vs Rb8, Rh2', () => {
                  chessBoard.board[2][2] = {
                        chessRole: ChessRole.KING,
                        flag: 0,
                  };
                  chessBoard.board[1][7] = {
                        chessRole: ChessRole.ROOK,
                        flag: 1,
                  };

                  chessBoard.board[7][1] = {
                        chessRole: ChessRole.ROOK,
                        flag: 1,
                  };
                  const legalMove = chessService['kingLegalMove']({ x: 2, y: 2, flag: 0, chessRole: ChessRole.KING }, chessBoard);
                  expect(legalMove.length).toBe(3);
            });
            it('Kc3 vs Rb8, Rh2, Qg8', () => {
                  chessBoard.board[2][2] = {
                        chessRole: ChessRole.KING,
                        flag: 0,
                  };
                  chessBoard.board[1][7] = {
                        chessRole: ChessRole.ROOK,
                        flag: 1,
                  };

                  chessBoard.board[7][1] = {
                        chessRole: ChessRole.ROOK,
                        flag: 1,
                  };
                  chessBoard.board[6][7] = {
                        chessRole: ChessRole.QUEEN,
                        flag: 1,
                  };
                  const legalMove = chessService['kingLegalMove']({ x: 2, y: 2, flag: 0, chessRole: ChessRole.KING }, chessBoard);
                  expect(legalMove.length).toBe(2);
            });

            it('Kc3 vs Rb8, Rh2, Qg8, Nf4', () => {
                  chessBoard.board[2][2] = {
                        chessRole: ChessRole.KING,
                        flag: 0,
                  };
                  chessBoard.board[1][7] = {
                        chessRole: ChessRole.ROOK,
                        flag: 1,
                  };

                  chessBoard.board[7][1] = {
                        chessRole: ChessRole.ROOK,
                        flag: 1,
                  };
                  chessBoard.board[6][7] = {
                        chessRole: ChessRole.QUEEN,
                        flag: 1,
                  };
                  chessBoard.board[5][3] = {
                        chessRole: ChessRole.KNIGHT,
                        flag: 1,
                  };
                  const legalMove = chessService['kingLegalMove']({ x: 2, y: 2, flag: 0, chessRole: ChessRole.KING }, chessBoard);
                  expect(legalMove.length).toBe(1);
            });
      });

      describe('pawnAvailableMove', () => {
            let chessBoard: ChessBoard;
            beforeEach(() => {
                  chessBoard = new ChessBoard();
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

      describe('pawnLegalMove', () => {
            let chessBoard: ChessBoard;
            beforeEach(() => {
                  chessBoard = new ChessBoard();
            });

            it('Pawn is pinned by Rook', () => {
                  chessBoard.board[0][1] = {
                        chessRole: ChessRole.KING,
                        flag: 0,
                  };
                  chessBoard.board[1][1] = {
                        chessRole: ChessRole.PAWN,
                        flag: 0,
                  };

                  chessBoard.board[7][1] = {
                        chessRole: ChessRole.ROOK,
                        flag: 1,
                  };
                  const legalMove = chessService['pawnLegalMove']({ x: 1, y: 1, flag: 0, chessRole: ChessRole.PAWN }, chessBoard);
                  expect(legalMove.length).toBe(0);
            });

            it('Pawn is pinned by Bishop', () => {
                  chessBoard.board[0][1] = {
                        chessRole: ChessRole.KING,
                        flag: 0,
                  };
                  chessBoard.board[2][3] = {
                        chessRole: ChessRole.PAWN,
                        flag: 0,
                  };

                  chessBoard.board[4][5] = {
                        chessRole: ChessRole.BISHOP,
                        flag: 1,
                  };
                  const legalMove = chessService['pawnLegalMove']({ x: 2, y: 3, flag: 0, chessRole: ChessRole.PAWN }, chessBoard);
                  expect(legalMove.length).toBe(0);
            });
      });
      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
