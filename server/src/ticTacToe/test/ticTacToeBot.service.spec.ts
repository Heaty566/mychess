import { INestApplication } from '@nestjs/common';

//---- Helper
import { initTestModule } from '../../test/initTest';

//---- Entity
import { User } from '../../user/entities/user.entity';
import { TicTacToe } from '../entity/ticTacToe.entity';
import { TicTacToeMove } from '../entity/ticTacToeMove.entity';
import { TicTacToePlayer } from '../entity/ticTacToe.interface';

//---- Service
import { TicTacToeBotService } from '../ticTacToeBot.service';
import { TicTacToeCommonService } from '../ticTacToeCommon.service';

//---- Repository
import { TicTacToeRepository } from '../entity/ticTacToe.repository';
import { TicTacToeMoveRepository } from '../entity/ticTacToeMove.repository';

describe('ticTacToeBotService', () => {
      let app: INestApplication;
      let user1: User;
      let user2: User;

      let resetDB: any;
      let ticTacToeRepository: TicTacToeRepository;
      let generateFakeUser: () => Promise<User>;
      let ticTacToeBotService: TicTacToeBotService;
      let ticTacToeMoveRepository: TicTacToeMoveRepository;
      let ticTacToeCommonService: TicTacToeCommonService;

      beforeAll(async () => {
            const { getApp, module, resetDatabase, getFakeUser } = await initTestModule();
            app = getApp;

            resetDB = resetDatabase;
            generateFakeUser = getFakeUser;

            ticTacToeRepository = module.get<TicTacToeRepository>(TicTacToeRepository);
            ticTacToeMoveRepository = module.get<TicTacToeMoveRepository>(TicTacToeMoveRepository);
            ticTacToeBotService = module.get<TicTacToeBotService>(TicTacToeBotService);
            ticTacToeCommonService = module.get<TicTacToeCommonService>(TicTacToeCommonService);
      });

      beforeEach(async () => {
            user1 = await generateFakeUser();
            user2 = await generateFakeUser();
            const newMove = new TicTacToeMove();
            newMove.x = 1;
            newMove.y = 1;
            newMove.flag = 1;
            const move = await ticTacToeMoveRepository.save(newMove);
            const ticTicToe = new TicTacToe();
            ticTicToe.users = [user1, user2];
            ticTicToe.moves = [move];

            await ticTacToeRepository.save(ticTicToe);
      });

      describe('findBestMove', () => {
            let player1: TicTacToePlayer;
            let player2: TicTacToePlayer;
            let tttId: string;

            beforeEach(async () => {
                  const user = await generateFakeUser();
                  tttId = await ticTacToeCommonService.createNewGame(user, true);
                  const getBoard = await ticTacToeCommonService.getBoard(tttId);
                  await ticTacToeCommonService.toggleReadyStatePlayer(tttId, getBoard.users[0]);
                  await ticTacToeCommonService.toggleReadyStatePlayer(tttId, getBoard.users[1]);
                  await ticTacToeCommonService.startGame(tttId);
                  player1 = getBoard.users[0];
                  player2 = getBoard.users[1];
            });

            it('Pass', async () => {
                  const getBoardGame = await ticTacToeCommonService.getBoard(tttId);
                  getBoardGame.board[0][0] = 0;
                  getBoardGame.board[0][2] = 0;
                  await ticTacToeCommonService.setBoard(getBoardGame);
                  const botBestMove = await ticTacToeBotService.findBestMove(tttId, player1);
                  const userBestMove = await ticTacToeBotService.findBestMove(tttId, player2);

                  expect(userBestMove.point).toBe(-Infinity);
                  expect(botBestMove.point).toBe(20);
            });

            it('Pass', async () => {
                  const getBoardGame = await ticTacToeCommonService.getBoard(tttId);
                  getBoardGame.board[0][0] = 0;
                  getBoardGame.board[0][2] = 0;
                  getBoardGame.board[0][3] = 0;
                  getBoardGame.board[0][4] = 0;
                  getBoardGame.board[0][5] = 1;
                  await ticTacToeCommonService.setBoard(getBoardGame);
                  const botBestMove = await ticTacToeBotService.findBestMove(tttId, player1);
                  const userBestMove = await ticTacToeBotService.findBestMove(tttId, player2);
                  expect(userBestMove.point).toBe(10);
                  expect(botBestMove.point).toBe(40);
            });

            it('Pass', async () => {
                  const getBoardGame = await ticTacToeCommonService.getBoard(tttId);

                  getBoardGame.board[0][2] = 0;
                  getBoardGame.board[0][3] = 0;
                  getBoardGame.board[0][4] = 0;
                  getBoardGame.board[3][5] = 1;
                  getBoardGame.board[3][6] = 1;
                  getBoardGame.board[3][7] = 1;
                  await ticTacToeCommonService.setBoard(getBoardGame);
                  const botBestMove = await ticTacToeBotService.findBestMove(tttId, player1);
                  const userBestMove = await ticTacToeBotService.findBestMove(tttId, player2);
                  expect(userBestMove.point).toBe(30);
                  expect(botBestMove.point).toBe(30);
            });
            it('Pass', async () => {
                  const getBoardGame = await ticTacToeCommonService.getBoard(tttId);
                  getBoardGame.board[13][2] = 0;
                  getBoardGame.board[13][3] = 0;
                  getBoardGame.board[13][4] = 0;
                  getBoardGame.board[3][13] = 1;
                  getBoardGame.board[4][13] = 1;
                  getBoardGame.board[5][13] = 1;
                  await ticTacToeCommonService.setBoard(getBoardGame);
                  const botBestMove = await ticTacToeBotService.findBestMove(tttId, player1);
                  const userBestMove = await ticTacToeBotService.findBestMove(tttId, player2);
                  expect(userBestMove.point).toBe(30);
                  expect(botBestMove.point).toBe(30);
            });
            it('Pass', async () => {
                  const getBoardGame = await ticTacToeCommonService.getBoard(tttId);

                  getBoardGame.board[13][0] = 0;
                  getBoardGame.board[13][1] = 0;
                  getBoardGame.board[13][2] = 0;
                  getBoardGame.board[13][3] = 0;
                  getBoardGame.board[0][13] = 1;
                  getBoardGame.board[1][13] = 1;
                  getBoardGame.board[2][13] = 1;
                  getBoardGame.board[3][13] = 1;
                  await ticTacToeCommonService.setBoard(getBoardGame);
                  const botBestMove = await ticTacToeBotService.findBestMove(tttId, player1);
                  const userBestMove = await ticTacToeBotService.findBestMove(tttId, player2);
                  expect(userBestMove.point).toBe(40);
                  expect(botBestMove.point).toBe(40);
            });

            it('Pass', async () => {
                  const getBoardGame = await ticTacToeCommonService.getBoard(tttId);
                  getBoardGame.board[13][0] = 0;
                  getBoardGame.board[13][1] = 0;
                  getBoardGame.board[13][2] = 1;
                  getBoardGame.board[13][3] = 0;
                  getBoardGame.board[0][13] = 0;
                  getBoardGame.board[1][13] = 1;
                  getBoardGame.board[2][13] = 1;
                  getBoardGame.board[3][13] = 1;
                  await ticTacToeCommonService.setBoard(getBoardGame);
                  const botBestMove = await ticTacToeBotService.findBestMove(tttId, player1);
                  const userBestMove = await ticTacToeBotService.findBestMove(tttId, player2);
                  expect(userBestMove.point).toBe(30);
                  expect(botBestMove.point).toBe(10);
            });
            it('Failed wrong board', async () => {
                  const getBoardGame = await ticTacToeCommonService.getBoard(tttId);
                  getBoardGame.board[13][0] = 0;
                  getBoardGame.board[13][1] = 0;
                  getBoardGame.board[13][2] = 1;
                  getBoardGame.board[13][3] = 0;
                  getBoardGame.board[0][13] = 0;
                  getBoardGame.board[1][13] = 1;
                  getBoardGame.board[2][13] = 1;
                  getBoardGame.board[3][13] = 1;
                  await ticTacToeCommonService.setBoard(getBoardGame);
                  const botBestMove = await ticTacToeBotService.findBestMove('hello', player1);

                  expect(botBestMove).toBeUndefined();
            });
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
