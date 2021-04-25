import { INestApplication } from '@nestjs/common';

//---- Helper
import { getIoClient } from '../../test/test.helper';
import { initTestModule } from '../../test/initTest';

//---- Entity

import { User } from '../../users/entities/user.entity';
import { fakeUser } from '../../test/fakeEntity';
import { TicTacToe } from '../entity/ticTacToe.entity';
//---- Repository
import { TicTacToeRepository } from '../entity/ticTacToe.repository';
import { UserRepository } from '../../users/entities/user.repository';

import { AuthService } from '../../auth/auth.service';
import { TicTacToeStatus } from '../entity/ticTacToeStatus';
import { TicTacToeGateway } from '../ticTacToe.gateway';
//---- Common
import { TTTAction } from '../../ticTacToe/ticTacToe.action';
import { SocketServerResponse } from '../../app/interface/socketResponse';
import { TicTacToeService } from '../ticTacToe.service';
import { Console } from 'node:console';

describe('TicTacToeGateway ', () => {
      let app: INestApplication;
      const port = 3021;
      let authService: AuthService;
      let ticTacToeRepository: TicTacToeRepository;
      let userRepository: UserRepository;
      let resetDB: any;
      let ticTacToeGateWay: TicTacToeGateway;
      let ticTacToeService: TicTacToeService;
      beforeAll(async () => {
            const { configModule, resetDatabase } = await initTestModule();
            app = configModule;

            resetDB = resetDatabase;
            await app.listen(port);
            ticTacToeRepository = app.get<TicTacToeRepository>(TicTacToeRepository);
            userRepository = app.get<UserRepository>(UserRepository);
            authService = app.get<AuthService>(AuthService);
            ticTacToeService = app.get<TicTacToeService>(TicTacToeService);
            ticTacToeGateWay = app.get<TicTacToeGateway>(TicTacToeGateway);
      });

      describe('player-create-match', () => {
            let client: SocketIOClient.Socket;
            let user: User;
            beforeEach(async () => {
                  user = await userRepository.save(fakeUser());
                  const socketToken = await authService.getSocketToken(user);
                  client = await getIoClient(port, 'tic-tac-toe', socketToken);

                  await client.connect();
            });

            afterEach(async () => {
                  client.disconnect();
            });

            it('Pass', async (done) => {
                  client.on('join-test', () => {
                        done();
                  });
                  client.on(TTTAction.TTT_CREATE_ROOM, async (data: SocketServerResponse<null>) => {
                        const isExist = await ticTacToeRepository
                              .createQueryBuilder('tic')
                              .leftJoinAndSelect('tic.users', 'user')
                              .where('user.id = :userId and status = :status', { userId: user.id, status: TicTacToeStatus['NOT-YET'] })
                              .getOne();

                        expect(isExist).toBeDefined();
                        expect(data.statusCode).toBe(200);
                        ticTacToeGateWay.server.to(`tic-tac-toe-${isExist.id}`).emit('join-test', {});
                  });

                  client.emit(TTTAction.TTT_CREATE_ROOM, {});
            });

            it('Failed User is Playing', async (done) => {
                  const ticTacToe = new TicTacToe();
                  ticTacToe.users = [user];
                  ticTacToe.status = TicTacToeStatus.PLAYING;
                  await ticTacToeRepository.save(ticTacToe);

                  client.on('exception', (data: SocketServerResponse<null>) => {
                        expect(data).toBeDefined();
                        expect(data.details).toBeDefined();
                        expect(data.statusCode).toBe(400);
                        done();
                  });

                  client.emit(TTTAction.TTT_CREATE_ROOM, {});
            });
      });
      describe('join-match', () => {
            let client: SocketIOClient.Socket;
            let user: User;
            let tTT: TicTacToe;
            beforeEach(async () => {
                  user = await userRepository.save(fakeUser());
                  const socketToken = await authService.getSocketToken(user);
                  client = await getIoClient(port, 'tic-tac-toe', socketToken);

                  const tic = new TicTacToe();

                  tTT = await ticTacToeRepository.save(tic);
                  tTT.users = [];
                  await client.connect();
            });
            it('Pass', (done) => {
                  client.on('test-join', () => {
                        done();
                  });

                  client.on(TTTAction.TTT_JOIN_ROOM, (res: SocketServerResponse<null>) => {
                        ticTacToeGateWay.server.to(`tic-tac-toe-${tTT.id}`).emit('test-join', {});
                        expect(res.statusCode).toBe(200);
                  });
                  client.emit(TTTAction.TTT_JOIN_ROOM, { roomId: tTT.id });
            });
            it('Failed invalid input', (done) => {
                  client.on('exception', (res: SocketServerResponse<null>) => {
                        expect(res.statusCode).toBe(400);
                        done();
                  });
                  client.emit(TTTAction.TTT_JOIN_ROOM, {});
            });

            it('Failed user playing', async (done) => {
                  tTT.users.push(user);
                  tTT.status = TicTacToeStatus.PLAYING;
                  await ticTacToeRepository.save(tTT);

                  client.on('exception', (res: SocketServerResponse<null>) => {
                        expect(res.statusCode).toBe(400);
                        done();
                  });
                  client.emit(TTTAction.TTT_JOIN_ROOM, { roomId: '12333' });
            });

            it('Failed room does not exist', (done) => {
                  client.on('exception', (res: SocketServerResponse<null>) => {
                        expect(res.statusCode).toBe(404);
                        done();
                  });

                  client.emit(TTTAction.TTT_JOIN_ROOM, { roomId: '120939129321921' });
            });

            afterEach(async () => {
                  client.disconnect();
            });
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
