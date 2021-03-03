import { Injectable } from '@nestjs/common';
import User from './entities/user.entity';
import { UserRepository } from './entities/user.repository';
import { UserRole } from './entities/user.userRole.enum';

@Injectable()
export class AdminService {
      constructor(private readonly userRepository: UserRepository) {}

      async changeUserRole(user: User, userRole: UserRole) {
            user.role = userRole;
            const updateUser = await this.userRepository.save(user);
            return updateUser;
      }

      async toggleUserStatus(user: User, newStatus: boolean) {
            user.isDisabled = newStatus;
            const updateUser = await this.userRepository.save(user);
            return updateUser;
      }
      async updateOneUserField(user: User, field: keyof User, value: any) {
            user[`${field}`] = value;
            const updateUser = await this.userRepository.save(user);
            return updateUser;
      }

      async getAllUsers() {
            return await this.userRepository.find();
      }
}
