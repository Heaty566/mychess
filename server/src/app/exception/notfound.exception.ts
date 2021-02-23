import { ExceptionFilter, Catch, ArgumentsHost, NotFoundException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

//* Internal import
import { ApiResponse } from '../interface/ApiResponse';

@Catch(NotFoundException)
export class NotFoundApiHandler implements ExceptionFilter {
      catch(_: NotFoundException, host: ArgumentsHost) {
            const ctx = host.switchToHttp();
            const res = ctx.getResponse<Response>();

            const resApi: ApiResponse<void> = {
                  message: 'This method is undefined',
            };
            return res.send(resApi).status(HttpStatus.NOT_FOUND);
      }
}
