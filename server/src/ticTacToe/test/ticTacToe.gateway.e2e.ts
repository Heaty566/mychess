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
import { ApiServerResponse } from '../../app/interface/serverResponse';
import { UserRepository } from '../../users/entities/user.repository';

import { AuthService } from '../../auth/auth.service';
import { TicTacToeStatus } from '../entity/ticTacToeStatus';
import { TicTacToeGateway } from '../ticTacToe.gateway';

describe('TicTacToeGateway ', () => {
      let app: INestApplication;
      const port = 3021;
      let authService: AuthService;
      let ticTacToeRepository: TicTacToeRepository;
      let userRepository: UserRepository;
      let resetDB: any;
      let ticTacToeGateWay: TicTacToeGateway;

      beforeAll(async () => {
            const { configModule, resetDatabase } = await initTestModule();
            app = configModule;

            resetDB = resetDatabase;
            await app.listen(port);
            ticTacToeRepository = app.get<TicTacToeRepository>(TicTacToeRepository);
            userRepository = app.get<UserRepository>(UserRepository);
            authService = app.get<AuthService>(AuthService);
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
                  client.on('player-create-match-success', async (data: ApiServerResponse) => {
                        const isExist = await ticTacToeRepository
                              .createQueryBuilder('tic')
                              .leftJoinAndSelect('tic.users', 'user')
                              .where('user.id = :userId and status = :status', { userId: user.id, status: TicTacToeStatus['NOT-YET'] })
                              .getOne();

                        expect(isExist).toBeDefined();
                        expect(data).toBeDefined();
                        expect(data.details).toBeUndefined();
                        ticTacToeGateWay.server.to(`tic-tac-toe-${isExist.id}`).emit('join-test', {});
                  });

                  client.emit('player-create-match', {});
            });

            it('Failed User is Playing', async (done) => {
                  const ticTacToe = new TicTacToe();
                  ticTacToe.users = [user];
                  ticTacToe.status = TicTacToeStatus.PLAYING;
                  await ticTacToeRepository.save(ticTacToe);

                  client.on('player-create-match-failed', (data: ApiServerResponse) => {
                        expect(data).toBeDefined();
                        expect(data.details).toBeDefined();
                        done();
                  });

                  client.emit('player-create-match', {});
            });
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
