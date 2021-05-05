import * as supertest from 'supertest';
import 'jest-ts-auto-mock';
import { INestApplication } from '@nestjs/common';

//---- Helper
import { initTestModule } from '../../test/initTest';
import { fakeUser } from '../../test/fakeEntity';
import { fakeData, defuse } from '../../test/test.helper';

//---- Repository

//---- Entity
import { User } from '../../users/entities/user.entity';

//---- Service

import { UserService } from '../../users/user.service';
import { TicTacToeCommonService } from '../ticTacToeCommon.service';
import { generateCookie } from '../../test/test.helper';
import { TicTacToeStatus } from '../entity/ticTacToe.interface';
import { AuthService } from '../../auth/auth.service';
import { RoomIdDTO } from '../dto/roomIdDto';

//---- DTO

describe('TicTacToeController', () => {
      let app: INestApplication;
      let resetDB: any;

      let ticTacToeCommonService: TicTacToeCommonService;
      let generateFakeUser: () => Promise<User>;
      let authService: AuthService;

      beforeAll(async () => {
            const { getApp, module, resetDatabase, getFakeUser } = await initTestModule();
            app = getApp;
            resetDB = resetDatabase;
            generateFakeUser = getFakeUser;

            ticTacToeCommonService = module.get<TicTacToeCommonService>(TicTacToeCommonService);
            authService = module.get<AuthService>(AuthService);
      });

      describe('POST /', () => {
            let newUser: User;
            let newCookie: string[];
            beforeEach(async () => {
                  newUser = await generateFakeUser();
                  newCookie = generateCookie(await authService.createReToken(newUser));
            });

            const reqApi = () => supertest(app.getHttpServer()).post('/api/tic-tac-toe').set({ cookie: newCookie }).send();

            it('Pass', async () => {
                  const res = await reqApi();

                  const getBoard = await ticTacToeCommonService.getBoard(res.body.data.roomId);

                  const isExistUser = getBoard.info.users.find((item) => item.id === newUser.id);
                  expect(isExistUser).toBeDefined();
                  expect(getBoard).toBeDefined();
                  expect(res.status).toBe(201);
                  expect(res.body.data.roomId).toBeDefined();
            });
            it('Failed User Playing', async () => {
                  const tttBoard = await ticTacToeCommonService.createNewGame(newUser, false);
                  tttBoard.info.status = TicTacToeStatus.PLAYING;
                  await ticTacToeCommonService.saveTicTacToe(tttBoard.info);
                  await ticTacToeCommonService.setBoard(tttBoard.id, tttBoard);

                  const res = await reqApi();

                  expect(res.status).toBe(400);
            });
      });
      describe('POST /create-bot', () => {
            let newUser: User;
            let newCookie: string[];
            beforeEach(async () => {
                  newUser = await generateFakeUser();
                  newCookie = generateCookie(await authService.createReToken(newUser));
            });

            const reqApi = () => supertest(app.getHttpServer()).post('/api/tic-tac-toe/create-bot').set({ cookie: newCookie }).send();

            it('Pass', async () => {
                  const res = await reqApi();
                  const getBoard = await ticTacToeCommonService.getBoard(res.body.data.roomId);

                  const isExistUser = getBoard.info.users.find((item) => item.id === newUser.id);
                  const isExistBot = getBoard.info.users.find((item) => item.name === 'BOT');
                  expect(isExistBot).toBeDefined();
                  expect(isExistUser).toBeDefined();
                  expect(getBoard).toBeDefined();
                  expect(res.status).toBe(201);
                  expect(res.body.data.roomId).toBeDefined();
            });
      });
      describe('POST /create-bot', () => {
            let newUser: User;
            let newCookie: string[];
            beforeEach(async () => {
                  newUser = await generateFakeUser();
                  newCookie = generateCookie(await authService.createReToken(newUser));
            });

            const reqApi = (input: RoomIdDTO) =>
                  supertest(app.getHttpServer()).post('/api/tic-tac-toe/join-room').set({ cookie: newCookie }).send(input);

            it('Pass', async () => {
                  const user3 = await generateFakeUser();
                  const tttBoard = await ticTacToeCommonService.createNewGame(user3, false);
                  const res = await reqApi({ roomId: tttBoard.id });
                  const getBoard = await ticTacToeCommonService.getBoard(tttBoard.id);
                  const isExistUser = getBoard.info.users.find((item) => item.id === newUser.id);

                  expect(isExistUser).toBeDefined();
                  expect(getBoard).toBeDefined();
                  expect(getBoard.users[0].id).toBeDefined();
                  expect(getBoard.users[1].id).toBeDefined();
                  expect(res.status).toBe(201);
            });

            it('Pass join again', async () => {
                  const tttBoard = await ticTacToeCommonService.createNewGame(newUser, false);
                  const res = await reqApi({ roomId: tttBoard.id });
                  const getBoard = await ticTacToeCommonService.getBoard(tttBoard.id);
                  const isExistUser = getBoard.info.users.find((item) => item.id === newUser.id);

                  expect(isExistUser).toBeDefined();
                  expect(getBoard).toBeDefined();
                  expect(getBoard.users[0].id).toBeDefined();
                  expect(getBoard.users[1].id).toBeDefined();
                  expect(res.status).toBe(201);
            });
            it('Failed Full Player', async () => {
                  const user3 = await generateFakeUser();
                  const tttBoard = await ticTacToeCommonService.createNewGame(user3, false);
                  const beforeUpdate = await ticTacToeCommonService.getBoard(tttBoard.id);
                  beforeUpdate.info.users[1] = await generateFakeUser();
                  await ticTacToeCommonService.setBoard(beforeUpdate.id, beforeUpdate);
                  const res = await reqApi({ roomId: tttBoard.id });
                  const getBoard = await ticTacToeCommonService.getBoard(tttBoard.id);
                  const isExistUser = getBoard.info.users.find((item) => item.id === newUser.id);

                  expect(isExistUser).toBeUndefined();
                  expect(getBoard).toBeDefined();
                  expect(res.status).toBe(400);
            });
            it('Failed Not Found', async () => {
                  const res = await reqApi({ roomId: 'helloworld' });

                  expect(res.status).toBe(404);
            });
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
