import { Module } from '@nestjs/common';
import { createClient } from 'redis';

//---- Utils
import { LoggerModule } from '../logger/logger.module';

//---- Service
import { RedisService } from './redis.service';

@Module({
      imports: [LoggerModule],
      controllers: [],
      providers: [
            RedisService,
            {
                  provide: 'RedisClient',
                  useFactory: () => {
                        const redisPort = Number(process.env.REDIS_PORT) || 7000;
                        const redis = createClient({ port: redisPort, host: process.env.REDIS_HOST || '' });
                        redis.select(process.env.REDIS_DB_NUMBER || 1);
                        return redis;
                  },
            },
      ],
      exports: [RedisService],
})
export class RedisModule {}
