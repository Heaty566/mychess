import { Module } from '@nestjs/common';
import { createLogger, transports, format } from 'winston';

//----- Service
import { LoggerService } from './logger.service';

const { combine, prettyPrint, colorize, printf, label, timestamp } = format;
const loggingFileURL = './log';

const formatLogger = printf((log) => {
      return `${log.label}:${log.timestamp} ${log.level}: ${log.message}`;
});

@Module({
      controllers: [],
      providers: [
            LoggerService,
            {
                  provide: 'Logger',
                  useFactory: () => {
                        return createLogger({
                              transports: [
                                    new transports.File({
                                          filename: `${loggingFileURL}/error.log`,
                                          level: 'error',
                                          format: combine(timestamp(), prettyPrint()),
                                    }),

                                    new transports.File({
                                          filename: `${loggingFileURL}/information.log`,
                                          level: 'info',
                                          format: combine(timestamp(), prettyPrint()),
                                    }),
                                    new transports.Console({
                                          format: combine(timestamp(), colorize(), label({ label: '[SERVER]' }), formatLogger),
                                    }),
                              ],
                        });
                  },
            },
      ],
      exports: [LoggerService],
})
export class LoggerModule {}
