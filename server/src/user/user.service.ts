import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserRepository } from './entities/user.repository';

@Injectable()
export class UserService {
      constructor(private userRepository: UserRepository) {}

      async findOneUserByField(field: keyof User, value: any) {
            return await this.userRepository.getByField(field, value);
      }
}
