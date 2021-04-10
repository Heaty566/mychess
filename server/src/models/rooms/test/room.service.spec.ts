import { INestApplication } from '@nestjs/common';
import { User } from '../../../models/users/entities/user.entity';
import { initTestModule } from '../../../../test/initTest';
import { Room } from '../entities/room.entity';
import { RoomRepository } from '../entities/room.repository';
import { RoomService } from '../room.service';
import { UserRepository } from '../../../models/users/entities/user.repository';

describe('RoomService', () => {
      let app: INestApplication;
      let userRepository: UserRepository;
      let roomRepository: RoomRepository;
      let roomService: RoomService;
      let roomDb: Room;
      let userDb: User;

      beforeAll(async () => {
            const { getApp, module, getUser, getRoom } = await initTestModule();
            app = getApp;
            userDb = getUser;
            roomDb = getRoom;
            roomService = module.get<RoomService>(RoomService);
            roomRepository = module.get<RoomRepository>(RoomRepository);
            userRepository = module.get<UserRepository>(UserRepository);
      });

      describe('saveRoom', () => {
            it('Pass', async () => {
                  const res = await roomService.saveRoom(roomDb);

                  expect(res).toBeDefined();
            });

            it('Pass(the same id', async () => {
                  await roomService.saveRoom(roomDb);
                  roomDb.result = 1;
                  await roomService.saveRoom(roomDb);
                  const res = await roomRepository.findOne({ result: 1 });

                  expect(res).toBeDefined();
                  expect(res.result).toBe(1);
            });
      });

      describe('getOneRoomByField', () => {
            it('Pass', async () => {
                  const res = await roomService.getOneRoomByField('id', roomDb.id);

                  expect(res).toBeDefined();
            });

            it('Failed(room does not exist', async () => {
                  const id = 'haideptraiNoOne';
                  const res = await roomService.getOneRoomByField('id', id);

                  expect(res).toBeUndefined();
            });
      });

      describe('getOneRoomByUserId', () => {
            it('Pass', async () => {
                  roomDb.user1 = userDb;
                  await roomService.saveRoom(roomDb);
                  const res = await roomService.getOneRoomByUserId(userDb.id);

                  expect(res).toBeDefined();
            });

            it('Failed (user not in room)', async () => {
                  roomDb.user1 = null;
                  await roomService.saveRoom(roomDb);
                  const res = await roomService.getOneRoomByUserId(userDb.id);

                  expect(res).toBeUndefined();
            });
      });

      afterAll(async () => {
            await roomRepository.createQueryBuilder().delete().execute();
            await userRepository.createQueryBuilder().delete().execute();
            await app.close();
      });
});
