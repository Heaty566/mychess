import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

//---- Service
import { RedisService } from '../utils/redis/redis.service';

//---- Entity
import { User } from '../user/entities/user.entity';
import { ReToken } from './entities/re-token.entity';

//---- Repository
import { UserRepository } from '../user/entities/user.repository';
import { ReTokenRepository } from './entities/re-token.repository';

//---- Helper
import { generatorString } from '../app/helpers/stringGenerator';

@Injectable()
export class AuthService {
      constructor(
            private readonly userRepository: UserRepository,
            private readonly reTokenRepository: ReTokenRepository,
            private readonly jwtService: JwtService,
            private readonly redisService: RedisService,
      ) {}

      //-------------------------------OTP Service --------------------------------------

      createOTP(user: User, expired: number, type: 'sms' | 'email') {
            const otpKey = generatorString(type === 'email' ? 50 : 6, type === 'email' ? 'lettersLowerCase' : 'number');

            this.redisService.setObjectByKey(otpKey, user, expired);
            return otpKey;
      }

      async isRateLimitKey(key: string, maxSent: number, expiredTime: number) {
            const rateLimit = 'rate-limit-' + key;

            const isExist = await this.redisService.getByKey(rateLimit);
            if (isExist) {
                  const count = Number(await this.redisService.getByKey(rateLimit));
                  if (count >= maxSent) return false;
                  await this.redisService.setByValue(rateLimit, count + 1, expiredTime);
            } else await this.redisService.setByValue(rateLimit, 1, expiredTime);

            return true;
      }

      //-------------------------------Token Service --------------------------------------

      async createReToken(data: User) {
            const authTokenId = await this.createAuthToken(data);
            const reToken = new ReToken();
            reToken.data = authTokenId;
            reToken.userId = data.id;
            await this.reTokenRepository.delete({ userId: data.id });
            const insertedReToken = await this.reTokenRepository.save(reToken);

            return String(insertedReToken.id);
      }

      private async createAuthToken(user: User) {
            const encryptUser = this.encryptToken(user);
            if (!encryptUser) return null;
            const authTokenId = String(uuidv4());

            this.redisService.setByValue(authTokenId, encryptUser, 5);
            return authTokenId;
      }

      async getSocketToken(user: User) {
            const authTokenId = uuidv4();

            this.redisService.setObjectByKey(authTokenId, user, 1440);
            return authTokenId;
      }

      async getAuthTokenByReToken(reTokenId: string) {
            const reToken = await this.reTokenRepository.findOneByField('id', reTokenId);
            if (!reToken) return null;

            const isStillExit = await this.redisService.getByKey(reToken.data);
            if (!isStillExit) {
                  const user = await this.userRepository.findOneByField('id', reToken.userId);
                  const newReToken = await this.createAuthToken(user);
                  if (!newReToken) return null;
                  reToken.data = newReToken;
                  const updateReToken = await this.reTokenRepository.save(reToken);
                  return updateReToken.data;
            }

            return reToken.data;
      }

      async getUserByAuthToken(authTokenId: string) {
            const authToken = await this.redisService.getByKey(authTokenId);
            if (!authToken) return null;

            return await this.verifyToken<User>(authToken);
      }

      async clearToken(userId: string) {
            return await this.reTokenRepository.delete({ userId });
      }

      //--------------------------------Encrypt Decrypt Service -------------------------------

      encryptToken(tokenData: Record<any, any>) {
            try {
                  return this.jwtService.sign(JSON.stringify(tokenData));
            } catch (err) {
                  return null;
            }
      }

      verifyToken<T>(tokenData: string) {
            try {
                  return this.jwtService.verify<any>(tokenData) as T;
            } catch (err) {
                  return null;
            }
      }

      async encryptString(data: string): Promise<string> {
            return await bcrypt.hash(data, 5);
      }

      async decryptString(data: string, encryptedPassword: string): Promise<boolean> {
            return bcrypt.compare(data, encryptedPassword);
      }

      //--------------------------------User IP Service -------------------------------

      parseIp(req: any) {
            return (
                  (typeof req.headers['x-forwarded-for'] === 'string' && req.headers['x-forwarded-for'].split(',').shift()) ||
                  req.connection?.remoteAddress ||
                  req.socket?.remoteAddress ||
                  req.connection?.socket?.remoteAddress
            );
      }
}
