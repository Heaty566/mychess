import { RedisClient } from 'redis';
import { Injectable, Inject } from '@nestjs/common';
import * as flat from 'flat';

//----- Service
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class RedisService {
      constructor(@Inject('RedisClient') private readonly redisRepository: RedisClient, private readonly logger: LoggerService) {}

      /**
       *
       * @param expired amount time for redis value to be expired( 1 = 60s )
       */
      setObjectByKey(key: string, value: Record<string, any>, expired?: number) {
            const flatValue: Record<string, any> = flat(value);
            const convertToString = JSON.stringify(flatValue);

            return new Promise<boolean>((res, rej) => {
                  this.redisRepository.set(key, convertToString, (error) => {
                        if (error) {
                              this.logger.print(error, 'redis.service.ts', 'error');
                              return rej(false);
                        }
                        if (expired) this.redisRepository.expire(key, expired * 60);
                        return res(true);
                  });
            });
      }

      deleteByKey(key: string) {
            return new Promise<boolean>((res, rej) => {
                  this.redisRepository.del(key, (error) => {
                        if (error) {
                              this.logger.print(error, 'redis.service.ts', 'error');
                              return rej(false);
                        }
                        return res(true);
                  });
            });
      }

      getObjectByKey<T>(key: string) {
            return new Promise<T>((res, rej) => {
                  this.redisRepository.get(key, (err, data) => {
                        if (err) {
                              this.logger.print(err, 'redis.service.ts', 'error');
                              return rej(null);
                        }

                        const convertToJson = flat.unflatten(JSON.parse(data));
                        res(convertToJson as T);
                  });
            });
      }

      /**
       *
       * @param expired amount time for redis value to be expired( 1 = 60s )
       */
      setByValue(key: string, value: number | string, expired?: number) {
            return new Promise<boolean>((res, rej) => {
                  this.redisRepository.set(key, String(value), (error) => {
                        if (error) {
                              this.logger.print(error, 'redis.service.ts', 'error');
                              return rej(false);
                        }
                        if (expired) this.redisRepository.expire(key, expired * 60);
                        return res(true);
                  });
            });
      }

      getByKey(key: string): Promise<string> {
            return new Promise((res, rej) => {
                  this.redisRepository.get(key, (err, data) => {
                        if (err) {
                              this.logger.print(err, 'redis.service.ts', 'error');
                              return rej(null);
                        }

                        res(data);
                  });
            });
      }

      getAllKeyWithPattern(pattern: string): Promise<string[]> {
            return new Promise((res, rej) => {
                  this.redisRepository.keys(pattern, (err, data) => {
                        if (err) {
                              this.logger.print(err, 'redis.service.ts', 'error');
                              return rej(null);
                        }

                        res(data);
                  });
            });
      }
}
