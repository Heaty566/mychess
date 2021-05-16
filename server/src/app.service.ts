import { BeforeApplicationShutdown, Injectable } from '@nestjs/common';

//---- Service
import { DatabaseService } from './utils/repository/database.service';

@Injectable()
export class AppService implements BeforeApplicationShutdown {
      constructor(private readonly databaseService: DatabaseService) {}

      async beforeApplicationShutdown() {
            //save database
            if (process.env.NODE_ENV === 'production') await this.databaseService.cronBackupDatabase('shut-down-server');
      }
}
