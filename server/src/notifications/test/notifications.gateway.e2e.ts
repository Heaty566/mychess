import { INestApplication } from '@nestjs/common';

//---- Helper
import { getIoClient } from '../../app/Helpers/test/test.helper';
import { initTestModule } from '../../app/Helpers/test/initTest';

//---- Entity
import { Notification } from '../entities/notification.entity';
import { User } from '../../users/entities/user.entity';

//---- Repository
import { UserRepository } from '../../users/entities/user.repository';

describe('ChatsGateway', () => {
      let app: INestApplication;
      const port = 5208;
      let client1: SocketIOClient.Socket;
      let client2: SocketIOClient.Socket;
      let userSocketToken1: string;
      let userSocketToken2: string;
      let user1: User;
      let user2: User;

      let userRepository: UserRepository;
      let resetDB: any;

      beforeAll(async () => {
            const { configModule, users, resetDatabase } = await initTestModule();
            app = configModule;

            userSocketToken1 = (await users[0]).ioToken;
            user1 = (await users[0]).user;

            userSocketToken2 = (await users[1]).ioToken;
            user2 = (await users[1]).user;
            resetDB = resetDatabase;
            await app.listen(port);

            userRepository = app.get<UserRepository>(UserRepository);
      });

      beforeEach(async () => {
            client1 = await getIoClient(port, 'notifications', userSocketToken1);
            client2 = await getIoClient(port, 'notifications', userSocketToken2);
      });

      afterEach(async () => {
            await client1.disconnect();
            await client2.disconnect();
      });

      describe('connection-notification', () => {
            beforeEach(async () => {
                  await client1.connect();
            });

            it('Pass', async (done) => {
                  client1.on('connection-notification-success', (data) => {
                        expect(data).toBeNull();
                        done();
                  });
                  client1.emit('connection-notification', {});
            });
      });

      describe('send-notification', () => {
            beforeEach(async () => {
                  await client1.connect();
                  await client2.connect();
            });
            it('Pass', async (done) => {
                  client1.on('new-notification', () => {
                        expect(1 + 1).toBeUndefined();
                  });
                  client1.on('send-notification', async () => {
                        const getUser = await userRepository
                              .createQueryBuilder('user')
                              .leftJoinAndSelect('user.notifications', 'notification')
                              .where('user.id = :id', { id: user2.id })
                              .getOne();
                        expect(getUser.notifications.length).toBeGreaterThanOrEqual(1);
                        done();
                  });
                  client2.on('new-notification', (data) => {
                        expect(data).toBeDefined();
                  });
                  client2.emit('connection-notification', {});
                  client1.emit('send-notification', { userId: user2.id });
            });
      });

      describe('update-notifications', () => {
            beforeAll(async () => {
                  const notification1 = new Notification();
                  const notification2 = new Notification();

                  user1.notifications = [notification1, notification2];
                  await userRepository.save(user1);
            });

            beforeEach(async () => {
                  await client1.connect();
            });

            it('Pass', async (done) => {
                  client1.on('update-notifications-success', (data) => {
                        expect(data).toHaveLength(2);
                        done();
                  });
                  client1.emit('update-notifications', {});
            });
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
