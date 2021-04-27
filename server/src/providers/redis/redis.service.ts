import { RedisClient } from 'redis';
import { Injectable, Inject } from '@nestjs/common';
import * as flat from 'flat';

//----- Service
import { LoggerService } from '../../utils/logger/logger.service';

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

            this.redisRepository.set(key, convertToString);
            if (expired) this.redisRepository.expire(key, expired * 60);
            return Promise.resolve();
      }

      deleteByKey(key: string) {
            this.redisRepository.del(key);
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
            if (expired) this.redisRepository.setex(key, expired * 60, String(value));
            else this.redisRepository.set(key, String(value));
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

      /**
       *
       * @param expired amount time for redis value to be expired( 1 = 60s )
       */
      setArrayByKey<T>(key: string, value: T[], expired?: number) {
            const convertToString = JSON.stringify(value);
            this.redisRepository.set(key, convertToString);
            if (expired) this.redisRepository.expire(key, expired * 60);
      }

      // getArrayByKey<T>(key) {
      //       return new Promise<T[]>((res, rej) => {
      //             this.redisRepository.get(key, (err, data) => {
      //                   if (err) {
      //                         this.logger.print(err, 'redis.service.ts', 'error');
      //                         return rej(null);
      //                   }
      //                   const convertToJson = JSON.parse(data);
      //                   res(convertToJson as T[]);
      //             });
      //       });
      // }

      getArrayByKey<T extends Array<any>>(key: string) {
            return new Promise<T>((res, rej) => {
                  this.redisRepository.get(key, (err, data) => {
                        if (err) {
                              this.logger.print(err, 'redis.service.ts', 'error');
                              return rej(null);
                        }
                        const convertToJson = JSON.parse(data);
                        res(convertToJson as T);
                  });
            });
      }
}
