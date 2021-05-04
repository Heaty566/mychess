import { INestApplication } from '@nestjs/common';

//---- Helper
import { initTestModule } from '../../test/initTest';

//---- Service
import { ChessCommonService } from '../chessCommon.service';
import { ChessService } from '../chess.service';

//---- Entity
import { User } from '../../users/entities/user.entity';
import { Chess } from '../entity/chess.entity';

//---- Repository
import { ChessRepository } from '../entity/chess.repository';

describe('ticTacToeCommonService', () => {
      let app: INestApplication;
      let chessService: ChessService;
      let resetDB: any;
      let chessRepository: ChessRepository;
      let generateFakeUser: () => Promise<User>;

      let chessGame: Chess;

      let chessCommonService: ChessCommonService;

      let user1: User;
      let user2: User;
      beforeAll(async () => {
            const { getApp, module, resetDatabase, getFakeUser } = await initTestModule();
            app = getApp;

            resetDB = resetDatabase;
            generateFakeUser = getFakeUser;

            chessRepository = module.get<ChessRepository>(ChessRepository);
            chessService = module.get<ChessService>(ChessService);
            chessCommonService = module.get<ChessCommonService>(ChessCommonService);
      });

      beforeEach(async () => {
            user1 = await generateFakeUser();
            user2 = await generateFakeUser();

            const chess = new Chess();
            chess.users = [user1, user2];

            chessGame = await chessRepository.save(chess);
      });

      describe('isPlaying', () => {
            it('Pass', async () => {
                  const res = chessCommonService.isPlaying(user1.id);
                  console.log(res);
            });
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
