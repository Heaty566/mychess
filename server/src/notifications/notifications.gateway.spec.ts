import { INestApplication } from '@nestjs/common';
import * as io from 'socket.io-client';
import { initTestModule } from '../../test/initTest';
import { Notification } from './entities/notification.entity';
import { NotificationRepository } from '../notifications/entities/notification.repository';
import User from '../users/entities/user.entity';
import { UserRepository } from '../users/entities/user.repository';
import { fakeUser } from '../../test/fakeEntity';
import { AuthService } from '../auth/auth.service';

describe('ChatsGateway', () => {
      let app: INestApplication;
      let port: number;
      let namespace: string;
      let client1;
      let client2;
      let userSocketToken1: string;
      let userSocketToken2: string;
      let authService: AuthService;
      let notificationRepository: NotificationRepository;
      let user: User;
      let user2: User;
      let userRepository: UserRepository;

      beforeAll(async () => {
            const { configModule, socketToken1: socketToken, getUser, socketToken2, getAdmin } = await initTestModule();
            app = configModule;
            port = 5208;
            namespace = 'notifications';
            userSocketToken1 = socketToken;
            user = getUser;
            user2 = getAdmin;
            await app.listen(port);
            notificationRepository = app.get<NotificationRepository>(NotificationRepository);
            userRepository = app.get<UserRepository>(UserRepository);
            userSocketToken2 = socketToken2;
      });

      beforeEach(async () => {
            client1 = await io(`http://localhost:${port}/${namespace}`, {
                  autoConnect: false,
                  transportOptions: {
                        polling: {
                              extraHeaders: {
                                    Cookie: `io-token=${userSocketToken1};`,
                              },
                        },
                  },
            });
            client2 = await io(`http://localhost:${port}/${namespace}`, {
                  autoConnect: false,
                  transportOptions: {
                        polling: {
                              extraHeaders: {
                                    Cookie: `io-token=${userSocketToken2};`,
                              },
                        },
                  },
            });
      });

      afterEach(async () => {
            await client1.disconnect();
            await client2.disconnect();
      });

      describe('', () => {
            beforeAll(async () => {
                  const notification1 = new Notification();
                  const notification2 = new Notification();
                  await notificationRepository.save(notification1);
                  await notificationRepository.save(notification2);

                  user.notifications = [notification1, notification2];
                  await userRepository.save(user);
            });

            beforeEach(async () => {
                  await client1.connect();
            });

            it('Pass', async (done) => {
                  client1.on('update-notifications', (data) => {
                        expect(data).toHaveLength(2);
                        done();
                  });
                  client1.emit('update-notifications', {});
            });
            afterAll(async () => {
                  user.notifications = [];
                  await userRepository.save(user);
            });
      });

      describe('', () => {
            beforeEach(async () => {
                  await client1.connect();
                  await client2.connect();
            });

            it('Pass', async (done) => {
                  client1.on('new-notification', () => {
                        expect(1 + 1).toBeUndefined();
                  });

                  client1.on('send-notification', async (data) => {
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

      afterAll(async () => {
            await userRepository.createQueryBuilder().delete().execute();
            await notificationRepository.createQueryBuilder().delete().execute();

            await app.close();
      });
});
