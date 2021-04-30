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
import { TicTacToeStatus } from '../entity/ticTacToe.interface';
import { TicTacToeGateway } from '../ticTacToe.gateway';
//---- Common
import { TTTAction } from '../../ticTacToe/ticTacToe.action';
import { SocketServerResponse } from '../../app/interface/socketResponse';
import { RoomIdDTO } from '../dto/roomIdDto';
import { TicTacToeService } from '../ticTacToe.service';
import { RedisService } from '../../providers/redis/redis.service';
import { TicTacToeBoard } from '../entity/ticTacToeBoard.entity';

describe('TicTacToeGateway ', () => {
      let app: INestApplication;
      const port = 3021;
      let authService: AuthService;
      let ticTacToeRepository: TicTacToeRepository;
      let userRepository: UserRepository;
      let resetDB: any;
      let ticTacToeGateWay: TicTacToeGateway;
      let createFakeUser: () => Promise<User>;
      let ticTacToeService: TicTacToeService;
      let redisService: RedisService;
      beforeAll(async () => {
            const { configModule, resetDatabase, getFakeUser } = await initTestModule();
            app = configModule;
            createFakeUser = getFakeUser;
            resetDB = resetDatabase;
            await app.listen(port);
            ticTacToeRepository = app.get<TicTacToeRepository>(TicTacToeRepository);
            userRepository = app.get<UserRepository>(UserRepository);
            redisService = app.get<RedisService>(RedisService);
            authService = app.get<AuthService>(AuthService);
            ticTacToeGateWay = app.get<TicTacToeGateway>(TicTacToeGateway);
            ticTacToeService = app.get<TicTacToeService>(TicTacToeService);
      });

      describe(`${TTTAction.TTT_JOIN}`, () => {
            let client: SocketIOClient.Socket;
            let user2: User;
            let user1: User;
            let ttt: TicTacToe;
            beforeEach(async () => {
                  user1 = await createFakeUser();
                  const ticTacToe = new TicTacToe();
                  ticTacToe.users = [user1];
                  ttt = await ticTacToeRepository.save(ticTacToe);

                  await ticTacToeService.loadGameToCache(ttt.id);
                  await ticTacToeService.joinGame(ttt.id, user1);

                  user2 = await createFakeUser();
                  const socketToken = await authService.getSocketToken(user2);
                  client = await getIoClient(port, 'tic-tac-toe', socketToken);
                  await client.connect();
            });

            it('Pass', (done) => {
                  client.on(TTTAction.TTT_JOIN, async (data) => {
                        const getGame = await ticTacToeRepository
                              .createQueryBuilder('tic')
                              .leftJoinAndSelect('tic.users', 'user')
                              .where('tic.id = :id', { id: ttt.id })
                              .getOne();

                        const getGameRedis = await redisService.getObjectByKey<TicTacToeBoard>(`ttt-${ttt.id}`);

                        expect(getGameRedis).toBeDefined();
                        expect(getGameRedis.users.filter((item) => item.id === user2.id)).toHaveLength(1);
                        expect(getGame.users.filter((item) => item.id === user2.id)).toHaveLength(1);
                        done();
                  });
                  client.emit(TTTAction.TTT_JOIN, { roomId: ttt.id });
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
