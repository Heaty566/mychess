import { Injectable } from '@nestjs/common';
import User from './entities/user.entity';
import { UserRepository } from './entities/user.repository';
import { UserRole } from './entities/user.userRole.enum';

@Injectable()
export class AdminService {
      constructor(private readonly userRepository: UserRepository) {}

      async toggleUserRole(user: User) {
            user.role = user.role === UserRole.USER ? UserRole.ADMIN : UserRole.USER;
            const updateUser = await this.userRepository.save(user);
            return updateUser;
      }

      async toggleUserStatus(user: User) {
            user.isDisabled = !user.isDisabled;
            const updateUser = await this.userRepository.save(user);
            return updateUser;
      }

      async getAllUsers() {
            return await this.userRepository.find();
      }
}
