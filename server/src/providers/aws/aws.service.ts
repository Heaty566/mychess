import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

//----- Service
import { LoggerService } from '../../utils/logger/logger.service';

@Injectable()
export class AwsService {
      constructor(private readonly s3: S3, private readonly LoggerService: LoggerService) {}
      checkFileExtension(file: Express.Multer.File, extend: Array<string>) {
            const acceptTypes = [...extend];
            const fileType = path.extname(file.originalname).toLocaleLowerCase();

            return acceptTypes.includes(fileType);
      }

      checkFileSize(file: Express.Multer.File, limit: number) {
            const limitSize = limit * 1024 * 1024;
            return file.size < limitSize;
      }

      async uploadFile(file: Express.Multer.File, awsPath: string, prefix: 'user' | 'system') {
            const fileType = path.extname(file.originalname).toLocaleLowerCase();
            const id = uuidv4();

            const locationFile = `${prefix}/${awsPath}/${id}-${file.filename}${fileType}`;

            return await this.s3
                  .putObject({ Bucket: process.env.AWS_S3_BUCKET_NAME, Body: file.buffer, Key: locationFile, ContentType: file.mimetype })
                  .promise()
                  .then(() => {
                        return process.env.AWS_PREFIX + '/' + locationFile;
                  })
                  .catch((error) => {
                        this.LoggerService.print(error, 'aws.service.ts', 'error');
                        return null;
                  });
      }
}
