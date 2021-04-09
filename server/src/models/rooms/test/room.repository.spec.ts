import { INestApplication } from '@nestjs/common';
import User from '../../../models/users/entities/user.entity';
import { initTestModule } from '../../../../test/initTest';
import Room from '../entities/room.entity';
import { RoomRepository } from '../entities/room.repository';
import { UserRepository } from '../../../models/users/entities/user.repository';

describe('RoomRepository', () => {
      let app: INestApplication;
      let roomRepository: RoomRepository;
      let userRepository: UserRepository;
      let roomDb: Room;
      let userDb: User;

      beforeAll(async () => {
            const { getApp, module, getUser, getRoom } = await initTestModule();
            app = getApp;
            userDb = getUser;
            roomDb = getRoom;
            roomRepository = module.get<RoomRepository>(RoomRepository);
            userRepository = module.get<UserRepository>(UserRepository);
      });

      describe('getRoomByField', () => {
            it('Pass', async () => {
                  const res = await roomRepository.getRoomByField('id', roomDb.id);
                  expect(res).toBeDefined();
                  expect(res.id).toBe(roomDb.id);
            });
      });

      describe('getRoomByUserId', () => {
            it('Pass', async () => {
                  roomDb.user1 = userDb;
                  await roomRepository.save(roomDb);
                  const res = await roomRepository.getRoomByUserId(userDb.id);
                  expect(res).toBeDefined();
            });
      });

      afterAll(async () => {
            await roomRepository.createQueryBuilder().delete().execute();
            await userRepository.createQueryBuilder().delete().execute();
            await app.close();
      });
});
