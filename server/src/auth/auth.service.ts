import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { UserRepository } from '../user/entities/user.repository';

import { ReTokenRepository } from './entities/re-token.repository';
import * as bcrypt from 'bcrypt';
import { ReToken } from './entities/re-token.entity';
import { RedisService } from '../utils/redis/redis.service';
import { ObjectId } from 'mongodb';

@Injectable()
export class AuthService {
      constructor(
            private readonly userRepository: UserRepository,
            private readonly reTokenRepository: ReTokenRepository,
            private readonly jwtService: JwtService,
            private readonly redisService: RedisService,
      ) {}

      private async createAuthToken(user: User) {
            const encryptUser = this.encryptToken(user);
            const authTokenId = new ObjectId();

            this.redisService.setByValue(String(authTokenId), encryptUser, 5);
            return String(authTokenId);
      }

      async createReToken(data: User) {
            const authTokenId = await this.createAuthToken(data);
            const reToken = new ReToken();
            reToken.data = authTokenId;
            const insertedReToken = await this.reTokenRepository.save(reToken);

            return String(insertedReToken._id);
      }

      async getAuthTokenFromReToken(refreshToken: string) {
            const reToken = await this.reTokenRepository.findOneByField('_id', refreshToken);
            if (!reToken) return null;

            return reToken.data;
      }

      async getDataFromAuthToken(authTokenId: string) {
            const authToken = await this.redisService.getByKey(authTokenId);
            if (!authToken) return null;

            return await this.decodeToken<User>(authToken);
      }

      encryptToken(tokenData: Record<any, any>) {
            return this.jwtService.sign(JSON.stringify(tokenData));
      }

      decodeToken<T>(tokenData: string) {
            return this.jwtService.decode(tokenData) as T;
      }

      async registerUser(input: User): Promise<User> {
            return await this.userRepository.save(input);
      }

      async hash(data: string): Promise<string> {
            return await bcrypt.hash(data, 5);
      }

      async comparePassword(data: string, encryptedPassword: string): Promise<boolean> {
            return bcrypt.compare(data, encryptedPassword);
      }
}
