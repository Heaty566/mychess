import { INestApplication } from '@nestjs/common';

//---- Helper
import { initTestModule } from '../../test/initTest';
import { generatorString } from '../../app/helpers/stringGenerator';

//---- Service
import { ChessCommonService } from '../chessCommon.service';
import { ChessBotService } from '../chessBot.service';

//---- Entity
import { User } from '../../user/entities/user.entity';
import { PlayerFlagEnum, ChessMove, ChessMoveCoordinates, ChessRole } from '../entity/chess.interface';

describe('chessBotService', () => {
      let app: INestApplication;
      let resetDB: any;
      let generateFakeUser: () => Promise<User>;
      let chessCommonService: ChessCommonService;
      let chessBotService: ChessBotService;

      beforeAll(async () => {
            const { getApp, module, resetDatabase, getFakeUser } = await initTestModule();
            app = getApp;
            resetDB = resetDatabase;
            generateFakeUser = getFakeUser;
            chessCommonService = module.get<ChessCommonService>(ChessCommonService);
            chessBotService = module.get<ChessBotService>(ChessBotService);
      });

      describe('getAllMoves', () => {
            let user1: User;
            let boardId: string;
            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  boardId = await chessCommonService.createNewGame(user1);
            });

            it('Chessboard = init chessboard', async () => {
                  const blackMoves = await chessBotService['getAllMoves'](boardId, PlayerFlagEnum.BLACK);
                  const whiteMoves = await chessBotService['getAllMoves'](boardId, PlayerFlagEnum.WHITE);
                  expect(blackMoves.length).toEqual(whiteMoves.length);
            });

            it('boardId is not correct', async () => {
                  const blackMoves = await chessBotService['getAllMoves'](generatorString(10, 'number'), PlayerFlagEnum.BLACK);

                  expect(blackMoves).toBeDefined();
            });
      });

      describe('randomMove', () => {
            let user1: User;
            let boardId: string;
            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  boardId = await chessCommonService.createNewGame(user1);
            });

            it('Chessboard = init chessboard', async () => {
                  const move = await chessBotService.randomMove(boardId, PlayerFlagEnum.BLACK);
                  expect(move).toBeDefined();
            });
      });

      describe('evaluateBoard', () => {
            let user1: User;
            let boardId: string;
            let move: ChessMove;

            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  boardId = await chessCommonService.createNewGame(user1);
                  move = await chessBotService.randomMove(boardId, PlayerFlagEnum.BLACK);
            });

            it('Chessboard = init chessboard', async () => {
                  const value = await chessBotService['evaluateBoard'](boardId, PlayerFlagEnum.BLACK, move);
                  expect(value).toBeDefined();
            });

            it('boardId is not correct', async () => {
                  const blackMoves = await chessBotService['evaluateBoard'](generatorString(10, 'number'), PlayerFlagEnum.BLACK, move);

                  expect(blackMoves).toBeDefined();
            });
      });

      describe('findBestMove', () => {
            let user1: User;
            let boardId: string;
            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  boardId = await chessCommonService.createNewGame(user1);
            });

            it('Chessboard = init chessboard', async () => {
                  const move = await chessBotService.findBestMove(boardId, PlayerFlagEnum.BLACK);
                  expect(move).toBeDefined();
            });
      });

      describe('botPromotePawn', () => {
            let user1: User;
            let boardId: string;
            let promotePos: ChessMoveCoordinates;
            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  boardId = await chessCommonService.createNewGame(user1);
                  promotePos = { x: 0, y: 0 };
            });

            it('x = 0', async () => {
                  await chessBotService.botPromotePawn(promotePos, boardId);
                  const board = await chessCommonService.getBoard(boardId);
                  expect(board.board[promotePos.x][promotePos.y].chessRole).toBe(ChessRole.QUEEN);
            });

            it('x = 1', async () => {
                  promotePos.x = 1;
                  await chessBotService.botPromotePawn(promotePos, boardId);
                  const board = await chessCommonService.getBoard(boardId);
                  expect(board.board[promotePos.x][promotePos.y].chessRole).toBe(ChessRole.QUEEN);
            });

            it('x = 2', async () => {
                  promotePos.x = 2;
                  await chessBotService.botPromotePawn(promotePos, boardId);
                  const board = await chessCommonService.getBoard(boardId);
                  expect(board.board[promotePos.x][promotePos.y].chessRole).toBe(ChessRole.QUEEN);
            });

            it('x = 3', async () => {
                  promotePos.x = 3;
                  await chessBotService.botPromotePawn(promotePos, boardId);
                  const board = await chessCommonService.getBoard(boardId);
                  expect(board.board[promotePos.x][promotePos.y].chessRole).toBe(ChessRole.QUEEN);
            });

            it('x = 4', async () => {
                  promotePos.x = 4;
                  await chessBotService.botPromotePawn(promotePos, boardId);
                  const board = await chessCommonService.getBoard(boardId);
                  expect(board.board[promotePos.x][promotePos.y].chessRole).toBe(ChessRole.QUEEN);
            });

            it('x = 5', async () => {
                  promotePos.x = 5;
                  await chessBotService.botPromotePawn(promotePos, boardId);
                  const board = await chessCommonService.getBoard(boardId);
                  expect(board.board[promotePos.x][promotePos.y].chessRole).toBe(ChessRole.QUEEN);
            });

            it('x = 6', async () => {
                  promotePos.x = 6;
                  await chessBotService.botPromotePawn(promotePos, boardId);
                  const board = await chessCommonService.getBoard(boardId);
                  expect(board.board[promotePos.x][promotePos.y].chessRole).toBe(ChessRole.QUEEN);
            });

            it('x = 7', async () => {
                  promotePos.x = 7;
                  await chessBotService.botPromotePawn(promotePos, boardId);
                  const board = await chessCommonService.getBoard(boardId);
                  expect(board.board[promotePos.x][promotePos.y].chessRole).toBe(ChessRole.QUEEN);
            });
      });

      describe('botMove', () => {
            let user1: User;
            let boardId: string;
            beforeEach(async () => {
                  user1 = await generateFakeUser();
                  boardId = await chessCommonService.createNewGame(user1, true);
                  const board = await chessCommonService.getBoard(boardId);
                  board.turn = true;
                  await chessCommonService.setBoard(board);
            });

            it('enemy is WHITE', async () => {
                  await chessBotService.botMove(boardId, PlayerFlagEnum.WHITE);
                  const board = await chessCommonService.getBoard(boardId);
                  expect(board.turn).toBeFalsy();
            });
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
