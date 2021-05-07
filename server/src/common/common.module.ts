import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

//---- Service
import { CommonService } from './common.service';

//---- Controller
import { CommonController } from './common.controller';

//---- Provider
import { SmailModule } from '../providers/smail/smail.module';

//---- Repository
import { UserRepository } from '../user/entities/user.repository';

@Module({
      imports: [TypeOrmModule.forFeature([UserRepository]), SmailModule],
      controllers: [CommonController],
      providers: [CommonService],
})
export class CommonModule {}
