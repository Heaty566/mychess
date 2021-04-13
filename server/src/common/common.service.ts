import { Injectable } from '@nestjs/common';

import { UserRepository } from '../users/entities/user.repository';

@Injectable()
export class CommonService {
      constructor(private userRepository: UserRepository) {}

      async getAllUsers() {
            return await this.userRepository.getAllUsers();
      }
}
