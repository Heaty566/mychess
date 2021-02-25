import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ObjectId } from 'mongodb';
import { User } from 'src/user/entities/user.entity';
import { UserRepository } from '../user/entities/user.repository';
import { AuthToken } from './entities/authToken.entity';
import { AuthTokenRepository } from './entities/authToken.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
      constructor(private userRepository: UserRepository, private authTokenRepository: AuthTokenRepository, private jwt: JwtService) {}

      async getDataFromRefreshToken(refreshToken: string) {
            const decode = this.decodeToken(refreshToken);
            return await this.authTokenRepository.findOneByField('_id', decode['authTokenId']);
      }

      async getDataFromAuthToken(authToken: string) {
            return await this.authTokenRepository.findOneByField('_id', authToken);
      }

      createToken(tokenData: Record<any, any>) {
            return this.jwt.sign(tokenData);
      }

      decodeToken(tokenData: string) {
            return this.jwt.decode(tokenData);
      }

      async registerUser(input: User): Promise<User> {
            return await this.userRepository.save(input);
      }

      async saveAuthToken(input: AuthToken): Promise<AuthToken> {
            return await this.authTokenRepository.save(input);
      }

      async hash(data: string): Promise<string> {
            return await bcrypt.hash(data, 5);
      }

      async comparePassword(data: string, password: string): Promise<boolean> {
            return bcrypt.compare(data, password);
      }
}
