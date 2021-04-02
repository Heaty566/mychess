import { Module } from '@nestjs/common';
import { config, S3 } from 'aws-sdk';
import { LoggerModule } from '../../utils/logger/logger.module';
//* Internal import
import { AwsService } from './aws.service';

@Module({
      imports: [LoggerModule],
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
      exports: [AwsService],
})
export class AwsModule {}
