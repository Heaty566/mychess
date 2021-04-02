import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { createClient } from 'redis';

import { AppModule } from './app.module';
import { router } from './router';

async function bootstrap() {
      const app = await NestFactory.create(AppModule);

      const logger = new Logger('SERVER');

      //init all middleware
      router(app);
      const port = process.env.PORT || 4000;
      const redisPort = Number(process.env.REDIS_PORT) || 7000;

      const redisClient = createClient({ port: redisPort, host: process.env.REDIS_HOST || '' });

      await app.listen(port, () => {
            redisClient.ping((err, data) => {
                  if (err) logger.error(err);
                  logger.log(`Connect to redis: ${data}`);
            });

            logger.log(`Listening on port ${port}`);
            logger.log(`Current mode: ${process.env.NODE_ENV}`);
            logger.log(`Cors allows access: ${process.env.CLIENT_URL}`);
            logger.log(`Database Information: ${process.env.DB_URL}`);
            logger.log('Ready for service');
      });
}
bootstrap();
