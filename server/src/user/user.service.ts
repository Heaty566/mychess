import { Injectable } from '@nestjs/common';

//---- Repository
import { UserRepository } from './entities/user.repository';

//---- Entity
import { User } from './entities/user.entity';

//---- DTO
import { UserCustomDTO } from './dto/userCustom.dto';

//---- Common
import { config } from '../config';

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
      async findManyUserByArrayField(field: keyof User, value: any[]) {
            return await this.userRepository.findManyByArrayValue(field, value);
      }

      async saveUser(input: User): Promise<User> {
            return await this.userRepository.save(input);
      }

      async searchUsersByNameAndCount(name: string, pageSize: number, currentPage: number) {
            const query = await this.userRepository
                  .createQueryBuilder()
                  .select('id, username, name, avatarUrl, createDate, elo')
                  .where('name like :name ', { name: `%${name}%` })
                  .skip(currentPage * pageSize)
                  .take(pageSize);

            const users = await query.getRawMany();
            const count = await query.getCount();

            return { users, count };
      }

      randomAvatar() {
            const defaultAvatar = config.userService.avatarDefaultImages;
            const randomNumber: number = Math.floor(Math.random() * (5 - 0 + 1)) + 0; // generate random 0->5
            return defaultAvatar[randomNumber];
      }
}
