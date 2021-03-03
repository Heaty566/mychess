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

      async createOTPRedisKey(user: User, expired: number) {
            const redisKey = String(new ObjectId());
            await this.redisService.setObjectByKey(redisKey, user, expired);
            return redisKey;
      }

      private async createAuthToken(user: User) {
            const encryptUser = this.encryptToken(user);
            const authTokenId = new ObjectId();

            this.redisService.setByValue(String(authTokenId), encryptUser, 0.2);
            return String(authTokenId);
      }

      async createReToken(data: User) {
            const authTokenId = await this.createAuthToken(data);
            const reToken = new ReToken();
            reToken.data = authTokenId;
            reToken.userId = data._id;
            await this.reTokenRepository.delete({ userId: data._id });
            const insertedReToken = await this.reTokenRepository.save(reToken);

            return String(insertedReToken._id);
      }

      async getAuthTokenFromReToken(refreshToken: string) {
            const reToken = await this.reTokenRepository.findOneByField('_id', refreshToken);
            if (!reToken) return null;

            const isStillExit = await this.redisService.getByKey(reToken.data);
            if (!isStillExit) {
                  const user = await this.userRepository.findOneByField('_id', reToken.userId);
                  const newReToken = await this.createAuthToken(user);
                  reToken.data = newReToken;
                  const updateReToken = await this.reTokenRepository.save(reToken);
                  return updateReToken.data;
            }

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

      private generateOtp(length: number) {
            let result = '';
            const characters = '0123456789';
            const charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
                  result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
      }

      generateKeyForSms(user: User, expired: number) {
            const otpKey = this.generateOtp(6);
            this.redisService.setObjectByKey(otpKey, user, expired);
            return otpKey;
      }
}
