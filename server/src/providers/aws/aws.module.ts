import { Module } from '@nestjs/common';
import { config, S3 } from 'aws-sdk';
//* Internal import
import { AwsService } from './aws.service';

@Module({
      controllers: [],
      providers: [
            AwsService,
            {
                  provide: S3,
                  useFactory: () => {
                        config.update({
                              accessKeyId: process.env.AWS_KEY_ID,
                              secretAccessKey: process.env.AWS_SECRET_KEY,
                        });
                        return new S3();
                  },
            },
      ],
      exports: [AwsService, S3],
})
export class AwsModule {}