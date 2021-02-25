import { Injectable, Inject } from '@nestjs/common';
import { Logger } from 'winston';

@Injectable()
export class LoggerService {
      constructor(@Inject('Logger') private readonly winstonLogger: Logger) {}

      print(content: any, type: 'info' | 'error' | 'debug' | 'warn') {
            if (process.env.NODE_ENV !== 'test') {
                  return this.winstonLogger[type](content);
            }
      }
}
