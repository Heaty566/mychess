import { Injectable } from '@nestjs/common';
import { RegisterUserDTO } from 'src/user/dto/register.dto';
import { User } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/entities/user.repository';
import { ObjectId } from "mongodb";

@Injectable()
export class AuthService {
    constructor(private userRepository: UserRepository) { }

    async registerUser(input: RegisterUserDTO) {
        return await this.userRepository.save(input);
    }

    async findOneUserByField(field: keyof User, value: any) {
        if (field === "_id" && typeof value === "string")
            return await this.userRepository.findOne({ _id: new ObjectId(value) });

        return await this.userRepository.findOne({ [field]: value });
    }
}
