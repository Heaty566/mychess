import { WsException } from '@nestjs/websockets';
import { Server } from 'socket.io';
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
            return new WsException(this.mapError<T>(body, type));
      }

      public mapError<T>(body: ResponseBody<T>, type: ErrorType) {
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
            return data;
      }

      public getSocketServer(server: Server) {
            return {
                  socketEmitToRoom<T>(event: string, id: string, body: ResponseBody<T>, to: string) {
                        server.to(to + '-' + id).emit(event, ioResponse.mapData<T>(body));
                  },
                  socketEmitToRoomError(type: ErrorType, id: string, body: ResponseBody<any>, to = 'user') {
                        server.to(to + '-' + id).emit('exception', ioResponse.mapError(body, type));
                  },
            };
      }

      public mapData<T>(body: ResponseBody<T>): SocketServerResponse<T> {
            return {
                  ...this.localeService.translateResponse(body),
                  statusCode: 200,
            };
      }

      public send<T>(event: string, body: ResponseBody<T>) {
            const data: SocketServerResponse<T> = this.mapData<T>(body);

            return { data, event };
      }
}
export const ioResponse = new IOResponse(new LocalesService());
