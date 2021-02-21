import { Injectable } from '@nestjs/common';
import { RegisterUserDTO } from './dto/register.dto';
import { User } from '../user/entities/user.entity';
import { UserRepository } from '../user/entities/user.repository';

@Injectable()
export class AuthService {
      constructor(private userRepository: UserRepository) {}

      async registerUser(input: User): Promise<User> {
            return await this.userRepository.save(input);
      }
}
