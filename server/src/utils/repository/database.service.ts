import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { exec } from 'child_process';
import * as fs from 'fs';

//Service
import { LoggerService } from '../logger/logger.service';
import { AwsService } from '../../providers/aws/aws.service';

@Injectable()
export class DatabaseService {
      constructor(private readonly logger: LoggerService, private readonly awsService: AwsService) {}

      @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
      cronBackupDatabase(filename = 'backup') {
            exec(` mysqldump -u ${process.env.DB_USERNAME} -p${process.env.DB_PASSWORD} ${process.env.DB_NAME} > ${filename}.sql`, (err) => {
                  if (err) this.logger.print('Create a backup database failed', 'database.service.ts', 'error');
                  this.logger.print(`Create a backup database in ${new Date()}`, 'database.service.ts', 'info');

                  fs.readFile(`${filename}.sql`, async (err, data) => {
                        if (err) {
                              this.logger.print('Read a backup database failed', 'database.service.ts', 'error');
                              return;
                        }

                        const fileName = `${Date.now()}-${filename}`;

                        const databaseFile: Express.Multer.File = {
                              buffer: data,
                              originalname: fileName,
                              fieldname: filename,
                              mimetype: 'application/x-sql',
                              encoding: '7bit',
                              destination: '',
                              filename: fileName,
                              path: './',
                              size: null,
                              stream: null,
                        };

                        await this.awsService.uploadFile(databaseFile, 'database', 'system');
                        this.logger.print(`Upload to aws backup database in ${new Date()}`, 'database.service.ts', 'info');
                  });
            });
      }
}
