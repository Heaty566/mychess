import { INestApplication } from '@nestjs/common';

//---- Helper
import { initTestModule } from '../../test/initTest';

//---- Service
import { ChessCommonService } from '../chessCommon.service';

//---- Entity
import { User } from '../../users/entities/user.entity';
import { Chess } from '../entity/chess.entity';

//---- Repository
import { ChessRepository } from '../entity/chess.repository';
import { ChessBoard } from '../entity/chessBoard.entity';

describe('chessCommonService', () => {
      let app: INestApplication;
      let resetDB: any;
      let chessRepository: ChessRepository;
      let generateFakeUser: () => Promise<User>;

      let chessGame: Chess;

      let chessCommonService: ChessCommonService;

      let user1: User;
      let user2: User;
      let chessBoard: ChessBoard;
      beforeAll(async () => {
            const { getApp, module, resetDatabase, getFakeUser } = await initTestModule();
            app = getApp;

            resetDB = resetDatabase;
            generateFakeUser = getFakeUser;

            chessRepository = module.get<ChessRepository>(ChessRepository);
            chessCommonService = module.get<ChessCommonService>(ChessCommonService);
      });

      beforeEach(async () => {
            user1 = await generateFakeUser();
            user2 = await generateFakeUser();

            const chess = new Chess();
            chess.users = [user1, user2];

            chessBoard = new ChessBoard(chess, true);
            await chessCommonService.setBoard(chessBoard.id, chessBoard);
      });

      describe('getMatchByUserId', () => {
            it('Pass', async () => {
                  const newChess = new Chess();
                  newChess.users = [user1];
                  await chessRepository.save(newChess);

                  const getChess = await chessCommonService.getManyChessByQuery('user.id = :id', { id: user1.id });
                  expect(getChess.length).toBeGreaterThanOrEqual(1);
                  expect(getChess[0].users[0].id).toBe(user1.id);
            });
      });

      describe('getOneTTTByField', () => {
            it('Pass', async () => {
                  const newChess = new Chess();
                  newChess.users = [user1];
                  await chessRepository.save(newChess);

                  const getChess = await chessCommonService.getOneChessByField('user.id = :id', { id: user1.id });
                  expect(getChess).toBeDefined();
                  expect(getChess.users[0].id).toBe(user1.id);
            });
      });

      describe('getBoard', () => {
            it('Pass', async () => {
                  const board = await chessCommonService.getBoard(chessBoard.id);
                  expect(board).toBeDefined();
                  expect(board.id).toBe(chessBoard.id);
            });
            it('Failed no found', async () => {
                  const board = await chessCommonService.getBoard(`chess-hello-world`);
                  expect(board).toBeNull();
            });
      });

      describe('setBoard', () => {
            it('Pass', async () => {
                  chessBoard.id = '123';
                  await chessCommonService.setBoard(chessBoard.id, chessBoard);
                  const board = await chessCommonService.getBoard(chessBoard.id);

                  expect(board).toBeDefined();
                  expect(board.id).toBe('123');
            });
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
