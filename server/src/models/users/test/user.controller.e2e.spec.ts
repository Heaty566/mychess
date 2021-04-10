let mockPromise = Promise.resolve();
class TwilioMock {
      constructor() {
            //
      }

      public messages = {
            create() {
                  return mockPromise;
            },
      };
}

import * as supertest from 'supertest';
import { INestApplication } from '@nestjs/common';

//* Internal import
import { fakeUser } from '../../../../test/fakeEntity';
import { UserRepository } from '../entities/user.repository';
import { initTestModule } from '../../../../test/initTest';
import { AuthService } from '../../../auth/auth.service';
import { RedisService } from '../../../providers/redis/redis.service';
import { UserService } from '../user.service';
import { SmailService } from '../../../providers/smail/smail.service';
import { AwsService } from '../../../providers/aws/aws.service';
import { User } from '../entities/user.entity';
import { fakeData } from '../../../../test/fakeData';
import { ChangePasswordDTO } from '../dto/changePassword.dto';
import { OtpSmsDTO } from '../../../auth/dto/otpSms.dto';
import { UpdateUserDto } from '../dto/updateBasicUser.dto';
import { UpdateEmailDTO } from '../dto/updateEmail.dto';
import { defuse } from '../../../../test/testHelper';
import { CreateNewRoomDTO } from '../dto/createNewRoom.dto';
import { Room } from '../../rooms/entities/room.entity';
import { RoomService } from '../../rooms/room.service';
import { JoinRoomDTO } from '../dto/joinRoom.dto';
import { RoomRepository } from '../../rooms/entities/room.repository';

jest.mock('twilio', () => {
      return {
            Twilio: TwilioMock,
      };
});

