import { BeforeApplicationShutdown, Injectable } from '@nestjs/common';
import { DatabaseService } from './utils/repository/database.service';

//---- Service

//---- Repository

@Injectable()
export class AppService implements BeforeApplicationShutdown {
      constructor(private readonly databaseService: DatabaseService) {}

      async beforeApplicationShutdown() {
            //save database
            if (process.env.NODE_ENV === 'development') await this.databaseService.cronBackupDatabase('shut-down-server');
      }
}
