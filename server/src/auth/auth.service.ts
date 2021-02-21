import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/entities/user.repository';
import { RegisterUserDTO } from './dto/register.dto';

@Injectable()
export class AuthService {
      constructor(private readonly userRepository: UserRepository) {}

      async createUser(input: RegisterUserDTO) {
            return await this.userRepository.save(input);
      }
}
