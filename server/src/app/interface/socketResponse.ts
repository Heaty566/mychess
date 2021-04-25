import { WsException } from '@nestjs/websockets';
import { LocalesService } from '../../utils/locales/locales.service';
import { ResponseBody, ErrorType, ServerResponse } from './api.interface';

export interface SocketResponse<T> extends ResponseBody<T> {
      statusCode: number;
}
export interface SocketServerResponse<T> extends ServerResponse<T> {
      statusCode: number;
}

export class IOResponse {
      constructor(private readonly localeService: LocalesService) {}

      public sendError<T>(body: ResponseBody<T>, type: ErrorType) {
            const data: SocketServerResponse<T> = { ...this.localeService.translateResponse(body), statusCode: null };

            switch (type) {
                  case 'BadGatewayException':
                        data.statusCode = 502;
                        break;
                  case 'BadRequestException':
                        data.statusCode = 400;
                        break;
                  case 'InternalServerErrorException':
                        data.statusCode = 500;
                        break;
                  case 'UnauthorizedException':
                        data.statusCode = 401;
                        break;
                  case 'NotFoundException':
                        data.statusCode = 404;
                        break;
                  case 'ForbiddenException':
                        data.statusCode = 403;
                        break;
            }
            return new WsException(data);
      }

      public send<T>(event: string, body: ResponseBody<T>) {
            const data: SocketServerResponse<T> = {
                  ...this.localeService.translateResponse(body),
                  statusCode: 200,
            };

            return { data, event };
      }
}
export const ioResponse = new IOResponse(new LocalesService());
