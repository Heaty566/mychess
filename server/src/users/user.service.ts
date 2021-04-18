import { Injectable } from '@nestjs/common';

//---- Repository
import { UserRepository } from './entities/user.repository';

//---- Entity
import { User } from './entities/user.entity';

//---- DTO
import { UserCustomDTO } from './dto/userCustom.dto';

@Injectable()
export class UserService {
      constructor(private userRepository: UserRepository) {}

      async findOneUserWithoutSomeSensitiveFields(field: keyof User, value: any) {
            const userDB = await this.userRepository.findOneByField(field, value);
            if (!userDB) return userDB;
            return new UserCustomDTO(userDB);
      }

      async findOneUserByField(field: keyof User, value: any) {
            return await this.userRepository.findOneByField(field, value);
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

      randomAvatar() {
            const defaultAvatar: string[] = [
                  'https://my-quiz-v2.s3-ap-southeast-1.amazonaws.com/system/share/default-avatar-bishop.png',
                  'https://my-quiz-v2.s3-ap-southeast-1.amazonaws.com/system/share/default-avatar-king.png',
                  'https://my-quiz-v2.s3-ap-southeast-1.amazonaws.com/system/share/default-avatar-pawn.png',
                  'https://my-quiz-v2.s3-ap-southeast-1.amazonaws.com/system/share/default-avatar-queen.png',
                  'https://my-quiz-v2.s3-ap-southeast-1.amazonaws.com/system/share/default-avatar-rook.png',
                  'https://my-quiz-v2.s3-ap-southeast-1.amazonaws.com/system/share/default-avatar-knight.png',
            ];
            const randomNumber: number = Math.floor(Math.random() * (5 - 0 + 1)) + 0; // generate random 0->5
            return defaultAvatar[randomNumber];
      }
}
