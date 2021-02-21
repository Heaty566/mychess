import { ExceptionFilter, Catch, ArgumentsHost, NotFoundException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { Response } from 'express';

//* Internal import
import { ApiResponse } from '../interface/ApiResponse';

@Catch(InternalServerErrorException)
export class RuntimeApiHandler implements ExceptionFilter {
      catch(_: NotFoundException, host: ArgumentsHost) {
            const ctx = host.switchToHttp();
            const res = ctx.getResponse<Response>();
            const resApi: ApiResponse<void> = {
                  data: null,
                  message: 'Something went wrong, Please try again later.',
            };

            return res.send(resApi).status(HttpStatus.INTERNAL_SERVER_ERROR);
      }
}
