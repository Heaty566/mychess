import { INestApplication } from '@nestjs/common';
import * as fs from 'fs';
import * as childProcess from 'child_process';

//---- Helper
import { initTestModule } from '../../../test/initTest';

//---- Service
import { DatabaseService } from '../database.service';
import { AwsService } from '../../../providers/aws/aws.service';

describe('RepositoryService', () => {
      let app: INestApplication;
      let databaseService: DatabaseService;
      let awsService: AwsService;
      let childProcessCallback: (error) => void;
      let fsCallback: (error, data) => void;
      const fsMockFn = jest.fn((data, callback) => (fsCallback = callback));
      const childProcessMockFn = jest.fn((data, callback) => (childProcessCallback = callback));
      const awsFn = jest.fn();

      beforeAll(async () => {
            const { getApp, module } = await initTestModule();
            app = getApp;

            databaseService = module.get<DatabaseService>(DatabaseService);
            awsService = module.get<AwsService>(AwsService);

            const childProcessSpy = jest.spyOn(childProcess, 'exec');
            const fsSpy = jest.spyOn(fs, 'readFile');

            jest.spyOn(awsService, 'uploadFile').mockImplementation(awsFn);
            childProcessSpy.mockImplementation((childProcessMockFn as unknown) as jest.Mock<childProcess.ChildProcess>);
            fsSpy.mockImplementation((fsMockFn as unknown) as jest.Mock<childProcess.ChildProcess>);
      });

      beforeEach(() => {
            databaseService.cronBackupDatabase();
      });

      describe('cronBackupDatabase', () => {
            it('Failed exec error', async () => {
                  childProcessCallback(new Error('wrong'));
                  expect(awsFn).not.toBeCalled();
            });

            it('Failed readFile error', async () => {
                  childProcessCallback(null);
                  fsCallback(new Error('wrong'), null);
                  expect(awsFn).not.toBeCalled();
            });

            it('Pass', async () => {
                  childProcessCallback(null);

                  fsCallback(null, Buffer.from('ok'));
                  expect(awsFn).toBeCalled();
            });
      });

      afterAll(async () => {
            await app.close();
      });
});
