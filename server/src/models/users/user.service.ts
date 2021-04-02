import { Injectable } from '@nestjs/common';

import { UserRepository } from './entities/user.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
      constructor(private userRepository: UserRepository) {}

      async findOneUserByField(field: keyof User, value: any) {
            return await this.userRepository.findOneByField(field, value);
      }

      async getOneUserByField(field: keyof User, value: any) {
            return await this.userRepository.getUserByField(field, value);
      }

      async saveUser(input: User): Promise<User> {
            return await this.userRepository.save(input);
      }
}
