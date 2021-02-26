import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';

@Module({
      controllers: [],
      providers: [
            RedisService,
            {
                  provide: 'RedisClient',
                  useFactory: () => {
                        const redisPort = Number(process.env.REDIS_PORT) || 7000;
                        return createClient({ port: redisPort, host: process.env.REDIS_HOST || '' }).select(process.env.REDIS_DB_NUMBER || 1);
                  },
            },
      ],
      exports: [RedisService],
})
export class RedisModule {}
