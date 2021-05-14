import { Module } from '@nestjs/common';

//---- Provider
import { AwsModule } from '../../providers/aws/aws.module';

//---- Utils
import { LoggerModule } from '../logger/logger.module';

//---- Service
import { DatabaseService } from './database.service';

@Module({
      imports: [LoggerModule, AwsModule],
      providers: [DatabaseService],
      exports: [DatabaseService],
})
export class RepositoryModule {}