describe('UserController E2E', () => {
      let app: INestApplication;

      let userRepository: UserRepository;
      let roomRepository: RoomRepository;

      let authService: AuthService;
      let redisService: RedisService;
      let userService: UserService;
      let mailService: SmailService;
      let awsService: AwsService;
      let roomService: RoomService;

      let cookieData: Array<string>;
      let userDb: User;
      let roomDb: Room;

      beforeAll(async () => {
            const { getApp, module, cookie, getUser } = await initTestModule();
            app = getApp;
            userDb = getUser;
            cookieData = cookie;

            userRepository = module.get<UserRepository>(UserRepository);
            roomRepository = module.get<RoomRepository>(RoomRepository);
            roomService = module.get<RoomService>(RoomService);
            authService = module.get<AuthService>(AuthService);
            redisService = module.get<RedisService>(RedisService);
            userService = module.get<UserService>(UserService);
            mailService = module.get<SmailService>(SmailService);
            awsService = module.get<AwsService>(AwsService);
      });

      describe('GET /', () => {
            const reqApi = () => supertest(app.getHttpServer()).get('/api/user/').set({ cookie: cookieData }).send();

            it('Pass', async () => {
                  const res = await reqApi();
                  expect(res.body.data).toBeDefined();
            });
      });

      describe('create otp by user', () => {
            describe('POST /otp-sms', () => {
                  let otpSmsDTO: OtpSmsDTO;
                  const reqApi = (input: OtpSmsDTO) =>
                        supertest(app.getHttpServer()).post('/api/user/otp-sms').set({ cookie: cookieData }).send(input);

                  beforeEach(async () => {
                        otpSmsDTO = {
                              phoneNumber: userDb.phoneNumber,
                        };
                  });

                  it('Pass', async () => {
                        otpSmsDTO = {
                              phoneNumber: fakeData(10, 'number'),
                        };
                        const res = await reqApi(otpSmsDTO);
                        expect(res.status).toBe(201);
                  });

                  it('Failed (error of sms service)', async () => {
                        otpSmsDTO = {
                              phoneNumber: fakeData(10, 'number'),
                        };
                        mockPromise = defuse(new Promise((resolve, reject) => reject(new Error('Oops'))));
                        try {
                              await reqApi(otpSmsDTO);
                        } catch (err) {
                              expect(err.status).toBe(500);
                        }
                  });

                  it('Failed (phone number is already exist)', async () => {
                        const res = await reqApi(otpSmsDTO);
                        expect(res.status).toBe(400);
                  });
            });

            describe('POST /otp-email', () => {
                  let otpMail: UpdateEmailDTO;

                  const reqApi = (input: UpdateEmailDTO) =>
                        supertest(app.getHttpServer()).post('/api/user/otp-email').set({ cookie: cookieData }).send(input);

                  it('Failed (email is taken)', async () => {
                        otpMail = {
                              email: 'haicao2805@gmail.com',
                        };
                        const res = await reqApi(otpMail);
                        expect(res.status).toBe(400);
                  });

                  it('Pass', async () => {
                        otpMail = {
                              email: `heaty566ex@gmail.com`,
                        };
                        const res = await reqApi(otpMail);
                        expect(res.status).toBe(201);
                  });

                  it('Failed (error of smail)', async () => {
                        otpMail = {
                              email: `heaty566ex@gmail.com`,
                        };
                        const mySpy = jest.spyOn(mailService, 'sendOTPForUpdateEmail').mockImplementation(() => Promise.resolve(false));
                        try {
                              await reqApi(otpMail);
                        } catch (err) {
                              expect(err.status).toBe(500);
                        }
                        mySpy.mockClear();
                  });
            });
      });

      describe('update field of user', () => {
            describe('Put /api/user', () => {
                  let body: UpdateUserDto;
                  const reqApi = (body: UpdateUserDto) => supertest(app.getHttpServer()).put(`/api/user`).set({ cookie: cookieData }).send(body);

                  beforeEach(() => {
                        body = {
                              name: fakeData(10, 'letters'),
                        };
                  });

                  it('Pass', async () => {
                        const res = await reqApi(body);

                        const getUser = await userRepository.findOneByField('id', userDb.id);

                        expect(getUser.name.toLocaleLowerCase()).toBe(body.name.toLocaleLowerCase());
                        expect(getUser.username).toBe(userDb.username);
                        expect(res.status).toBe(200);
                  });
            });

            describe('Put /api/user/avatar', () => {
                  const reqApi = (input) =>
                        supertest(app.getHttpServer())
                              .put(`/api/user/avatar`)
                              .set({ cookie: cookieData })
                              .attach('avatar', `${__dirname}/../../../../test/testFile/${input}`);

                  it('Pass', async () => {
                        const awsSpy = jest.spyOn(awsService, 'uploadFile').mockImplementation(() => Promise.resolve(true));
                        const res = await reqApi('photo.png');
                        awsSpy.mockClear();
                        expect(res.status).toBe(200);
                  });
                  it('Failed file too large', async () => {
                        const res = await reqApi('4mb.png');

                        expect(res.status).toBe(400);
                  });
                  it('Failed miss avatar property', async () => {
                        const res = await supertest(app.getHttpServer()).put(`/api/user/avatar`).set({ cookie: cookieData }).send();

                        expect(res.status).toBe(400);
                  });
                  it('Failed wrong file extension', async () => {
                        const res = await reqApi('text.txt');

                        expect(res.status).toBe(400);
                  });
                  it('Failed wrong file extension', async () => {
                        const awsSpy = jest.spyOn(awsService, 'uploadFile').mockImplementation(() => Promise.resolve(false));
                        const res = await reqApi('photo.png');
                        awsSpy.mockClear();

                        expect(res.status).toBe(500);
                  });
            });

            describe('PUT /api/user/phone/:otp', () => {
                  let redisKey: string;
                  const reqApi = (redisKey) => supertest(app.getHttpServer()).put(`/api/user/phone/${redisKey}`).set({ cookie: cookieData }).send();

                  beforeAll(async () => {
                        redisKey = await authService.generateOTP(userDb, 2, 'sms');
                  });

                  it('Pass', async () => {
                        const beforeRedisKey = await redisService.getObjectByKey(redisKey);
                        const res = await reqApi(redisKey);
                        const afterRedisKey = await redisService.getObjectByKey(redisKey);
                        expect(res.status).toBe(200);
                        expect(beforeRedisKey).toBeDefined();
                        expect(afterRedisKey).toBeNull();
                  });

                  it('Failed redis key is used', async () => {
                        const res = await reqApi(redisKey);

                        expect(res.status).toBe(403);
                  });
                  it('Failed redis expired', async () => {
                        const res = await reqApi(123456);

                        expect(res.status).toBe(403);
                  });
            });
            describe('PUT /api/user/email/:otp', () => {
                  let redisKey: string;
                  const reqApi = (redisKey) => supertest(app.getHttpServer()).put(`/api/user/email/${redisKey}`).set({ cookie: cookieData }).send();

                  beforeAll(async () => {
                        redisKey = await authService.generateOTP(userDb, 2, 'email');
                  });

                  it('Pass', async () => {
                        const beforeRedisKey = await redisService.getObjectByKey(redisKey);
                        const res = await reqApi(redisKey);
                        const afterRedisKey = await redisService.getObjectByKey(redisKey);
                        expect(res.status).toBe(200);
                        expect(beforeRedisKey).toBeDefined();
                        expect(afterRedisKey).toBeNull();
                  });

                  it('Failed (redis key is used)', async () => {
                        const res = await reqApi(123456);

                        expect(res.status).toBe(403);
                  });

                  it('Failed (redis expired)', async () => {
                        const res = await reqApi(redisKey);

                        expect(res.status).toBe(403);
                  });
            });
            describe('PUT /api/user/password/:otp', () => {
                  let user: User;
                  let redisKey: string;
                  let body: ChangePasswordDTO;
                  const reqApi = (body, redisKey) => supertest(app.getHttpServer()).put(`/api/user/password/${redisKey}`).send(body);

                  beforeAll(async () => {
                        user = fakeUser();
                        user.email = 'heaty566@gmail.com';
                        await userService.saveUser(user);
                        redisKey = await authService.generateOTP(user, 2, 'email');
                        body = {
                              newPassword: 'Password123',
                              confirmNewPassword: 'Password123',
                        };
                  });

                  it('Pass', async () => {
                        const beforeRedisKey = await redisService.getObjectByKey(redisKey);
                        const res = await reqApi(body, redisKey);
                        const getUser = await userRepository.findOneByField('id', user.id);
                        const isMatch = await authService.decryptString(body.newPassword, getUser.password);
                        const afterRedisKey = await redisService.getObjectByKey(redisKey);
                        expect(res.status).toBe(200);
                        expect(beforeRedisKey).toBeDefined();
                        expect(afterRedisKey).toBeNull();
                        expect(isMatch).toBeTruthy();
                  });

                  it('Failed redis key is used', async () => {
                        const res = await reqApi(body, redisKey);

                        expect(res.status).toBe(403);
                  });
                  it('Failed redis expired', async () => {
                        const res = await reqApi(body, '123456');
                        expect(res.status).toBe(403);
                  });
            });
      });

      describe('user create or join room', () => {
            describe('Post /api/user/new-room', () => {
                  let body: CreateNewRoomDTO;
                  let user: User;
                  const reqApi = (input: CreateNewRoomDTO) =>
                        supertest(app.getHttpServer()).post('/api/user/new-room').set({ cookie: cookieData }).send(input);

                  beforeEach(async () => {
                        user = fakeUser();
                        await userService.saveUser(user);
                  });

                  it('Pass', async () => {
                        body = {
                              limitTime: 7,
                        };
                        const res = await reqApi(body);
                        expect(res.status).toBe(201);
                  });

                  it('Failed(user is already in a room)', async () => {
                        body = {
                              limitTime: 8,
                        };
                        roomDb = new Room();
                        roomDb.user1 = user;
                        await roomService.saveRoom(roomDb);
                        const res = await reqApi(body);
                        expect(res.status).toBe(400);
                  });

                  afterAll(async () => {
                        await roomRepository.createQueryBuilder().delete().execute();
                        await app.close();
                  });
            });

            describe('Post /api/user/join-room', () => {
                  let body: JoinRoomDTO;

                  const reqApi = (input: JoinRoomDTO) =>
                        supertest(app.getHttpServer()).post('/api/user/join-room').set({ cookie: cookieData }).send(input);

                  beforeEach(async () => {
                        roomDb = new Room();
                        await roomService.saveRoom(roomDb);
                  });

                  it('Failed(room is not exist)', async () => {
                        body = {
                              roomId: 'haideptraiNo1',
                        };
                        const res = await reqApi(body);
                        expect(res.status).toBe(400);
                  });

                  it('Failed(user in another room)', async () => {
                        roomDb.user1 = userDb;
                        await roomService.saveRoom(roomDb);

                        body = {
                              roomId: roomDb.id,
                        };
                        const res = await reqApi(body);
                        expect(res.status).toBe(400);
                        await roomRepository.createQueryBuilder().delete().execute();
                  });

                  it('Pass', async () => {
                        roomDb = new Room();
                        let userCreateRoom = fakeUser();
                        await userService.saveUser(userCreateRoom);
                        roomDb.user1 = userCreateRoom;
                        await roomService.saveRoom(roomDb);

                        body = {
                              roomId: roomDb.id,
                        };
                        const res = await reqApi(body);
                        expect(res.status).toBe(201);
                  });
            });
      });

      afterAll(async () => {
            await roomRepository.createQueryBuilder().delete().execute();
            await userRepository.createQueryBuilder().delete().execute();
            await app.close();
      });
});
