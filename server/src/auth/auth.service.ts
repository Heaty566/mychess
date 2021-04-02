import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ObjectId } from 'mongodb';
import * as bcrypt from 'bcrypt';

import { UserRepository } from '../models/users/entities/user.repository';
import { ReTokenRepository } from './entities/re-token.repository';
import { User } from '../models/users/entities/user.entity';
import { ReToken } from './entities/re-token.entity';
import { RedisService } from '../providers/redis/redis.service';

@Injectable()
export class AuthService {
      constructor(
            private readonly userRepository: UserRepository,
            private readonly reTokenRepository: ReTokenRepository,
            private readonly jwtService: JwtService,
            private readonly redisService: RedisService,
      ) {}

      //-------------------------------OTP Service --------------------------------------

      private generateOtpKey(length: number, type: 'sms' | 'email') {
            const pattern = {
                  sms: '0123456789',
                  email: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
            };

            let result = '';
            const characters = pattern[type];
            const charactersLength = pattern[type].length;
            for (let i = 0; i < length; i++) {
                  result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
      }

      generateOTP(user: User, expired: number, type: 'sms' | 'email') {
            const otpKey = this.generateOtpKey(type === 'email' ? 50 : 6, type);
            this.redisService.setObjectByKey(otpKey, user, expired);
            return otpKey;
      }

      //-------------------------------Token Service --------------------------------------

      async createReToken(data: User) {
            const authTokenId = await this.createAuthToken(data);
            const reToken = new ReToken();
            reToken.data = authTokenId;
            reToken.userId = data._id;
            await this.reTokenRepository.delete({ userId: data._id });
            const insertedReToken = await this.reTokenRepository.save(reToken);

            return String(insertedReToken._id);
      }

      private async createAuthToken(user: User) {
            const encryptUser = this.encryptToken(user);
            const authTokenId = new ObjectId();

            this.redisService.setByValue(String(authTokenId), encryptUser, 0.2);
            return String(authTokenId);
      }

      async getAuthTokenByReToken(reTokenId: string) {
            const reToken = await this.reTokenRepository.findOneByField('_id', reTokenId);
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

      async getUserByAuthToken(authTokenId: string) {
            const authToken = await this.redisService.getByKey(authTokenId);
            if (!authToken) return null;

            return await this.decodeToken<User>(authToken);
      }

      async clearToken(userId: string | ObjectId) {
            return await this.reTokenRepository.delete({ userId: new ObjectId(userId) });
      }

      //--------------------------------Encrypt Decrypt Service -------------------------------

      encryptToken(tokenData: Record<any, any>) {
            return this.jwtService.sign(JSON.stringify(tokenData));
      }

      decodeToken<T>(tokenData: string) {
            return this.jwtService.decode(tokenData) as T;
      }

      async encryptString(data: string): Promise<string> {
            return await bcrypt.hash(data, 5);
      }

      async decryptString(data: string, encryptedPassword: string): Promise<boolean> {
            return bcrypt.compare(data, encryptedPassword);
      }
}
