import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { exec } from 'child_process';
import * as fs from 'fs';

import { LoggerService } from '../logger/logger.service';
import { AwsService } from '../../providers/aws/aws.service';

@Injectable()
export class DatabaseService {
      constructor(private readonly logger: LoggerService, private readonly awsService: AwsService) {}

      @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
      handleCron() {
            const path = `${__dirname}/backup.sql`;
            exec(` mysqldump -u ${process.env.DB_USERNAME} -p${process.env.DB_PASSWORD} ${process.env.DB_NAME} > ${path}`, (err) => {
                  if (err) this.logger.print('Create a backup database failed', 'error');
                  this.logger.print(`Create a backup database in ${new Date()}`, 'info');

                  fs.readFile(path, async (err, data) => {
                        if (err) {
                              this.logger.print('Read a backup database failed', 'error');
                              return;
                        }

                        const fileName = `backup-${Date.now()}.sql`;
                        const databaseFile: Express.Multer.File = {
                              buffer: data,
                              originalname: fileName,
                              fieldname: 'backup',
                              mimetype: 'application/x-sql',
                              encoding: '7bit',
                              destination: '',
                              filename: fileName,
                              path: './',
                              size: null,
                              stream: null,
                        };

                        await this.awsService.uploadFile(databaseFile, 'database', 'system');
                        this.logger.print(`Upload to aws backup database in ${new Date()}`, 'info');
                  });
            });
      }
}
