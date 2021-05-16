import { INestApplication } from '@nestjs/common';

//---- Helper
import { initTestModule } from '../../test/initTest';

//---- Service
import { ChessService } from '../chess.service';
import { ChessCommonService } from '../chessCommon.service';

//---- Entity
import { User } from '../../user/entities/user.entity';
import { ChessBoard } from '../entity/chessBoard.entity';
import { ChessPlayer, ChessRole, ChessStatus, PlayerFlagEnum } from '../entity/chess.interface';
import { ChessMove } from '../entity/chessMove.entity';

describe('ChessService', () => {
      let app: INestApplication;
      let resetDB: any;
      let generateFakeUser: () => Promise<User>;
      let chessService: ChessService;
      let chessCommonService: ChessCommonService;

      beforeAll(async () => {
            const { getApp, module, resetDatabase, getFakeUser } = await initTestModule();
            app = getApp;

            resetDB = resetDatabase;
            generateFakeUser = getFakeUser;
            chessService = module.get<ChessService>(ChessService);
            chessCommonService = module.get<ChessCommonService>(ChessCommonService);
      });

      describe('kingAvailableMove', () => {
            let chessBoard: ChessBoard;
            beforeEach(async () => {
                  chessBoard = new ChessBoard(true);
                  chessBoard.board[0][0] = {
                        chessRole: ChessRole.ROOK,
                        flag: PlayerFlagEnum.WHITE,
                  };
                  chessBoard.board[7][0] = {
                        chessRole: ChessRole.ROOK,
                        flag: PlayerFlagEnum.WHITE,
                  };
                  chessBoard.board[4][0] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.WHITE,
                  };
                  await chessCommonService.setBoard(chessBoard);
            });

            it('x = 4, y = 0 has 7 vailable move', async () => {
                  const result = await chessService['kingAvailableMove']({ x: 4, y: 0 }, chessBoard.id);
                  expect(result.length).toBe(7);
            });

            it('x = 4, y = 0 has 6 vailable move', async () => {
                  chessBoard.board[4][1] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.WHITE,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['kingAvailableMove']({ x: 4, y: 0 }, chessBoard.id);
                  expect(result.length).toBe(6);
            });

            it('x = 4, y = 0 has 5 vailable move with one enemy can check mate', async () => {
                  chessBoard.board[4][1] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['kingAvailableMove']({ x: 4, y: 0 }, chessBoard.id);
                  expect(result.length).toBe(5);
            });

            it('x = 4, y = 0 has 6 vailable move with one enemy can not check mate', async () => {
                  chessBoard.board[3][0] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['kingAvailableMove']({ x: 4, y: 0 }, chessBoard.id);
                  expect(result.length).toBe(6);
            });

            it('Caslte', async () => {
                  chessBoard.board[7][7] = {
                        chessRole: ChessRole.ROOK,
                        flag: PlayerFlagEnum.BLACK,
                  };

                  chessBoard.board[0][7] = {
                        chessRole: ChessRole.ROOK,
                        flag: PlayerFlagEnum.BLACK,
                  };

                  chessBoard.board[4][7] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['kingAvailableMove']({ x: 4, y: 7 }, chessBoard.id);
                  expect(result.length).toBe(7);
            });
      });

      describe('knightAvailableMove', () => {
            let chessBoard: ChessBoard;
            ['knightAvailableMove'];
            beforeEach(() => {
                  chessBoard = new ChessBoard(true);
            });

            it('x = 1, y = 1', async () => {
                  chessBoard.board[1][1] = {
                        chessRole: ChessRole.KNIGHT,
                        flag: PlayerFlagEnum.WHITE,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['knightAvailableMove']({ x: 1, y: 1 }, chessBoard.id);
                  expect(result.length).toBe(4);
            });

            it('x = 7, y = 7', async () => {
                  chessBoard.board[7][7] = {
                        chessRole: ChessRole.KNIGHT,
                        flag: PlayerFlagEnum.WHITE,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['knightAvailableMove']({ x: 7, y: 7 }, chessBoard.id);
                  expect(result.length).toBe(2);
            });

            it('x = 4, y = 4', async () => {
                  chessBoard.board[4][4] = {
                        chessRole: ChessRole.KNIGHT,
                        flag: PlayerFlagEnum.WHITE,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['knightAvailableMove']({ x: 4, y: 4 }, chessBoard.id);
                  expect(result.length).toBe(8);
            });

            it('x = 7, y = 7', async () => {
                  chessBoard.board[7][7] = {
                        chessRole: ChessRole.KNIGHT,
                        flag: PlayerFlagEnum.WHITE,
                  };
                  chessBoard.board[5][6] = {
                        chessRole: ChessRole.BISHOP,
                        flag: PlayerFlagEnum.BLACK,
                  };

                  chessBoard.board[6][5] = {
                        chessRole: ChessRole.BISHOP,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['knightAvailableMove']({ x: 7, y: 7 }, chessBoard.id);
                  expect(result.length).toBe(2);
            });

            it('x = 7, y = 7', async () => {
                  chessBoard.board[7][7] = {
                        chessRole: ChessRole.KNIGHT,
                        flag: PlayerFlagEnum.WHITE,
                  };
                  chessBoard.board[5][6] = {
                        chessRole: ChessRole.BISHOP,
                        flag: PlayerFlagEnum.BLACK,
                  };

                  chessBoard.board[6][5] = {
                        chessRole: ChessRole.BISHOP,
                        flag: PlayerFlagEnum.WHITE,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['knightAvailableMove']({ x: 7, y: 7 }, chessBoard.id);
                  expect(result.length).toBe(1);
            });
      });

      describe('rookAvailableMove', () => {
            let chessBoard: ChessBoard;
            beforeEach(() => {
                  chessBoard = new ChessBoard(true);
                  chessBoard.board[1][1] = {
                        flag: PlayerFlagEnum.WHITE,
                        chessRole: ChessRole.ROOK,
                  };
            });

            it('x = 1, y = 1', async () => {
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['rookAvailableMove']({ x: 1, y: 1 }, chessBoard.id);
                  expect(result.length).toBe(14);
            });

            it('x = 1, y = 1', async () => {
                  chessBoard.board[1][5] = {
                        flag: PlayerFlagEnum.WHITE,
                        chessRole: ChessRole.KNIGHT,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['rookAvailableMove']({ x: 1, y: 1 }, chessBoard.id);
                  expect(result.length).toBe(11);
            });

            it('x = 1, y = 1', async () => {
                  chessBoard.board[1][0] = {
                        flag: PlayerFlagEnum.WHITE,
                        chessRole: ChessRole.KNIGHT,
                  };
                  chessBoard.board[0][1] = {
                        flag: PlayerFlagEnum.WHITE,
                        chessRole: ChessRole.KNIGHT,
                  };
                  chessBoard.board[1][2] = {
                        flag: PlayerFlagEnum.WHITE,
                        chessRole: ChessRole.KNIGHT,
                  };
                  chessBoard.board[2][1] = {
                        flag: PlayerFlagEnum.WHITE,
                        chessRole: ChessRole.KNIGHT,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['rookAvailableMove']({ x: 1, y: 1 }, chessBoard.id);
                  expect(result.length).toBe(0);
            });

            it('x = 1, y = 1', async () => {
                  chessBoard.board[1][0] = {
                        flag: PlayerFlagEnum.BLACK,
                        chessRole: ChessRole.KNIGHT,
                  };
                  chessBoard.board[0][1] = {
                        flag: PlayerFlagEnum.BLACK,
                        chessRole: ChessRole.KNIGHT,
                  };
                  chessBoard.board[1][2] = {
                        flag: PlayerFlagEnum.BLACK,
                        chessRole: ChessRole.KNIGHT,
                  };
                  chessBoard.board[2][1] = {
                        flag: PlayerFlagEnum.BLACK,
                        chessRole: ChessRole.KNIGHT,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['rookAvailableMove']({ x: 1, y: 1 }, chessBoard.id);
                  expect(result.length).toBe(4);
            });
      });

      describe('bishopAvailableMove', () => {
            let chessBoard: ChessBoard;
            beforeEach(() => {
                  chessBoard = new ChessBoard(true);
            });

            it('x = 2, y = 2', async () => {
                  chessBoard.board[2][2] = {
                        flag: PlayerFlagEnum.WHITE,
                        chessRole: ChessRole.BISHOP,
                  };
                  chessBoard.board[1][3] = {
                        flag: PlayerFlagEnum.BLACK,
                        chessRole: ChessRole.PAWN,
                  };

                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['bishopAvailableMove']({ x: 2, y: 2 }, chessBoard.id);
                  expect(result.length).toBe(10);
            });

            it('x = 2, y = 2', async () => {
                  chessBoard.board[2][2] = {
                        flag: PlayerFlagEnum.WHITE,
                        chessRole: ChessRole.BISHOP,
                  };
                  chessBoard.board[3][1] = {
                        flag: PlayerFlagEnum.BLACK,
                        chessRole: ChessRole.PAWN,
                  };

                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['bishopAvailableMove']({ x: 2, y: 2 }, chessBoard.id);
                  expect(result.length).toBe(10);
            });

            it('x = 1, y = 1', async () => {
                  chessBoard.board[1][1] = {
                        flag: PlayerFlagEnum.WHITE,
                        chessRole: ChessRole.BISHOP,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['bishopAvailableMove']({ x: 1, y: 1 }, chessBoard.id);
                  expect(result.length).toBe(9);
            });

            it('x = 1, y = 1', async () => {
                  chessBoard.board[1][1] = {
                        flag: PlayerFlagEnum.WHITE,
                        chessRole: ChessRole.BISHOP,
                  };
                  chessBoard.board[0][0] = {
                        flag: PlayerFlagEnum.BLACK,
                        chessRole: ChessRole.KNIGHT,
                  };
                  chessBoard.board[2][2] = {
                        flag: PlayerFlagEnum.BLACK,
                        chessRole: ChessRole.KNIGHT,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['bishopAvailableMove']({ x: 1, y: 1 }, chessBoard.id);
                  expect(result.length).toBe(4);
            });

            it('x = 1, y = 1', async () => {
                  chessBoard.board[1][1] = {
                        flag: PlayerFlagEnum.BLACK,
                        chessRole: ChessRole.BISHOP,
                  };
                  chessBoard.board[0][0] = {
                        flag: PlayerFlagEnum.BLACK,
                        chessRole: ChessRole.KNIGHT,
                  };
                  chessBoard.board[2][2] = {
                        flag: PlayerFlagEnum.BLACK,
                        chessRole: ChessRole.KNIGHT,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['bishopAvailableMove']({ x: 1, y: 1 }, chessBoard.id);
                  expect(result.length).toBe(2);
            });

            it('x = 4, y = 4', async () => {
                  chessBoard.board[4][4] = {
                        flag: PlayerFlagEnum.WHITE,
                        chessRole: ChessRole.BISHOP,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['bishopAvailableMove']({ x: 4, y: 4 }, chessBoard.id);
                  expect(result.length).toBe(13);
            });
      });

      describe('queenAvailable', () => {
            let chessBoard: ChessBoard;
            beforeEach(() => {
                  chessBoard = new ChessBoard(true);
            });

            it('x = 1, y = 1', async () => {
                  chessBoard.board[1][1] = {
                        flag: PlayerFlagEnum.WHITE,
                        chessRole: ChessRole.QUEEN,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['queenAvailableMove']({ x: 1, y: 1 }, chessBoard.id);
                  expect(result.length).toBe(23);
            });

            it('x = 4, y = 4', async () => {
                  chessBoard.board[4][4] = {
                        flag: PlayerFlagEnum.WHITE,
                        chessRole: ChessRole.QUEEN,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['queenAvailableMove']({ x: 4, y: 4 }, chessBoard.id);
                  expect(result.length).toBe(27);
            });

            it('x = 1, y = 1', async () => {
                  chessBoard.board[1][1] = {
                        flag: PlayerFlagEnum.WHITE,
                        chessRole: ChessRole.QUEEN,
                  };
                  chessBoard.board[0][0] = {
                        flag: PlayerFlagEnum.BLACK,
                        chessRole: ChessRole.BISHOP,
                  };

                  chessBoard.board[0][1] = {
                        flag: PlayerFlagEnum.BLACK,
                        chessRole: ChessRole.BISHOP,
                  };

                  chessBoard.board[2][2] = {
                        flag: PlayerFlagEnum.BLACK,
                        chessRole: ChessRole.BISHOP,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['queenAvailableMove']({ x: 1, y: 1 }, chessBoard.id);
                  expect(result.length).toBe(18);
            });

            it('x = 1, y = 1', async () => {
                  chessBoard.board[1][1] = {
                        flag: PlayerFlagEnum.WHITE,
                        chessRole: ChessRole.QUEEN,
                  };
                  chessBoard.board[0][0] = {
                        flag: PlayerFlagEnum.BLACK,
                        chessRole: ChessRole.BISHOP,
                  };

                  chessBoard.board[2][1] = {
                        flag: PlayerFlagEnum.WHITE,
                        chessRole: ChessRole.BISHOP,
                  };

                  chessBoard.board[2][2] = {
                        flag: PlayerFlagEnum.WHITE,
                        chessRole: ChessRole.BISHOP,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['queenAvailableMove']({ x: 1, y: 1 }, chessBoard.id);
                  expect(result.length).toBe(11);
            });
      });

      describe('pawnAvailableMove', () => {
            let chessBoard: ChessBoard;
            beforeEach(() => {
                  chessBoard = new ChessBoard(true);
            });

            it('en passant white pawn', async () => {
                  chessBoard.board[1][4] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.WHITE,
                  };
                  const move = new ChessMove();
                  move.chessRole = ChessRole.PAWN;
                  move.flag = PlayerFlagEnum.BLACK;
                  move.fromX = 2;
                  move.fromY = 6;
                  move.toX = 2;
                  move.toY = 4;
                  chessBoard.moves.push(move);
                  await chessCommonService.setBoard(chessBoard);

                  const result = await chessService['pawnAvailableMove']({ x: 1, y: 4 }, chessBoard.id);
                  expect(result.length).toBe(2);
            });

            it('en passant white pawn', async () => {
                  chessBoard.board[1][4] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.WHITE,
                  };
                  const move = new ChessMove();
                  move.chessRole = ChessRole.PAWN;
                  move.flag = PlayerFlagEnum.BLACK;
                  move.fromX = 0;
                  move.fromY = 6;
                  move.toX = 0;
                  move.toY = 4;
                  chessBoard.moves.push(move);
                  await chessCommonService.setBoard(chessBoard);

                  const result = await chessService['pawnAvailableMove']({ x: 1, y: 4 }, chessBoard.id);
                  expect(result.length).toBe(2);
            });

            it('en passant black pawn', async () => {
                  chessBoard.board[3][3] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  const move = new ChessMove();
                  move.chessRole = ChessRole.PAWN;
                  move.flag = PlayerFlagEnum.WHITE;
                  move.fromX = 4;
                  move.fromY = 1;
                  move.toX = 4;
                  move.toY = 3;
                  chessBoard.moves.push(move);
                  await chessCommonService.setBoard(chessBoard);

                  const result = await chessService['pawnAvailableMove']({ x: 3, y: 3 }, chessBoard.id);
                  expect(result.length).toBe(2);
            });

            it('en passant black pawn', async () => {
                  chessBoard.board[3][3] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  const move = new ChessMove();
                  move.chessRole = ChessRole.PAWN;
                  move.flag = PlayerFlagEnum.WHITE;
                  move.fromX = 2;
                  move.fromY = 1;
                  move.toX = 2;
                  move.toY = 3;
                  chessBoard.moves.push(move);
                  await chessCommonService.setBoard(chessBoard);

                  const result = await chessService['pawnAvailableMove']({ x: 3, y: 3 }, chessBoard.id);
                  expect(result.length).toBe(2);
            });

            it('white pawn: x = 0, y = 0', async () => {
                  chessBoard.board[0][0] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.WHITE,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['pawnAvailableMove']({ x: 0, y: 0 }, chessBoard.id);
                  expect(result.length).toBe(0);
            });

            it('white pawn: x = 0, y = 1', async () => {
                  chessBoard.board[0][1] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.WHITE,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['pawnAvailableMove']({ x: 0, y: 1 }, chessBoard.id);
                  expect(result.length).toBe(2);
            });

            it('white pawn: x = 0, y = 1, have a piece on a3', async () => {
                  chessBoard.board[0][1] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.WHITE,
                  };
                  chessBoard.board[0][2] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.WHITE,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['pawnAvailableMove']({ x: 0, y: 1 }, chessBoard.id);
                  expect(result.length).toBe(0);
            });

            it('white pawn: x = 0, y = 1, can eat piece on b3', async () => {
                  chessBoard.board[0][1] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.WHITE,
                  };
                  chessBoard.board[1][2] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['pawnAvailableMove']({ x: 0, y: 1 }, chessBoard.id);
                  expect(result.length).toBe(3);
            });

            it('white pawn: x = 1, y = 1, can eat piece on a3, c3', async () => {
                  chessBoard.board[1][1] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.WHITE,
                  };
                  chessBoard.board[2][2] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  chessBoard.board[0][2] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['pawnAvailableMove']({ x: 1, y: 1 }, chessBoard.id);
                  expect(result.length).toBe(4);
            });

            it('white pawn: x = 1, y = 2, can eat piece on a3, c3', async () => {
                  chessBoard.board[1][2] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.WHITE,
                  };
                  chessBoard.board[2][3] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  chessBoard.board[0][3] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['pawnAvailableMove']({ x: 1, y: 2 }, chessBoard.id);
                  expect(result.length).toBe(3);
            });

            it('black pawn: x = 0, y = 7', async () => {
                  chessBoard.board[0][7] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['pawnAvailableMove']({ x: 0, y: 7 }, chessBoard.id);
                  expect(result.length).toBe(0);
            });

            it('black pawn: x = 0, y = 6', async () => {
                  chessBoard.board[0][6] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['pawnAvailableMove']({ x: 0, y: 6 }, chessBoard.id);
                  expect(result.length).toBe(2);
            });

            it('black pawn: x = 0, y = 6, have a pawn on a6', async () => {
                  chessBoard.board[0][6] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  chessBoard.board[0][5] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['pawnAvailableMove']({ x: 0, y: 6 }, chessBoard.id);
                  expect(result.length).toBe(0);
            });

            it('black pawn: x = 0, y = 6, eat a piece on b6', async () => {
                  chessBoard.board[0][6] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  chessBoard.board[1][5] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.WHITE,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['pawnAvailableMove']({ x: 0, y: 6 }, chessBoard.id);
                  expect(result.length).toBe(3);
            });

            it('black pawn: x = 1, y = 6, eat a piece on a6, c6', async () => {
                  chessBoard.board[1][6] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  chessBoard.board[0][5] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.WHITE,
                  };
                  chessBoard.board[2][5] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.WHITE,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['pawnAvailableMove']({ x: 1, y: 6 }, chessBoard.id);
                  expect(result.length).toBe(4);
            });

            it('black pawn: x = 1, y = 5, eat a piece on a6, c6', async () => {
                  chessBoard.board[1][5] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  chessBoard.board[0][4] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.WHITE,
                  };
                  chessBoard.board[2][4] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.WHITE,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['pawnAvailableMove']({ x: 1, y: 5 }, chessBoard.id);
                  expect(result.length).toBe(3);
            });

            describe('en passant move', () => {
                  it('black pawn: ', async () => {
                        chessBoard.board[1][3] = {
                              chessRole: ChessRole.PAWN,
                              flag: PlayerFlagEnum.BLACK,
                        };
                        chessBoard.board[2][3] = {
                              chessRole: ChessRole.PAWN,
                              flag: PlayerFlagEnum.WHITE,
                        };
                        await chessCommonService.setBoard(chessBoard);
                        const result = await chessService['pawnAvailableMove']({ x: 1, y: 3 }, chessBoard.id);
                        expect(result.length).toBe(1);
                  });
            });
      });

      describe('chessRoleLegalMove', () => {
            let chessBoard: ChessBoard;
            beforeEach(async () => {
                  chessBoard = new ChessBoard(true);
                  chessBoard.board[4][1] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.WHITE,
                  };
                  await chessCommonService.setBoard(chessBoard);
            });

            it('king is not going to die', async () => {
                  chessBoard.board[0][2] = {
                        chessRole: ChessRole.ROOK,
                        flag: PlayerFlagEnum.BLACK,
                  };

                  await chessCommonService.setBoard(chessBoard);
                  const legalMove = await chessService.legalMove({ x: 4, y: 1 }, chessBoard.id);
                  expect(legalMove.length).toBe(5);
            });

            it('pawn', async () => {
                  const legalMove = await chessService['chessRoleLegalMove']({ x: 0, y: 2 }, chessBoard.id);
                  expect(legalMove.length).toBeDefined();
            });

            it('king', async () => {
                  const legalMove = await chessService['chessRoleLegalMove']({ x: 4, y: 1 }, chessBoard.id);
                  expect(legalMove.length).toBeDefined();
            });

            it('queen', async () => {
                  const legalMove = await chessService['chessRoleLegalMove']({ x: 0, y: 2 }, chessBoard.id);
                  expect(legalMove.length).toBeDefined();
            });

            it('knight', async () => {
                  const legalMove = await chessService['chessRoleLegalMove']({ x: 0, y: 2 }, chessBoard.id);
                  expect(legalMove.length).toBeDefined();
            });

            it('bishop', async () => {
                  const legalMove = await chessService['chessRoleLegalMove']({ x: 0, y: 2 }, chessBoard.id);
                  expect(legalMove.length).toBeDefined();
            });

            it('rook', async () => {
                  const legalMove = await chessService['chessRoleLegalMove']({ x: 0, y: 2 }, chessBoard.id);
                  expect(legalMove.length).toBeDefined();
            });
      });

      describe('kingIsMoved', () => {
            let chessBoard: ChessBoard;
            beforeEach(async () => {
                  chessBoard = new ChessBoard(true);
                  await chessCommonService.setBoard(chessBoard);
            });

            it('King is not move', async () => {
                  const result = await chessService['kingIsMoved'](PlayerFlagEnum.BLACK, chessBoard.id);
                  expect(result).toBeFalsy();
            });

            it('King is moved', async () => {
                  const move = new ChessMove();
                  move.chessRole = ChessRole.KING;
                  move.flag = PlayerFlagEnum.BLACK;
                  move.fromX = 0;
                  move.fromY = 0;
                  move.toX = 0;
                  move.toY = 1;
                  chessBoard.moves.push(move);
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['kingIsMoved'](PlayerFlagEnum.BLACK, chessBoard.id);
                  expect(result).toBeTruthy();
            });
      });

      describe('rookKingSiteIsMoved', () => {
            let chessBoard: ChessBoard;
            beforeEach(async () => {
                  chessBoard = new ChessBoard(true);
                  await chessCommonService.setBoard(chessBoard);
            });

            it('Rook black is not moved', async () => {
                  const result = await chessService['rookKingSiteIsMoved'](PlayerFlagEnum.BLACK, chessBoard.id);
                  expect(result).toBeFalsy();
            });

            it('Rook black is moved', async () => {
                  const move = new ChessMove();
                  move.chessRole = ChessRole.ROOK;
                  move.flag = PlayerFlagEnum.BLACK;
                  move.fromX = 7;
                  move.fromY = 7;
                  move.toX = 6;
                  move.toY = 7;
                  chessBoard.moves.push(move);
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['rookKingSiteIsMoved'](PlayerFlagEnum.BLACK, chessBoard.id);
                  expect(result).toBeTruthy();
            });

            it('Rook white is not moved', async () => {
                  const result = await chessService['rookKingSiteIsMoved'](PlayerFlagEnum.WHITE, chessBoard.id);
                  expect(result).toBeFalsy();
            });

            it('Rook white is moved', async () => {
                  const move = new ChessMove();
                  move.chessRole = ChessRole.ROOK;
                  move.flag = PlayerFlagEnum.WHITE;
                  move.fromX = 7;
                  move.fromY = 0;
                  move.toX = 6;
                  move.toY = 0;
                  chessBoard.moves.push(move);
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['rookKingSiteIsMoved'](PlayerFlagEnum.WHITE, chessBoard.id);
                  expect(result).toBeTruthy();
            });
      });

      describe('rookQueenSiteIsMoved', () => {
            let chessBoard: ChessBoard;
            beforeEach(async () => {
                  chessBoard = new ChessBoard(true);
                  await chessCommonService.setBoard(chessBoard);
            });

            it('Rook black is not moved', async () => {
                  const result = await chessService['rookQueenSiteIsMoved'](PlayerFlagEnum.BLACK, chessBoard.id);
                  expect(result).toBeFalsy();
            });

            it('Rook black is moved', async () => {
                  const move = new ChessMove();
                  move.chessRole = ChessRole.ROOK;
                  move.flag = PlayerFlagEnum.BLACK;
                  move.fromX = 0;
                  move.fromY = 7;
                  move.toX = 1;
                  move.toY = 7;
                  chessBoard.moves.push(move);
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['rookQueenSiteIsMoved'](PlayerFlagEnum.BLACK, chessBoard.id);
                  expect(result).toBeTruthy();
            });

            it('Rook white is not moved', async () => {
                  const result = await chessService['rookQueenSiteIsMoved'](PlayerFlagEnum.WHITE, chessBoard.id);
                  expect(result).toBeFalsy();
            });

            it('Rook white is moved', async () => {
                  const move = new ChessMove();
                  move.chessRole = ChessRole.ROOK;
                  move.flag = PlayerFlagEnum.BLACK;
                  move.fromX = 0;
                  move.fromY = 0;
                  move.toX = 1;
                  move.toY = 0;
                  chessBoard.moves.push(move);
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['rookQueenSiteIsMoved'](PlayerFlagEnum.WHITE, chessBoard.id);
                  expect(result).toBeTruthy();
            });
      });

      describe('kingIsChecked', () => {
            let chessBoard: ChessBoard;
            beforeEach(async () => {
                  chessBoard = new ChessBoard(true);
                  await chessCommonService.setBoard(chessBoard);
            });

            it('Check by Queen --- Top', async () => {
                  chessBoard.board[2][2] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.WHITE,
                  };

                  chessBoard.board[2][4] = {
                        chessRole: ChessRole.QUEEN,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService.kingIsChecked(
                        { x: 2, y: 2, chessRole: ChessRole.KING, flag: PlayerFlagEnum.WHITE },
                        chessBoard.id,
                  );
                  expect(result).toBeTruthy();
            });

            it('Check by Rook --- Top', async () => {
                  chessBoard.board[2][2] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.WHITE,
                  };

                  chessBoard.board[2][4] = {
                        chessRole: ChessRole.ROOK,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService.kingIsChecked(
                        { x: 2, y: 2, chessRole: ChessRole.KING, flag: PlayerFlagEnum.WHITE },
                        chessBoard.id,
                  );
                  expect(result).toBeTruthy();
            });

            it('Check by Rook --- Bottom', async () => {
                  chessBoard.board[2][2] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.WHITE,
                  };

                  chessBoard.board[2][0] = {
                        chessRole: ChessRole.ROOK,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService.kingIsChecked(
                        { x: 2, y: 2, chessRole: ChessRole.KING, flag: PlayerFlagEnum.WHITE },
                        chessBoard.id,
                  );
                  expect(result).toBeTruthy();
            });

            it('Check by Queen --- Bottom', async () => {
                  chessBoard.board[2][2] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.WHITE,
                  };

                  chessBoard.board[2][0] = {
                        chessRole: ChessRole.QUEEN,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService.kingIsChecked(
                        { x: 2, y: 2, chessRole: ChessRole.KING, flag: PlayerFlagEnum.WHITE },
                        chessBoard.id,
                  );
                  expect(result).toBeTruthy();
            });

            it('Check by Queen --- Left', async () => {
                  chessBoard.board[2][2] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.WHITE,
                  };

                  chessBoard.board[0][2] = {
                        chessRole: ChessRole.QUEEN,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService.kingIsChecked(
                        { x: 2, y: 2, chessRole: ChessRole.KING, flag: PlayerFlagEnum.WHITE },
                        chessBoard.id,
                  );
                  expect(result).toBeTruthy();
            });

            it('Check by Rook --- Left', async () => {
                  chessBoard.board[2][2] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.WHITE,
                  };

                  chessBoard.board[0][2] = {
                        chessRole: ChessRole.ROOK,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService.kingIsChecked(
                        { x: 2, y: 2, chessRole: ChessRole.KING, flag: PlayerFlagEnum.WHITE },
                        chessBoard.id,
                  );
                  expect(result).toBeTruthy();
            });

            it('Check by Rook --- Right', async () => {
                  chessBoard.board[2][2] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.WHITE,
                  };

                  chessBoard.board[6][2] = {
                        chessRole: ChessRole.ROOK,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService.kingIsChecked(
                        { x: 2, y: 2, chessRole: ChessRole.KING, flag: PlayerFlagEnum.WHITE },
                        chessBoard.id,
                  );
                  expect(result).toBeTruthy();
            });

            it('Check by Queen --- Right', async () => {
                  chessBoard.board[2][2] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.WHITE,
                  };

                  chessBoard.board[6][2] = {
                        chessRole: ChessRole.QUEEN,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService.kingIsChecked(
                        { x: 2, y: 2, chessRole: ChessRole.KING, flag: PlayerFlagEnum.WHITE },
                        chessBoard.id,
                  );
                  expect(result).toBeTruthy();
            });

            it('Check by Queen --- Top - Left', async () => {
                  chessBoard.board[2][2] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.WHITE,
                  };

                  chessBoard.board[0][4] = {
                        chessRole: ChessRole.QUEEN,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService.kingIsChecked(
                        { x: 2, y: 2, chessRole: ChessRole.KING, flag: PlayerFlagEnum.WHITE },
                        chessBoard.id,
                  );
                  expect(result).toBeTruthy();
            });

            it('Check by Bishop --- Top - Left', async () => {
                  chessBoard.board[2][2] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.WHITE,
                  };

                  chessBoard.board[0][4] = {
                        chessRole: ChessRole.BISHOP,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService.kingIsChecked(
                        { x: 2, y: 2, chessRole: ChessRole.KING, flag: PlayerFlagEnum.WHITE },
                        chessBoard.id,
                  );
                  expect(result).toBeTruthy();
            });

            it('Check by Queen --- Top - Right', async () => {
                  chessBoard.board[2][2] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.WHITE,
                  };

                  chessBoard.board[4][4] = {
                        chessRole: ChessRole.QUEEN,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService.kingIsChecked(
                        { x: 2, y: 2, chessRole: ChessRole.KING, flag: PlayerFlagEnum.WHITE },
                        chessBoard.id,
                  );
                  expect(result).toBeTruthy();
            });

            it('Check by Bishop --- Top - Right', async () => {
                  chessBoard.board[2][2] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.WHITE,
                  };

                  chessBoard.board[4][4] = {
                        chessRole: ChessRole.BISHOP,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService.kingIsChecked(
                        { x: 2, y: 2, chessRole: ChessRole.KING, flag: PlayerFlagEnum.WHITE },
                        chessBoard.id,
                  );
                  expect(result).toBeTruthy();
            });

            it('Check by Queen --- Bottom - Left', async () => {
                  chessBoard.board[2][2] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.WHITE,
                  };

                  chessBoard.board[0][0] = {
                        chessRole: ChessRole.QUEEN,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService.kingIsChecked(
                        { x: 2, y: 2, chessRole: ChessRole.KING, flag: PlayerFlagEnum.WHITE },
                        chessBoard.id,
                  );
                  expect(result).toBeTruthy();
            });

            it('Check by Bishop --- Bottom - Left', async () => {
                  chessBoard.board[2][2] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.WHITE,
                  };

                  chessBoard.board[0][0] = {
                        chessRole: ChessRole.BISHOP,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService.kingIsChecked(
                        { x: 2, y: 2, chessRole: ChessRole.KING, flag: PlayerFlagEnum.WHITE },
                        chessBoard.id,
                  );
                  expect(result).toBeTruthy();
            });

            it('Check by Queen --- Bottom - Right', async () => {
                  chessBoard.board[2][2] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.WHITE,
                  };

                  chessBoard.board[4][0] = {
                        chessRole: ChessRole.QUEEN,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService.kingIsChecked(
                        { x: 2, y: 2, chessRole: ChessRole.KING, flag: PlayerFlagEnum.WHITE },
                        chessBoard.id,
                  );
                  expect(result).toBeTruthy();
            });

            it('Check by Bishop --- Bottom - Right', async () => {
                  chessBoard.board[2][2] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.WHITE,
                  };

                  chessBoard.board[4][0] = {
                        chessRole: ChessRole.BISHOP,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService.kingIsChecked(
                        { x: 2, y: 2, chessRole: ChessRole.KING, flag: PlayerFlagEnum.WHITE },
                        chessBoard.id,
                  );
                  expect(result).toBeTruthy();
            });

            it('Check by Knight', async () => {
                  chessBoard.board[2][2] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.WHITE,
                  };

                  chessBoard.board[1][0] = {
                        chessRole: ChessRole.KNIGHT,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService.kingIsChecked(
                        { x: 2, y: 2, chessRole: ChessRole.KING, flag: PlayerFlagEnum.WHITE },
                        chessBoard.id,
                  );
                  expect(result).toBeTruthy();
            });

            it('Check by Pawn', async () => {
                  chessBoard.board[2][2] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.WHITE,
                  };

                  chessBoard.board[3][3] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService.kingIsChecked(
                        { x: 2, y: 2, chessRole: ChessRole.KING, flag: PlayerFlagEnum.WHITE },
                        chessBoard.id,
                  );
                  expect(result).toBeTruthy();
            });

            it('Check by Pawn', async () => {
                  chessBoard.board[2][2] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.BLACK,
                  };

                  chessBoard.board[1][1] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.WHITE,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService.kingIsChecked(
                        { x: 2, y: 2, chessRole: ChessRole.KING, flag: PlayerFlagEnum.BLACK },
                        chessBoard.id,
                  );
                  expect(result).toBeTruthy();
            });

            it('Check by King', async () => {
                  chessBoard.board[2][2] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.BLACK,
                  };

                  chessBoard.board[2][1] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.WHITE,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService.kingIsChecked(
                        { x: 2, y: 2, chessRole: ChessRole.KING, flag: PlayerFlagEnum.BLACK },
                        chessBoard.id,
                  );
                  expect(result).toBeTruthy();
            });
      });

      describe('isCastleKingSite', () => {
            let chessBoard: ChessBoard;
            beforeEach(async () => {
                  chessBoard = new ChessBoard(true);
                  await chessCommonService.setBoard(chessBoard);
            });

            it('Pass', async () => {
                  chessBoard.board[4][0] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.WHITE,
                  };

                  chessBoard.board[7][0] = {
                        chessRole: ChessRole.ROOK,
                        flag: PlayerFlagEnum.WHITE,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['isCastleKingSite']({ x: 4, y: 0 }, { x: 6, y: 0 }, chessBoard.id);
                  expect(result).toBeTruthy();
            });

            it('Pass', async () => {
                  chessBoard.board[4][7] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.BLACK,
                  };

                  chessBoard.board[7][7] = {
                        chessRole: ChessRole.ROOK,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['isCastleKingSite']({ x: 4, y: 7 }, { x: 6, y: 7 }, chessBoard.id);
                  expect(result).toBeTruthy();
            });
      });

      describe('isCastleQueenSite', () => {
            let chessBoard: ChessBoard;
            beforeEach(async () => {
                  chessBoard = new ChessBoard(true);
                  await chessCommonService.setBoard(chessBoard);
            });

            it('Pass', async () => {
                  chessBoard.board[4][0] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.WHITE,
                  };

                  chessBoard.board[0][0] = {
                        chessRole: ChessRole.ROOK,
                        flag: PlayerFlagEnum.WHITE,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['isCaslteQueenSite']({ x: 4, y: 0 }, { x: 2, y: 0 }, chessBoard.id);
                  expect(result).toBeTruthy();
            });

            it('Pass', async () => {
                  chessBoard.board[4][7] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.BLACK,
                  };

                  chessBoard.board[0][7] = {
                        chessRole: ChessRole.ROOK,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['isCaslteQueenSite']({ x: 4, y: 7 }, { x: 2, y: 7 }, chessBoard.id);
                  expect(result).toBeTruthy();
            });
      });

      describe('isPromotePawn', () => {
            let chessBoard: ChessBoard;
            beforeEach(async () => {
                  chessBoard = new ChessBoard(true);
                  await chessCommonService.setBoard(chessBoard);
            });

            it('Not a pawn', async () => {
                  chessBoard.board[0][0] = {
                        chessRole: ChessRole.ROOK,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['isPromotePawn']({ x: 0, y: 0 }, chessBoard.id);
                  expect(result).toBeFalsy();
            });

            it('Promote black pawn', async () => {
                  chessBoard.board[0][0] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['isPromotePawn']({ x: 0, y: 0 }, chessBoard.id);
                  expect(result).toBeTruthy();
            });

            it('Promote white pawn', async () => {
                  chessBoard.board[7][7] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.WHITE,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService['isPromotePawn']({ x: 7, y: 7 }, chessBoard.id);
                  expect(result).toBeTruthy();
            });

            describe('isEnPassnat', () => {
                  let chessBoard: ChessBoard;
                  beforeEach(async () => {
                        chessBoard = new ChessBoard(true);
                        await chessCommonService.setBoard(chessBoard);
                  });

                  it('White pawn eat black pawn', async () => {
                        chessBoard.board[4][4] = {
                              chessRole: ChessRole.PAWN,
                              flag: PlayerFlagEnum.WHITE,
                        };
                        chessBoard.board[5][4] = {
                              chessRole: ChessRole.PAWN,
                              flag: PlayerFlagEnum.BLACK,
                        };
                        await chessCommonService.setBoard(chessBoard);
                        const result = await chessService['isEnPassant']({ x: 4, y: 4 }, { x: 5, y: 5 }, chessBoard.id);
                        expect(result).toBeTruthy();
                  });

                  it('White pawn eat black pawn', async () => {
                        chessBoard.board[4][4] = {
                              chessRole: ChessRole.PAWN,
                              flag: PlayerFlagEnum.WHITE,
                        };
                        chessBoard.board[3][4] = {
                              chessRole: ChessRole.PAWN,
                              flag: PlayerFlagEnum.BLACK,
                        };
                        await chessCommonService.setBoard(chessBoard);
                        const result = await chessService['isEnPassant']({ x: 4, y: 4 }, { x: 3, y: 5 }, chessBoard.id);
                        expect(result).toBeTruthy();
                  });

                  it('Black pawn eat white pawn', async () => {
                        chessBoard.board[4][3] = {
                              chessRole: ChessRole.PAWN,
                              flag: PlayerFlagEnum.WHITE,
                        };
                        chessBoard.board[3][3] = {
                              chessRole: ChessRole.PAWN,
                              flag: PlayerFlagEnum.BLACK,
                        };
                        await chessCommonService.setBoard(chessBoard);
                        const result = await chessService['isEnPassant']({ x: 3, y: 3 }, { x: 4, y: 2 }, chessBoard.id);
                        expect(result).toBeTruthy();
                  });

                  it('Black pawn eat white pawn', async () => {
                        chessBoard.board[2][3] = {
                              chessRole: ChessRole.PAWN,
                              flag: PlayerFlagEnum.WHITE,
                        };
                        chessBoard.board[3][3] = {
                              chessRole: ChessRole.PAWN,
                              flag: PlayerFlagEnum.BLACK,
                        };
                        await chessCommonService.setBoard(chessBoard);
                        const result = await chessService['isEnPassant']({ x: 3, y: 3 }, { x: 2, y: 2 }, chessBoard.id);
                        expect(result).toBeTruthy();
                  });
            });
      });

      describe('canMove', () => {
            let chessBoard: ChessBoard;
            beforeEach(async () => {
                  chessBoard = new ChessBoard(true);
                  await chessCommonService.setBoard(chessBoard);
            });

            it('En passant white move', async () => {
                  chessBoard.board[4][4] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.WHITE,
                  };
                  chessBoard.board[5][4] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  await chessCommonService.setBoard(chessBoard);

                  const result = await chessService.canMove({ x: 4, y: 4 }, { x: 5, y: 5 }, chessBoard.id);
                  expect(result).toBeTruthy();
            });

            it('En passant black move', async () => {
                  chessBoard.board[2][3] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.WHITE,
                  };
                  chessBoard.board[3][3] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  await chessCommonService.setBoard(chessBoard);

                  const result = await chessService.canMove({ x: 3, y: 3 }, { x: 2, y: 2 }, chessBoard.id);
                  expect(result).toBeTruthy();
            });

            it('Normal move', async () => {
                  chessBoard.board[3][3] = {
                        chessRole: ChessRole.ROOK,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService.canMove({ x: 3, y: 3 }, { x: 3, y: 2 }, chessBoard.id);
                  expect(result).toBeTruthy();
            });
      });

      describe('checkmate', () => {
            let chessBoardId: string;
            let chessBoard: ChessBoard;
            let user1: User, user2: User;
            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  user2 = await generateFakeUser();
                  chessBoardId = await chessCommonService.createNewGame(user1);
                  await chessCommonService.joinGame(chessBoardId, user2);
                  chessBoard = await chessCommonService.getBoard(chessBoardId);
                  //delete board for testing
                  for (let i = 0; i < chessBoard.board.length; i++) {
                        for (let j = 0; j < chessBoard.board.length; j++) {
                              chessBoard.board[i][j] = {
                                    flag: PlayerFlagEnum.EMPTY,
                                    chessRole: ChessRole.EMPTY,
                              };
                        }
                  }
                  await chessCommonService.setBoard(chessBoard);
            });

            it('Pass', async () => {
                  chessBoard.board[0][0] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  chessBoard.board[7][0] = {
                        chessRole: ChessRole.QUEEN,
                        flag: PlayerFlagEnum.WHITE,
                  };
                  chessBoard.board[7][1] = {
                        chessRole: ChessRole.QUEEN,
                        flag: PlayerFlagEnum.WHITE,
                  };

                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService.checkmate(PlayerFlagEnum.BLACK, chessBoard.id);
                  chessBoard = await chessCommonService.getBoard(chessBoard.id);

                  expect(chessBoard.status).toBe(ChessStatus.END);
                  expect(chessBoard.eloWhiteUser).toBeDefined();
                  expect(chessBoard.eloBlackUser).toBeDefined();
                  expect(chessBoard.winner).toBe(PlayerFlagEnum.WHITE);
                  expect(result).toBeTruthy();
            });
      });

      describe('stalemate', () => {
            let chessBoardId: string;
            let chessBoard: ChessBoard;
            let user1: User, user2: User;
            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  user2 = await generateFakeUser();
                  chessBoardId = await chessCommonService.createNewGame(user1);
                  await chessCommonService.joinGame(chessBoardId, user2);
                  chessBoard = await chessCommonService.getBoard(chessBoardId);
                  //delete board for testing
                  for (let i = 0; i < chessBoard.board.length; i++) {
                        for (let j = 0; j < chessBoard.board.length; j++) {
                              chessBoard.board[i][j] = {
                                    flag: PlayerFlagEnum.EMPTY,
                                    chessRole: ChessRole.EMPTY,
                              };
                        }
                  }
                  await chessCommonService.setBoard(chessBoard);
            });

            it('Pass', async () => {
                  chessBoard.board[0][0] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  chessBoard.board[1][7] = {
                        chessRole: ChessRole.ROOK,
                        flag: PlayerFlagEnum.WHITE,
                  };
                  chessBoard.board[7][1] = {
                        chessRole: ChessRole.ROOK,
                        flag: PlayerFlagEnum.WHITE,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService.stalemate(PlayerFlagEnum.BLACK, chessBoard.id);
                  chessBoard = await chessCommonService.getBoard(chessBoard.id);

                  expect(chessBoard.status).toBe(ChessStatus.END);
                  expect(chessBoard.eloWhiteUser).toBeDefined();
                  expect(chessBoard.eloBlackUser).toBeDefined();
                  expect(chessBoard.winner).toBe(PlayerFlagEnum.EMPTY);
                  expect(result).toBeTruthy();
            });
      });

      describe('isWin', () => {
            let chessBoardId: string;
            let chessBoard: ChessBoard;
            let user1: User, user2: User;
            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  user2 = await generateFakeUser();
                  chessBoardId = await chessCommonService.createNewGame(user1);
                  await chessCommonService.joinGame(chessBoardId, user2);
                  chessBoard = await chessCommonService.getBoard(chessBoardId);
                  //delete board for testing
                  for (let i = 0; i < chessBoard.board.length; i++) {
                        for (let j = 0; j < chessBoard.board.length; j++) {
                              chessBoard.board[i][j] = {
                                    flag: PlayerFlagEnum.EMPTY,
                                    chessRole: ChessRole.EMPTY,
                              };
                        }
                  }
                  await chessCommonService.setBoard(chessBoard);
            });

            it('Pass checkmate', async () => {
                  chessBoard.board[0][0] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  chessBoard.board[7][0] = {
                        chessRole: ChessRole.QUEEN,
                        flag: PlayerFlagEnum.WHITE,
                  };
                  chessBoard.board[7][1] = {
                        chessRole: ChessRole.QUEEN,
                        flag: PlayerFlagEnum.WHITE,
                  };

                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService.isWin(PlayerFlagEnum.BLACK, chessBoard.id);
                  expect(result).toBeTruthy();
            });

            it('Pass stalemate', async () => {
                  chessBoard.board[0][0] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  chessBoard.board[1][7] = {
                        chessRole: ChessRole.ROOK,
                        flag: PlayerFlagEnum.WHITE,
                  };
                  chessBoard.board[7][1] = {
                        chessRole: ChessRole.ROOK,
                        flag: PlayerFlagEnum.WHITE,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService.isWin(PlayerFlagEnum.BLACK, chessBoard.id);
                  expect(result).toBeTruthy();
            });
      });

      describe('playAMove', () => {
            let chessBoardId: string;
            let chessBoard: ChessBoard;
            let user1: User, user2: User;
            let player1: ChessPlayer, player2: ChessPlayer;
            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  user2 = await generateFakeUser();
                  chessBoardId = await chessCommonService.createNewGame(user1);
                  await chessCommonService.joinGame(chessBoardId, user2);
                  chessBoard = await chessCommonService.getBoard(chessBoardId);
                  //delete board for testing
                  for (let i = 0; i < chessBoard.board.length; i++) {
                        for (let j = 0; j < chessBoard.board.length; j++) {
                              chessBoard.board[i][j] = {
                                    flag: PlayerFlagEnum.EMPTY,
                                    chessRole: ChessRole.EMPTY,
                              };
                        }
                  }

                  player1 = chessBoard.users[0];
                  player2 = chessBoard.users[1];
                  await chessCommonService.setBoard(chessBoard);
            });

            it('Failed wrong boardId', async () => {
                  const result = await chessService.playAMove(player1, { x: 0, y: 0 }, { x: 7, y: 0 }, 'hai-dep-trai');
                  expect(result).toBeFalsy();
            });

            it('Normal move white', async () => {
                  chessBoard.board[1][7] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.WHITE,
                  };

                  chessBoard.board[3][7] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  chessBoard.board[0][0] = {
                        chessRole: ChessRole.ROOK,
                        flag: PlayerFlagEnum.WHITE,
                  };
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService.playAMove(player1, { x: 0, y: 0 }, { x: 7, y: 0 }, chessBoard.id);
                  chessBoard = await chessCommonService.getBoard(chessBoard.id);

                  expect(result).toBe(true);
                  expect(chessBoard.board[7][0].chessRole).toBe(ChessRole.ROOK);
                  expect(chessBoard.board[7][0].flag).toBe(PlayerFlagEnum.WHITE);
            });

            it('Wrong turn black', async () => {
                  const resutl = await chessService.playAMove(player2, { x: 0, y: 0 }, { x: 1, y: 1 }, chessBoard.id);
                  expect(resutl).toBeFalsy();
            });

            it('Wrong turn white', async () => {
                  chessBoard.turn = true;
                  await chessCommonService.setBoard(chessBoard);
                  const resutl = await chessService.playAMove(player1, { x: 0, y: 0 }, { x: 1, y: 1 }, chessBoard.id);
                  expect(resutl).toBeFalsy();
            });

            it('Normal move black', async () => {
                  chessBoard.board[1][7] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.WHITE,
                  };

                  chessBoard.board[3][7] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  chessBoard.board[0][0] = {
                        chessRole: ChessRole.ROOK,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  chessBoard.turn = true;
                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService.playAMove(player2, { x: 0, y: 0 }, { x: 7, y: 0 }, chessBoard.id);
                  chessBoard = await chessCommonService.getBoard(chessBoard.id);

                  expect(result).toBe(true);
                  expect(chessBoard.board[7][0].chessRole).toBe(ChessRole.ROOK);
                  expect(chessBoard.board[7][0].flag).toBe(PlayerFlagEnum.BLACK);
            });

            it('En passant move', async () => {
                  chessBoard.board[1][7] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.WHITE,
                  };

                  chessBoard.board[3][7] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.BLACK,
                  };

                  chessBoard.board[5][4] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.WHITE,
                  };

                  chessBoard.board[6][4] = {
                        chessRole: ChessRole.PAWN,
                        flag: PlayerFlagEnum.BLACK,
                  };
                  const move = new ChessMove();
                  move.chessRole = ChessRole.PAWN;
                  move.flag = PlayerFlagEnum.BLACK;
                  move.fromX = 6;
                  move.fromY = 6;
                  move.toX = 6;
                  move.toY = 4;
                  chessBoard.moves.push(move);

                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService.playAMove(player1, { x: 5, y: 4 }, { x: 6, y: 5 }, chessBoard.id);
                  chessBoard = await chessCommonService.getBoard(chessBoard.id);

                  expect(result).toBeTruthy();
                  expect(chessBoard.board[6][4].chessRole).toBe(ChessRole.EMPTY);
                  expect(chessBoard.board[6][4].flag).toBe(PlayerFlagEnum.EMPTY);
                  expect(chessBoard.board[6][5].chessRole).toBe(ChessRole.PAWN);
                  expect(chessBoard.board[6][5].flag).toBe(PlayerFlagEnum.WHITE);
            });

            it('Caslte king site white', async () => {
                  chessBoard.board[4][0] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.WHITE,
                  };

                  chessBoard.board[7][0] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.WHITE,
                  };

                  chessBoard.board[3][7] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.BLACK,
                  };

                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService.playAMove(player1, { x: 4, y: 0 }, { x: 6, y: 0 }, chessBoard.id);
                  chessBoard = await chessCommonService.getBoard(chessBoard.id);

                  expect(result).toBeTruthy();
                  expect(chessBoard.board[6][0].chessRole).toBe(ChessRole.KING);
                  expect(chessBoard.board[6][0].flag).toBe(PlayerFlagEnum.WHITE);

                  expect(chessBoard.board[5][0].chessRole).toBe(ChessRole.ROOK);
                  expect(chessBoard.board[5][0].flag).toBe(PlayerFlagEnum.WHITE);

                  expect(chessBoard.board[7][0].chessRole).toBe(ChessRole.EMPTY);
                  expect(chessBoard.board[7][0].flag).toBe(PlayerFlagEnum.EMPTY);
            });

            it('Caslte king site black', async () => {
                  chessBoard.board[4][7] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.BLACK,
                  };

                  chessBoard.board[7][7] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.BLACK,
                  };

                  chessBoard.board[3][4] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.WHITE,
                  };

                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService.playAMove(player1, { x: 4, y: 7 }, { x: 6, y: 7 }, chessBoard.id);
                  chessBoard = await chessCommonService.getBoard(chessBoard.id);

                  expect(result).toBeTruthy();
                  expect(chessBoard.board[6][7].chessRole).toBe(ChessRole.KING);
                  expect(chessBoard.board[6][7].flag).toBe(PlayerFlagEnum.BLACK);

                  expect(chessBoard.board[5][7].chessRole).toBe(ChessRole.ROOK);
                  expect(chessBoard.board[5][7].flag).toBe(PlayerFlagEnum.BLACK);

                  expect(chessBoard.board[7][7].chessRole).toBe(ChessRole.EMPTY);
                  expect(chessBoard.board[7][7].flag).toBe(PlayerFlagEnum.EMPTY);
            });

            it('Caslte queen site white', async () => {
                  chessBoard.board[4][0] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.WHITE,
                  };

                  chessBoard.board[0][0] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.WHITE,
                  };

                  chessBoard.board[3][7] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.BLACK,
                  };

                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService.playAMove(player1, { x: 4, y: 0 }, { x: 2, y: 0 }, chessBoard.id);
                  chessBoard = await chessCommonService.getBoard(chessBoard.id);

                  expect(result).toBeTruthy();
                  expect(chessBoard.board[2][0].chessRole).toBe(ChessRole.KING);
                  expect(chessBoard.board[2][0].flag).toBe(PlayerFlagEnum.WHITE);

                  expect(chessBoard.board[3][0].chessRole).toBe(ChessRole.ROOK);
                  expect(chessBoard.board[3][0].flag).toBe(PlayerFlagEnum.WHITE);

                  expect(chessBoard.board[0][0].chessRole).toBe(ChessRole.EMPTY);
                  expect(chessBoard.board[0][0].flag).toBe(PlayerFlagEnum.EMPTY);
            });

            it('Caslte queen site black', async () => {
                  chessBoard.board[4][7] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.BLACK,
                  };

                  chessBoard.board[0][7] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.BLACK,
                  };

                  chessBoard.board[3][4] = {
                        chessRole: ChessRole.KING,
                        flag: PlayerFlagEnum.WHITE,
                  };

                  await chessCommonService.setBoard(chessBoard);
                  const result = await chessService.playAMove(player1, { x: 4, y: 7 }, { x: 2, y: 7 }, chessBoard.id);
                  chessBoard = await chessCommonService.getBoard(chessBoard.id);

                  expect(result).toBeTruthy();
                  expect(chessBoard.board[2][7].chessRole).toBe(ChessRole.KING);
                  expect(chessBoard.board[2][7].flag).toBe(PlayerFlagEnum.BLACK);

                  expect(chessBoard.board[3][7].chessRole).toBe(ChessRole.ROOK);
                  expect(chessBoard.board[3][7].flag).toBe(PlayerFlagEnum.BLACK);

                  expect(chessBoard.board[0][7].chessRole).toBe(ChessRole.EMPTY);
                  expect(chessBoard.board[0][7].flag).toBe(PlayerFlagEnum.EMPTY);
            });
      });

      describe('promoteMove', () => {
            let chessBoardId: string;
            let user1: User;
            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  chessBoardId = await chessCommonService.createNewGame(user1);
            });

            it('promote at x = 1, y = 0 to QUEEN', async () => {
                  await chessService.promoteMove({ x: 1, y: 0 }, ChessRole.QUEEN, chessBoardId);
                  const board = await chessCommonService.getBoard(chessBoardId);
                  expect(board.board[1][0].chessRole).toBe(ChessRole.QUEEN);
            });

            it('promote at x = 2, y = 0 to KNIGHT', async () => {
                  await chessService.promoteMove({ x: 2, y: 0 }, ChessRole.KNIGHT, chessBoardId);
                  const board = await chessCommonService.getBoard(chessBoardId);
                  expect(board.board[2][0].chessRole).toBe(ChessRole.KNIGHT);
            });

            it('promote at x = 1, y = 0 to ROOK', async () => {
                  await chessService.promoteMove({ x: 1, y: 0 }, ChessRole.ROOK, chessBoardId);
                  const board = await chessCommonService.getBoard(chessBoardId);
                  expect(board.board[1][0].chessRole).toBe(ChessRole.ROOK);
            });

            it('promote at x = 1, y = 0 to BISHOP', async () => {
                  await chessService.promoteMove({ x: 1, y: 0 }, ChessRole.BISHOP, chessBoardId);
                  const board = await chessCommonService.getBoard(chessBoardId);
                  expect(board.board[1][0].chessRole).toBe(ChessRole.BISHOP);
            });

            it('promote at x = 3, y = 0 with king is checked', async () => {
                  let board = await chessCommonService.getBoard(chessBoardId);
                  board.board[3][0] = { chessRole: ChessRole.PAWN, flag: PlayerFlagEnum.BLACK };
                  await chessCommonService.setBoard(board);

                  await chessService.promoteMove({ x: 3, y: 0 }, ChessRole.QUEEN, chessBoardId);
                  board = await chessCommonService.getBoard(chessBoardId);

                  expect(board.board[3][0].chessRole).toBe(ChessRole.QUEEN);
                  expect(board.checkedPiece).toBeDefined();
            });
      });

      describe('promoteMove', () => {
            let chessBoardId: string;
            let user1: User;
            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  chessBoardId = await chessCommonService.createNewGame(user1);
            });

            it('check WHITE with king is checked', async () => {
                  let board = await chessCommonService.getBoard(chessBoardId);
                  board.board[3][0] = { chessRole: ChessRole.QUEEN, flag: PlayerFlagEnum.BLACK };
                  await chessCommonService.setBoard(board);

                  await chessService.executeEnemyKingIsChecked(chessBoardId, PlayerFlagEnum.WHITE);
                  board = await chessCommonService.getBoard(chessBoardId);

                  expect(board.checkedPiece).toBeDefined();
            });

            it('check WHITE with king is not checked', async () => {
                  await chessService.executeEnemyKingIsChecked(chessBoardId, PlayerFlagEnum.WHITE);
                  const board = await chessCommonService.getBoard(chessBoardId);
                  expect(board.checkedPiece).toBeUndefined();
            });
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
