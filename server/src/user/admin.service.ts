import { Injectable } from '@nestjs/common';

//---- Service
import { LoggerService } from '../utils/logger/logger.service';

//---- Repository
import { UserRepository } from './entities/user.repository';

//---- Entity
import { UserRole } from './entities/user.userRole.enum';
import { User } from './entities/user.entity';

@Injectable()
export class AdminService {
      constructor(private readonly userRepository: UserRepository, private logger: LoggerService) {}

      /**
       *
       * @description change user role to ADMIN or USER
       */
      async toggleUserRole(user: User) {
            user.role = user.role === UserRole.USER ? UserRole.ADMIN : UserRole.USER;
            const updateUser = await this.userRepository.save(user);
            this.logger.print(`User with Id ${updateUser.id} has changed role to: ${updateUser.role}`, 'admin.service.ts', 'info');

            return updateUser;
      }

      /**
       *
       * @description change user status is disable or not
       */
      async toggleUserStatus(user: User) {
            user.isDisabled = !user.isDisabled;
            const updateUser = await this.userRepository.save(user);
            this.logger.print(`User with Id ${updateUser.id} has changed status to: ${updateUser.role}`, 'admin.service.ts', 'info');
            return updateUser;
      }

      async getAllUsers() {
            const result = await this.userRepository.createQueryBuilder().getMany();

            return result;
      }
}
