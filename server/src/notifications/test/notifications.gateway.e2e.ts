import { INestApplication } from '@nestjs/common';
import { NotificationAction } from '../notifications.action';

//---- Helper
import { getIoClient, fakeData } from '../../test/test.helper';
import { initTestModule } from '../../test/initTest';

//---- Entity
import { Notification } from '../entities/notification.entity';
import { User } from '../../user/entities/user.entity';

//---- Repository
import { UserRepository } from '../../user/entities/user.repository';
import { NotificationType } from '../entities/notification.type.enum';
import { SendNotificationDto } from '../dto/sendNotificationDto';
import { SocketServerResponse } from '../../app/interface/socketResponse';

describe('NotificationsGateWay', () => {
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

      describe(NotificationAction.NOTIFICATIONS_CONNECTION, () => {
            beforeEach(async () => {
                  await client1.connect();
            });

            it('Pass', async (done) => {
                  client1.on(NotificationAction.NOTIFICATIONS_CONNECTION, (data) => {
                        expect(data).toBeDefined();
                        expect(data.statusCode).toBe(200);
                        done();
                  });
                  client1.emit(NotificationAction.NOTIFICATIONS_CONNECTION, {});
            });
      });

      describe(NotificationAction.NOTIFICATIONS_SEND, () => {
            beforeEach(async () => {
                  await client1.connect();
                  await client2.connect();
            });

            it('Pass', async (done) => {
                  const input: SendNotificationDto = {
                        notificationType: NotificationType.CONNECT,
                        receiver: user2.id,
                        link: '/',
                  };

                  client2.on(NotificationAction.NOTIFICATIONS_NEW, async (data) => {
                        const result = await userRepository
                              .createQueryBuilder('user')
                              .leftJoinAndSelect('user.notifications', 'notification')
                              .where(`user.id = :id`, { id: user2.id })
                              .getOne();

                        expect(result.notifications[0].sender).toEqual(user1.id);
                        expect(data.statusCode).toBe(200);
                        done();
                  });

                  client1.on(NotificationAction.NOTIFICATIONS_SEND, (data) => {
                        expect(data.statusCode).toBe(200);
                  });

                  client2.emit(NotificationAction.NOTIFICATIONS_CONNECTION, {});
                  client1.emit(NotificationAction.NOTIFICATIONS_SEND, input);
            });

            it('Failed (user-not-found)', async (done) => {
                  const input: SendNotificationDto = {
                        notificationType: NotificationType.CONNECT,
                        receiver: fakeData(10, 'lettersAndNumbers'),
                        link: '/',
                  };

                  client1.on('exception', (data: SocketServerResponse<null>) => {
                        expect(data).toBeDefined();
                        expect(data.details).toBeDefined();
                        expect(data.statusCode).toBe(404);
                        done();
                  });

                  client2.emit(NotificationAction.NOTIFICATIONS_CONNECTION, {});
                  client1.emit(NotificationAction.NOTIFICATIONS_SEND, input);
            });
      });

      describe(NotificationAction.NOTIFICATIONS_GET, () => {
            beforeAll(async () => {
                  const notification1 = new Notification(NotificationType.CONNECT, user2.id);
                  const notification2 = new Notification(NotificationType.CONNECT, user2.id);

                  user1.notifications = [notification1, notification2];
                  await userRepository.save(user1);
            });

            beforeEach(async () => {
                  await client1.connect();
            });

            it('Pass', async (done) => {
                  client1.on(NotificationAction.NOTIFICATIONS_GET, (data) => {
                        expect(data).toHaveLength(2);
                        done();
                  });
                  client1.emit(NotificationAction.NOTIFICATIONS_GET, {});
            });
      });

      afterAll(async () => {
            await resetDB();
            await app.close();
      });
});
