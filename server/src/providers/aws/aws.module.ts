import { Module } from '@nestjs/common';
import { S3, config, Credentials } from 'aws-sdk';

//---- Utils
import { LoggerModule } from '../../utils/logger/logger.module';

//---- Service
import { AwsService } from './aws.service';

@Module({
      imports: [LoggerModule],
      providers: [
            AwsService,
            {
                  provide: S3,
                  useFactory: () => {
                        const credentials = new Credentials({
                              accessKeyId: process.env.AWS_ACCESS_KEY,
                              secretAccessKey: process.env.AWS_SECRET_KEY,
                        });
                        config.update({
                              credentials,
                        });

                        return new S3();
                  },
            },
      ],
      exports: [AwsService],
})
export class AwsModule {}
