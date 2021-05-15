import { INestApplication } from '@nestjs/common';

//---- Helper
import { initTestModule } from '../../test/initTest';
import { generatorString } from '../../app/helpers/stringGenerator';

//---- Service
import { ChessCommonService } from '../chessCommon.service';

//---- Entity
import { User } from '../../user/entities/user.entity';
import { ChessBoard } from '../../chess/entity/chessBoard.entity';
import { ChessPlayer, ChessStatus, EloCalculator, PlayerFlagEnum } from '../entity/chess.interface';
import { Chess } from '../entity/chess.entity';
import { ChessRepository } from '../entity/chess.repository';
import { ChessBotService } from '../chessBot.service';

describe('chessBotService', () => {
      let app: INestApplication;
      let resetDB: any;
      let generateFakeUser: () => Promise<User>;
      let chessCommonService: ChessCommonService;
      let chessRepository: ChessRepository;
      let chessBotService: ChessBotService;

      beforeAll(async () => {
            const { getApp, module, resetDatabase, getFakeUser } = await initTestModule();
            app = getApp;
            resetDB = resetDatabase;
            generateFakeUser = getFakeUser;
            chessCommonService = module.get<ChessCommonService>(ChessCommonService);
            chessRepository = module.get<ChessRepository>(ChessRepository);
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

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
