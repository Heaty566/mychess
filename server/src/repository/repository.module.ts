import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../user/entities/user.repository';
import { RepositoryService } from './repository.service';

@Module({
      imports: [TypeOrmModule.forFeature([UserRepository])],
      providers: [RepositoryService],
})
export class RepositoryModule {}
