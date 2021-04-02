import { ExceptionFilter, Catch, InternalServerErrorException, HttpException, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
//* Internal import

@Catch(InternalServerErrorException)
export class RuntimeApiHandler implements ExceptionFilter {
      catch(exception: HttpException, host: ArgumentsHost) {
            const ctx = host.switchToHttp();
            const response = ctx.getResponse<Response>();
            const status = exception.getStatus();

            return response.status(status).json({
                  statusCode: status,
                  timestamp: new Date().toISOString(),
                  body: { data: null, message: 'something went wrong, please try again later' },
            });
      }
}
