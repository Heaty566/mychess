import { ExceptionFilter, Catch, NotFoundException, HttpException, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
//* Internal import

@Catch(NotFoundException)
export class NotFoundApiHandler implements ExceptionFilter {
      catch(exception: HttpException, host: ArgumentsHost) {
            const ctx = host.switchToHttp();
            const response = ctx.getResponse<Response>();
            const status = exception.getStatus();

            return response.status(status).json({
                  statusCode: status,
                  timestamp: new Date().toISOString(),
                  body: { message: 'this method is undefined' },
            });
      }
}
