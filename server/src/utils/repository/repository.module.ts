import { Module } from '@nestjs/common';
import { AwsModule } from '../../providers/aws/aws.module';
import { LoggerModule } from '../logger/logger.module';
import { DatabaseService } from './database.service';

@Module({
      imports: [LoggerModule, AwsModule],
      providers: [DatabaseService],
      exports: [],
})
export class RepositoryModule {}
