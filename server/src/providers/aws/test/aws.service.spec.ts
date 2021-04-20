import { INestApplication } from '@nestjs/common';
import { Buffer } from 'buffer';
import { Readable } from 'stream';

//---- Helper
import { initTestModule } from '../../../test/initTest';

//---- Service
import { AwsService } from '../aws.service';

const mockS3Object = jest.fn();
jest.mock('aws-sdk', () => {
      return {
            ...jest.requireActual('aws-sdk'),
            config: {
                  update: jest.fn(),
            },
            S3: jest.fn(() => ({ putObject: mockS3Object })),
      };
});

describe('TokenService', () => {
      let app: INestApplication;
      let awsService: AwsService;
      beforeAll(async () => {
            const { getApp, module } = await initTestModule();
            app = getApp;
            awsService = module.get<AwsService>(AwsService);
      });

      describe('checkFileExtension', () => {
            let file: Express.Multer.File;
            const readable = new Readable();
            beforeEach(() => {
                  file = {
                        buffer: Buffer.from('ok'),
                        originalname: 'hello.png',
                        fieldname: 'file',
                        encoding: '7bit',
                        mimetype: 'image/jpeg',
                        size: 593518,
                        destination: '',
                        filename: '',
                        path: '',
                        stream: readable,
                  };
            });

            it('Pass', () => {
                  const isCorrect = awsService.checkFileExtension(file, ['.jpeg', '.jpg', '.png', '.bmp']);

                  expect(isCorrect).toBeTruthy();
            });

            it('Pass with extension', () => {
                  file.originalname = 'test.txt';
                  const isCorrect = awsService.checkFileExtension(file, ['.txt']);

                  expect(isCorrect).toBeTruthy();
            });

            it('Failed', () => {
                  file.originalname = 'test.txt';
                  const isCorrect = awsService.checkFileExtension(file, ['.jpeg', '.jpg', '.png', '.bmp']);

                  expect(isCorrect).toBeFalsy();
            });

            it('Failed no file', () => {
                  file.originalname = 'test';
                  const isCorrect = awsService.checkFileExtension(file, ['.jpeg', '.jpg', '.png', '.bmp']);

                  expect(isCorrect).toBeFalsy();
            });
      });

      describe('checkFileSize', () => {
            let file: Express.Multer.File;
            const readable = new Readable();
            beforeEach(() => {
                  file = {
                        buffer: Buffer.from('ok'),
                        originalname: 'hello.png',
                        fieldname: 'file',
                        encoding: '7bit',
                        mimetype: 'image/jpeg',
                        size: 593518,
                        destination: '',
                        filename: '',
                        path: '',
                        stream: readable,
                  };
            });

            it('Pass', () => {
                  const isCorrect = awsService.checkFileSize(file, 1);

                  expect(isCorrect).toBeTruthy();
            });

            it('Failed', () => {
                  const isCorrect = awsService.checkFileSize(file, 0.5);

                  expect(isCorrect).toBeFalsy();
            });
      });

      describe('uploadFile', () => {
            let file: Express.Multer.File;
            const readable = new Readable();
            beforeEach(() => {
                  file = {
                        buffer: Buffer.from('ok'),
                        originalname: 'hello.png',
                        fieldname: 'file',
                        encoding: '7bit',
                        mimetype: 'image/jpeg',
                        size: 593518,
                        destination: '',
                        filename: '',
                        path: '',
                        stream: readable,
                  };
            });

            it('Pass', async () => {
                  mockS3Object.mockImplementation(() => {
                        return {
                              promise() {
                                    return Promise.resolve();
                              },
                        };
                  });
                  const fileName = await awsService.uploadFile(file, '123', 'user');
                  expect(fileName).toBeDefined();
                  expect(fileName).toContain('.png');
            });

            it('Failed', async () => {
                  mockS3Object.mockImplementation(() => {
                        return {
                              promise() {
                                    return Promise.reject();
                              },
                        };
                  });
                  const fileName = await awsService.uploadFile(file, '123', 'user');

                  expect(fileName).toBeNull();
            });
      });

      afterAll(async () => {
            await app.close();
      });
});
