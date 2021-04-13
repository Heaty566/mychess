import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { SmailModule } from '../providers/smail/smail.module';
import { UserRepository } from '../users/entities/user.repository';

@Module({
      imports: [TypeOrmModule.forFeature([UserRepository]), SmailModule],
      controllers: [CommonController],
      providers: [CommonService],
})
export class CommonModule {}
