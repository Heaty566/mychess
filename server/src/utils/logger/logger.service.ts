import { Injectable, Inject } from '@nestjs/common';
import { Logger } from 'winston';

@Injectable()
export class LoggerService {
      constructor(@Inject('Logger') private readonly winstonLogger: Logger) {}

      /**
       *
       * @description logger for system, allow tracking error when it occurs
       */
      print(content: any, where: string, type: 'info' | 'error' | 'debug' | 'warn') {
            if (process.env.NODE_ENV !== 'test') {
                  const message = {
                        content,
                        where,
                  };
                  this.winstonLogger[type](message);
                  return this.winstonLogger[type](message.content);
            }
      }
}
