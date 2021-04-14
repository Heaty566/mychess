import { Injectable } from '@nestjs/common';

import { UserRepository } from './entities/user.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
      constructor(private userRepository: UserRepository) {}

      async getCurrentUser(userId: string) {
            const result = await this.userRepository
                  .createQueryBuilder()
                  .select('id, username, name, avatarUrl, createDate, elo, email, phoneNumber')
                  .where('id = :id', { id: userId })
                  .execute();
            return result[0];
      }

      async findOneUserByField(field: keyof User, value: any) {
            return await this.userRepository.findOneByField(field, value);
      }

      async getOneUserByField(field: keyof User, value: any) {
            return await this.userRepository.getUserByField(field, value);
      }

      async saveUser(input: User): Promise<User> {
            return await this.userRepository.save(input);
      }

      async searchUsersByName(name: string, pageSize = 12, currentPage = 0) {
            return await this.userRepository
                  .createQueryBuilder()
                  .select('id, username, name, avatarUrl, createDate, elo')
                  .where('name like :name ', { name: `%${name}%` })
                  .take(pageSize)
                  .skip(currentPage * pageSize)
                  .execute();
      }
}
