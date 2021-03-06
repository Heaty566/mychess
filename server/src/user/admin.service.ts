import { Injectable } from '@nestjs/common';
import { LoggerService } from '../utils/logger/logger.service';
import User from './entities/user.entity';
import { UserRepository } from './entities/user.repository';
import { UserRole } from './entities/user.userRole.enum';

@Injectable()
export class AdminService {
      constructor(private readonly userRepository: UserRepository, private logger: LoggerService) {}

      async toggleUserRole(user: User) {
            user.role = user.role === UserRole.USER ? UserRole.ADMIN : UserRole.USER;
            const updateUser = await this.userRepository.save(user);
            this.logger.print(`User with Id ${updateUser._id} has changed role to: ${updateUser.role}`, 'info');

            return updateUser;
      }

      async toggleUserStatus(user: User) {
            user.isDisabled = !user.isDisabled;
            const updateUser = await this.userRepository.save(user);
            this.logger.print(`User with Id ${updateUser._id} has changed status to: ${updateUser.role}`, 'info');
            return updateUser;
      }

      async getAllUsers() {
            return await this.userRepository.find();
      }
}
