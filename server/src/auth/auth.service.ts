import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { UserRepository } from '../user/entities/user.repository';
import { sign } from "jsonwebtoken";
import { AuthTokenRepository } from './entities/authToken.repository';
import { AuthToken } from './entities/authToken.entity';
import { RefreshTokenRepository } from './entities/refreshToken.repository';
import { RefreshToken } from './entities/refreshToken.entity';

@Injectable()
export class AuthService {
      constructor(private userRepository: UserRepository,
            private authTokenRepository: AuthTokenRepository,
            private refreshTokenRepository: RefreshTokenRepository
      ) { }

      async registerUser(input: User): Promise<User> {
            return await this.userRepository.save(input);
      }

      createToken(tokenData: object) {
            return sign(tokenData, process.env.JWT_SECRET_KEY)
      }

      async saveAuthToken(input: AuthToken): Promise<AuthToken> {
            return await this.authTokenRepository.save(input);
      }

      async saveRefreshToken(input: RefreshToken): Promise<RefreshToken> {
            return await this.refreshTokenRepository.save(input);
      }
}
