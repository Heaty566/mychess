import { Injectable } from '@nestjs/common';

//---- Repository
import { UserRepository } from '../user/entities/user.repository';

@Injectable()
export class CommonService {
      constructor(private userRepository: UserRepository) {}
}
